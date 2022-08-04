import React, {useEffect, useState} from "react";
import {Image, Table, Space, Spin, Popover, Form, Button} from "antd";
import {dateTimeFromString, defaultImage, getEmpty, renderNumberFormat, renderPOStatus} from "../../util/Helper";
import {GET_WAREHOUSE_PRODUCT} from "../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";
import FilterProduct from "./filter/filter-product";
import {reqGetWarehousePoProduct} from "../../appRedux/services/inventory";
import {Link} from 'react-router-dom';

const TabProduct = () => {
  const dispatch = useDispatch();
  const {pWarehousesList, report, pWarehousePagination} = useSelector(({warehouse}) => warehouse);
  const {pVariantList, pVariantPagination} = useSelector(({warehouse}) => warehouse);
  const [searchForm] = Form.useForm();
  const [visibleSaveFilter, setVisibleSaveFilter] = useState(false);
  const [currentPopover, setCurrentPopover] = useState([]);
  useEffect(() => {
    getProductWarehouse({page: 1});
  }, []);

  const [drawer, setDrawer] = useState({
    visible: false,
    parent: {}
  });

  // const closeDrawer = () => {
  //   setDrawer({
  //     ...drawer,
  //     visible: false
  //   });
  // };

  // const onShowDrawer = current => {
  //   getVariantWarehouse({parentId: current.platform_id});
  //   setDrawer({
  //     ...drawer,
  //     visible: true,
  //     parent: current,
  //     variants: pVariantList
  //   });
  // };

  // const getVariantWarehouse = (params = {}) => {
  //   dispatch({
  //     type: GET_WAREHOUSE_VARIANT,
  //     payload: {
  //       parentId: drawer.parent.platform_id,
  //       ...params
  //     }
  //   });
  // };

  // const changePageVariant = ({current, size}) => {
  //   getVariantWarehouse({page: current});
  // };

  const getProductWarehouse = (params = {}) => {
    const searchParams = {
      ...params,
      ...searchForm.getFieldsValue(),
      ...{
        orderBy: 'time'
      }
    };

    dispatch({
      type: GET_WAREHOUSE_PRODUCT,
      payload: searchParams
    });
    // dispatch({
    //   type: GET_WAREHOUSE_REPORT,
    //   payload: {}
    // });
  };


  return (
    <Spin spinning={false}>
      <FilterProduct
        visibleSaveFilter={visibleSaveFilter}
        setVisibleSaveFilter={setVisibleSaveFilter}
        form={searchForm} onFinishForm={getProductWarehouse}/>
      <Table
        rowKey={'id'}
        dataSource={pWarehousesList}
        pagination={pWarehousePagination}
        onChange={({current, pageSize}) => getProductWarehouse({page: current})}
        columns={[
          {
            title: 'Sản phẩm', dataIndex: 'name', key: 'name',
            render: (name, raw) => {
              return (
                <Space>
                  <Image
                    width={40}
                    height={40}
                    src={raw.product?.image_url}
                    fallback={defaultImage()}
                  />
                  <span>#{raw.product_id} - {raw.product_name}</span>
                </Space>
              )
            }
          },
          {
            title: 'SKU', dataIndex: 'product', key: 'sku',
            render: (value, raw) => {
              return value?.sku
            }
          },
          {
            title: 'Kho', dataIndex: 'warehouse_name', key: 'warehouse_name', render: (w, r) => {
              return (
                <span> {w}</span>
              )
            }
          },
          {
            title: 'Khả dụng', dataIndex: 'hand_in_stock', key: 'hand_in_stock', render: (value, raw) => {
              return renderNumberFormat(value - raw.committed);
            }
          },
          {
            title: 'Ngày GH gần nhất',
            dataIndex: 'purchase',
            key: 'purchase', render: (purchase, raw) => {
              let loading = false;
              return <Popover
                placement={'left'}
                //onMouseLeave={() => setCurrentPopover([])}
                onMouseEnter={async () => {
                  try {
                    loading = true;
                    const response = await reqGetWarehousePoProduct({
                      product_id: raw.product_id,
                      warehouse_id: raw.warehouse_id
                    });
                    if (response.data.success === 1) {
                      setCurrentPopover(response.data.data);
                    }
                  } catch (e) {
                    console.log("e:", e)
                  } finally {
                    loading = false;
                  }
                }}
                content={<Spin spinning={loading}>
                  <Table size={`small`}
                         pagination={false}
                         dataSource={currentPopover}
                         columns={[
                           {
                             title: 'ID',
                             dataIndex: 'id',
                             key: 'id',
                             render: id => <Link to={`/inventory/po/${id}`}>#{id}</Link>
                           },
                           {title: 'Trạng thái', dataIndex: 'status', key: 'status', render:stt => renderPOStatus(stt)},
                           {title: 'Ngày giao dự kiến', dataIndex: 'expected_date', key: 'expected_date'},
                           {
                             title: '', key: 'action', render: raw => {
                               return (
                                 <Link to={`/inventory/po/${raw.id}`}>Chi tiết</Link>
                               )
                             }
                           },
                         ]}
                  />
                </Spin>}
                title={`Danh sách vận chuyển`}>
                {dateTimeFromString(raw?.first_trans?.delivering_date)}
              </Popover>
            }
          },
          {
            title: 'Đã đặt', dataIndex: 'committed', key: 'committed', render: (value, raw) => {
              return renderNumberFormat(value);
            }
          },
          {
            title: 'Tồn kho', dataIndex: 'committed', key: 'committed', render: (value, raw) => {
              return renderNumberFormat(raw.hand_in_stock);
            }
          },
          // {
          //   title: 'Cảnh báo tồn', render: raw => {
          //     return raw.product ? raw.product.inventory_quantity : 0;
          //   }
          // },
          {
            title: 'Chờ nhập'
            , dataIndex: 'waiting_import'
            , key: 'waiting_import'
            , render: value => {
              return renderNumberFormat(value);
            }
          },
        ]}
      />
      {/*<DrawerProduct*/}
      {/*  getVariantWarehouse={getVariantWarehouse}*/}
      {/*  parent={drawer.parent}*/}
      {/*  onClose={closeDrawer}*/}
      {/*  changePageVariant={changePageVariant}*/}
      {/*  pVariantList={pVariantList}*/}
      {/*  pVariantPagination={pVariantPagination}*/}
      {/*  visible={drawer.visible}*/}
      {/*/>*/}
    </Spin>
  )
};
export default TabProduct;

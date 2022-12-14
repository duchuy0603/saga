import React, {useEffect, useState} from "react";
import {Button, Card, Form, Image, message, Modal, Space, Spin, Switch, Table, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {CHANGE_STT_PRODUCT, DELETE_PRODUCT, GET_PRODUCT} from "../../constants/ActionTypes";
import {Link} from "react-router-dom";
import {defaultImage, renderNumberFormat, renderProStt} from "../../util/Helper";
import {DownloadOutlined, EditOutlined, FundViewOutlined, PlusOutlined, SyncOutlined,} from "@ant-design/icons";
import {PRODUCT_STT_ACTIVE, PRODUCT_STT_DRAFT} from "../../constants/constant";
import FilterIndex from "./filter/FilterIndex";
import ProductExport from "./export/ProductExport";
import ModalImport from "./attributes/ModalImport";
import PancakeSyncComponent from "./modal/PancakeSyncComponent";
import {reqPancakeProConnectVariants} from "../../appRedux/services/PancakeSync";

const Product = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    showChildren: false,
    current: null,
  });

  // const [visibleHaravanSyncModal, setVisibleHaravanSyncModal] = useState(false);
  const [visiblePancakeSyncModal, setVisiblePancakeSyncModal] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [currentSync, setCurrentSync] = useState(null);
  const [isSyncLoading, setSyncLoading] = useState(false);
  // const [productDisabled, setProductDisabled] = useState([]);
  // const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const {products, pagination, isListLoading} = useSelector(({product}) => product);
  // const {warehouses} = useSelector(({warehouse}) => warehouse);
  // const {vendors} = useSelector(({vendor}) => vendor);
  const {productPancake, setProductPancake} = useState([]);
  const [syncLoad, setSyncLoad] = useState(false);

  const getProducts = (pageParams) => {
    const searchParams = searchForm.getFieldsValue();
    dispatch({
      type: GET_PRODUCT,
      payload: {
        ...pageParams,
        ...searchParams
      }
    });
  };

  const onChangePage = (pageParams) => {
    const {current, pageSize} = pageParams;
    getProducts({page: current, pageSize});
  };

  // h??m x??a s???n ph???m
  const onDelete = productId => {
    // dispatch action DELETE_PRODUCT
    dispatch({
      type: DELETE_PRODUCT,
      payload: {
        productId
      }
    });
  };

  const processSync = (key, isLoading = true) => {
    const syncLoadings = state.syncLoadings;
    syncLoadings[key] = isLoading;
    setState({
      ...state,
      syncLoadings
    })
  };

  useEffect(() => {
    const paramsKey = props.history.location.search;
    let objParams = Object.fromEntries(new URLSearchParams(paramsKey));
    Object.keys(objParams).forEach(key => {
      if (objParams[key] === undefined) {
        delete objParams[key];
      }
    });
    searchForm.setFieldsValue(objParams);
    getProducts({page: 1, pageSize: 15});
    // dispatch({
    //   type: GET_VENDOR,
    //   payload: {page: -1, type: CUSTOMER_TYPE_VENDOR}
    // });
    // dispatch({
    //   type: GET_WAREHOUSE,
    //   payload: {
    //     page: -1,
    //     active: STATUS.WAREHOUSE.ACTIVE
    //   }
    // });
  }, []);

  // const onSaveWarehouse = async (data) => {
  //   if (data.packages.length <= 0) {
  //     message.error('H??y ch???n s???n ph???m nh???p kho!');
  //     return;
  //   }
  //   setVisibleWarehouseModal(false);
  //
  //   try {
  //     let po = {
  //       ...data,
  //       wh_to_name: data.warehouse_name,
  //       wh_from_name: data.wh_from_name,
  //       po_type: PO_TYPE_IMPORT,
  //       transaction_type: TRANSACTION_IMPORT,
  //       items: data.packages,
  //     };
  //     await reqCreatePoViaProduct(po);
  //     message.success('???? t???o phi???u nh???p kho th??nh c??ng, xin vui l??ng chuy???n ?????n m???c v???n chuy???n ????? theo d??i!', 3);
  //     setVisibleWarehouseModal(false);
  //     form.resetFields();
  //   } catch (e) {
  //     message.error(e.message);
  //   } finally {
  //     setSaveWarehouseLoading(false);
  //   }
  // };

  // const showChildren = (product) => {
  //   setState({
  //     ...state,
  //     showChildren: true,
  //     current: product
  //   })
  // };
  // const hideChildren = () => {
  //   setState({
  //     ...state,
  //     showChildren: false,
  //     current: null
  //   })
  // };

  // const onCloseHaravanModal = () => {
  //   setVisibleHaravanSyncModal(false);
  //   getProducts();
  // };
  const renderExpandedRow = row => {
    return <Table pagination={false} size={`small`} dataSource={row.childrens}
                  rowKey={`id`}
                  columns={[
                    {
                      title: 'S???n ph???m', key: 'name', dataIndex: 'name', render: (name, raw) => {
                        return <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                          <Image
                            width={50}
                            height={50}
                            src={raw.image_url ?? 'error'}
                            fallback={defaultImage()}
                          />
                          <Space className={`pl-1`} size={1} direction={`vertical`}>
                            <Link to={`/product/${raw.id}`}>
                              <small>{raw.name}</small>
                            </Link>
                            <small>Barcode: {raw.barcode}</small>
                            <small>Tr???ng th??i: {renderProStt(raw.status)}</small>
                          </Space>
                        </div>
                      }
                    },
                    {title: 'SKU', dataIndex: 'sku', key: 'sku', render: sku => <small>{sku}</small>},
                    // {
                    //   title: 'Platform',
                    //   dataIndex: 'platform',
                    //   key: 'platform',
                    //   render: (platform, raw) => {
                    //     return <Tooltip title={raw.platform_id}>
                    //       <Badge color={platform ? 'green' : 'red'} text={platform ?? 'Ch??a ?????ng b???'} />
                    //     </Tooltip>
                    //   }
                    // },
                    {
                      title: 'Gi??', dataIndex: 'price', key: 'price', render: price => {
                        return renderNumberFormat(price)
                      }
                    },
                    {
                      title: '', key: 'action', render: (raw) => {
                        return <Space align={`center`}>
                          <Switch onChange={e => {
                            dispatch({
                              type: CHANGE_STT_PRODUCT,
                              payload: {
                                productId: raw.id,
                                product: {
                                  status: e ? PRODUCT_STT_ACTIVE : PRODUCT_STT_DRAFT
                                }
                              }
                            })
                          }} size={`small`} defaultChecked={raw.status === 'active'} />
                          {/*<Button shape="round"*/}
                          {/*        onClick={() => onSyncPancake(raw)}*/}
                          {/*        className={`mb-0`}*/}
                          {/*        size={`small`}*/}
                          {/*        icon={<SyncOutlined size={`small`}/>}*/}
                          {/*        type={`dashed`}*/}
                          {/*        danger> Sync</Button>*/}
                        </Space>
                      }
                    },

                  ]} />
  };

  const onClosePancake = () => {
    setVisiblePancakeSyncModal(false);
    setCurrentSync(null);
    getProducts();
  };
  const onSyncPancake = async (product = null) => {
    // setVisiblePancakeSyncModal(true)
    try {
      setSyncLoading(true);
      await reqPancakeProConnectVariants(product.id);
      message.success('?????ng b??? th??nh c??ng!');
    } catch (e) {
      message.error(e.message);
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div>
      <Spin spinning={isListLoading}>
        <Card title={`Danh s??ch s???n ph???m`} extra={
          <Space>
            <Button type={`dashed`} size={`small`}
                    onClick={onSyncPancake}><SyncOutlined />
              Pancake Sync
            </Button>
            {/*<Button type={`dashed`} size={`small`}*/}
            {/*        onClick={() => setVisibleHaravanSyncModal(true)}><SyncOutlined/> Haravan*/}
            {/*  Sync</Button>*/}
            <Link to="/product/import-warehouse">
              <Button type={`dashed`} size={`small`}>
                <DownloadOutlined />T???o y??u c???u nh???p kho</Button>
            </Link>
            <Link to="/product/create">
              <Button size={`small`} type={`primary`}><PlusOutlined /> T???o s???n ph???m</Button>
            </Link>
          </Space>
        }>
          <div className={`d-flex space-between`}>
            <FilterIndex form={searchForm} onFinish={data => {
              Object.keys(data).forEach(key => {
                if (data[key] === undefined) {
                  delete data[key];
                }
              });
              props.history.push({
                search: new URLSearchParams(data).toString()
              })
            }} />
            <div>
              <Button onClick={() => setImportVisible(true)} size={`small`} type={`primary`}>Nh???p Excel</Button>
              <ProductExport page={pagination.current} data={products} />
            </div>

          </div>
          <Table
            rowKey={`id`}
            dataSource={products}
            pagination={pagination}
            onChange={onChangePage}
            expandable={{
              expandedRowRender: row => renderExpandedRow(row)
            }}
            columns={[
              {
                title: 'ID - Name', dataIndex: 'id', key: 'id',
                render: (id, raw) => {
                  return (
                    <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                      <Image
                        width={80}
                        height={80}
                        src={raw.image_url ?? 'error'}
                        fallback={defaultImage()}
                      />
                      <Space className={`pl-1`} size={1} direction={`vertical`}>
                        <Link to={`/product/${raw.id}`}>
                          {raw.name}
                        </Link>
                        <small>Barcode: {raw.barcode}</small>
                        <small>Tr???ng l?????ng: {raw.weight}</small>
                      </Space>
                    </div>
                  )
                }
              },
              {title: 'Barcode', dataIndex: 'barcode', key: 'barcode'},
              {title: 'SKU', dataIndex: 'sku', key: 'sku'},
              // {title: 'Nh?? s???n xu???t', dataIndex: 'manufacture_name', key: 'manufacture_name'},
              // {title: '????n v???', dataIndex: 'unit', key: 'unit'},
              {title: 'C???nh b??o t???n t???ng/ T???ng kho', dataIndex: 'stock_warn', key: 'stock_warn'},
              {
                title: '???? ?????ng b???', dataIndex: 'platform_list', 'key': 'platform_list',
                render: (platformList) => {
                  return <Space direction={'vertical'} size={'small'}>
                    {platformList?.map(p => {
                      return <Tag key={`tag_${p.platform_id}`}
                                  color="success"
                                  title={p.platform_id}>
                        {p.platform}
                      </Tag>
                    })}
                  </Space>
                }
              },
              {
                title: '', key: 'action', render: raw => {
                  return (
                    <Space>
                      <Link to={`/product/${raw.id}`}>
                        <Button size={`small`} primary>
                          <FundViewOutlined />
                        </Button>
                      </Link>
                      <Link to={`/product/update/${raw.id}`}>
                        <Button size={`small`} primary>
                          <EditOutlined />
                        </Button>
                      </Link>
                      <Button loading={isSyncLoading}
                              onClick={() => onSyncPancake(raw)}
                              icon={<SyncOutlined />}
                              size={`small`} danger
                              type={`dashed`}>
                        ?????ng b???
                      </Button>
                      {/*<Popconfirm*/}
                      {/*  title={`Xo?? s???n ph???m n??y?`}*/}
                      {/*  onConfirm={() => onDelete(raw.id)}*/}
                      {/*>*/}
                      {/*  <Button size={`small`} danger type={`dashed`}>*/}
                      {/*    <DeleteOutlined/>*/}
                      {/*  </Button>*/}
                      {/*</Popconfirm>*/}
                    </Space>
                  )
                }
              }
            ]}
          />
        </Card>
      </Spin>
      <Modal
        width={920}
        onCancel={onClosePancake}
        title={`Pancake sync`}
        visible={visiblePancakeSyncModal}
        footer={[
          <Button onClick={onClosePancake}>????ng</Button>
        ]}
      >
        <PancakeSyncComponent current={currentSync} />
      </Modal>
      {/*<Modal*/}
      {/*  width={720}*/}
      {/*  onCancel={() => setVisibleWarehouseModal(false)}*/}
      {/*  visible={visibleWarehouseModal}*/}
      {/*  title={`Nh???p kho s???n ph???m`}*/}
      {/*  footer={<Space>*/}
      {/*    <small className={`text-note danger`}>* Th??ng tin b???t bu???c</small>*/}
      {/*    <Button onClick={() => setVisibleWarehouseModal(false)}>H???y</Button>*/}
      {/*    <Button loading={saveWarehouseLoading} type={`primary`} htmlType={`submit`}*/}
      {/*            form={`pWarehouseForm`}>L??u</Button>*/}
      {/*  </Space>}*/}
      {/*>*/}
      {/*  <Form*/}
      {/*    autoComplete="off"*/}
      {/*    initialValues={*/}
      {/*      {*/}
      {/*        packages: packages*/}
      {/*      }*/}
      {/*    }*/}
      {/*    id={`pWarehouseForm`}*/}
      {/*    form={form}*/}
      {/*    {...{*/}
      {/*      ...formWrap,*/}
      {/*      labelCol: {*/}
      {/*        xs: 10*/}
      {/*      },*/}
      {/*    }}*/}
      {/*    onFinish={onSaveWarehouse}*/}
      {/*  >*/}
      {/*    <Form.Item name={`wh_from_name`} hidden><Input/></Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      label={`Nh?? cung c???p`}*/}
      {/*      name={`wh_from_id`}*/}
      {/*      rules={[{required: true, message: 'Ch???n nh?? cung c???p!'}]}*/}
      {/*    >*/}
      {/*      <SelectCustomer*/}
      {/*        form={form}*/}
      {/*        keyName={`wh_from_id`}*/}
      {/*        placeholder={`Nh???p t??n nh?? cung c???p...`}*/}
      {/*        type={`vendor`}/>*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item name={`warehouse_name`} hidden><Input/></Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      label={`Kho`}*/}
      {/*      rules={[{required: true, message: 'Ch???n kho l??u s???n ph???m!'}]}*/}
      {/*      name={`wh_to_id`}*/}
      {/*    >*/}
      {/*      <Select onChange={(val, evt) => setName('warehouse_name', evt.children)}>*/}
      {/*        {warehouses !== null ? warehouses.map(warehouse => {*/}
      {/*          return <Select.Option value={warehouse.id}>{warehouse.name}</Select.Option>*/}
      {/*        }) : null}*/}
      {/*      </Select>*/}


      {/*    </Form.Item>*/}
      {/*    <WarehouseProduct*/}
      {/*      form={form}*/}
      {/*      packages={packages}*/}
      {/*      setPackages={setPackages}*/}
      {/*      products={products}/>*/}
      {/*  </Form>*/}
      {/*</Modal>*/}
      {/*<ProductChildren*/}
      {/*  visible={state.showChildren}*/}
      {/*  product={state.current}*/}
      {/*  onDelete={onDelete}*/}
      {/*  onClose={hideChildren}*/}
      {/*/>*/}
      <ModalImport
        callback={getProducts}
        importType={`product`}
        visible={importVisible}
        setVisible={setImportVisible}
      />
    </div>
  )
};
export default Product;

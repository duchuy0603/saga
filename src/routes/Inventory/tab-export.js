import React, {useEffect, useRef} from "react";
import {Button, Checkbox, Form, Popconfirm, Space, Spin, Table, Tag} from "antd";
import {
  dateTimeFromString, defaultFormatDateTime,
  renderCarrier, renderNumberFormat,
  renderPoPackingStatus,
  renderPOStatus,
  renderPOType
} from "../../util/Helper";
import {GET_PO} from "../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";
import {PO_TYPE_EXPORT, PO_TYPE_IMPORT} from "../../constants/constant";
import {Link} from "react-router-dom";
import FilterExport from "./filter/filter-export";
import {PrinterOutlined} from "@ant-design/icons";
import PoTrackingPrintContent from "../../components/PoTrackingPrintContent";
import {useReactToPrint} from "react-to-print";
import {onCountPrint} from "../../appRedux/actions";

const TabExport = () => {
  const {purchaseOrders, listLoading, pagination} = useSelector(({inventory}) => inventory);
  const {carriers} = useSelector(({auth}) => auth);
  const [searchForm] = Form.useForm();
  const dispatch = useDispatch();

  const refPoPrintContent = useRef();
  const handlePrint = useReactToPrint({
    onAfterPrint: () => onCountPrint(purchaseOrders),
    content: () => refPoPrintContent.current
  });
  useEffect(() => {
    getPurchaseOrders();
  }, []);

  const getPurchaseOrders = (params = {}) => {
    const fValues = searchForm.getFieldsValue();
    const getParams = {
      ...params,
      ...fValues,
      po_type: PO_TYPE_EXPORT
    };

    dispatch({
      type: GET_PO,
      payload: getParams
    });
  };

  const onChangePage = ({current, pageSize}) => {
    getPurchaseOrders({page: current});
  };

  const renderExpandedRow = (row) => {
    return <>
      <Table pagination={false}
             rowKey="id"
             size={'small'}
             columns={[
               {
                 title: "Sản phẩm",
                 dataIndex: 'title',
                 key: 'po_item_title',
                 render: (id, r) => {
                   return <Space size={"small"} direction={"vertical"}>
                     <strong>{r.title}</strong>
                     <small className='text-mute'>Loại: {r.platform_variant_title}</small>
                   </Space>
                 }
               },
               {
                 title: "Số lượng",
                 dataIndex: 'quantity',
                 key: 'po_item_quantity',
                 render: (value, r) => {
                   return renderNumberFormat(value);
                 }
               }
             ]}
             dataSource={row.po_items}
      />
    </>
  };

  return (
    <Spin spinning={listLoading}>
      <FilterExport form={searchForm} onFinishForm={getPurchaseOrders}/>
      <div style={{display: "none"}}>
        <PoTrackingPrintContent
          multiple
          ref={refPoPrintContent}
          po={purchaseOrders}/>
      </div>
      <div className="d-flex align-center">
        <Popconfirm onConfirm={handlePrint} title={`In toàn bộ phiếu hiển thị?`}>
          <Button className={`m-0`} type={`dashed`} size={`small`}>
            <PrinterOutlined/> In vận đơn
          </Button>
        </Popconfirm>
        {/*<Checkbox onChange={e => getPurchaseOrders({print_count: e.target.checked ? 0 : null})} className={'ml-1'}>*/}
        {/*  Phiếu chưa in</Checkbox>*/}
      </div>
      <Table
        rowKey="id"
        onChange={onChangePage}
        dataSource={purchaseOrders}
        pagination={pagination}
        expandable={{
          expandedRowRender: row => renderExpandedRow(row)
        }}
        columns={[
          {
            title: "Phiếu xuất",
            dataIndex: 'id',
            key: 'id',
            render: (id, r) => {
              return <Space size={"small"} direction={"vertical"}>
                <Link to={`/inventory/po/${id}`}>#PO-UOA{id}</Link>
                <small className='text-mute'>Loại: {renderPOType(r.po_type)}</small>
              </Space>
            }
          },
          {
            title: "Kho",
            dataIndex: 'wh_from_name',
            key: 'wh_from_name',
            render: (w, r) => {
              let to = "---";
              if (r.po_type === PO_TYPE_IMPORT) {
                to = r.wh_to_name;
              }
              if (!r.address_info) {
                to = r.address_info?.shipping_name;
              }
              return w;
            }
          },
          {
            title: 'Khách hàng', key: 'customer', render: (v, r) => {
              return r.customer_name;
            }
          },
          {
            title: "Trạng thái", dataIndex: 'status', key: 'status', render: (status) => {
              return renderPOStatus(status);
            }
          },
          {
            title: "ĐVVC",
            dataIndex: 'carrier',
            key: 'carrier',
            render: (key, raw) => {
              return <Space size={"small"} direction={"vertical"}>
                <span>{renderCarrier(key, carriers)}</span>
                <small>Mã vận đơn: {raw.tracking_number}</small>
              </Space>
            }
          },
          {
            title: "Đóng gói",
            dataIndex: 'packing_status',
            key: 'packing_status',
            render: (key, raw) =>
              renderPoPackingStatus(raw.packing_status)
          },
          {
            title: "Nhãn",
            dataIndex: 'brand_id',
            key: 'brand_id',
            render: (key, raw) =>
              raw.brand ? raw.brand.name : <small>Chưa tạo Nhãn</small>
          },
          {
            title: "Tag",
            dataIndex: 'tags',
            key: 'tags',
            render: (value, raw) => {
              if (value) {
                const tags = JSON.parse(value);
                console.log(value, tags);
                return <Space>
                  {tags.map(item => <Tag title={item.code}>{item.name}</Tag>)}
                </Space>
              }
              return "---";
            }
          },
          {
            title: "Ngày tạo",
            dataIndex: 'created_at',
            key: 'created_at',
            render: value => dateTimeFromString(value
              , defaultFormatDateTime
              , ""
              , {
                'fontSize': "12px"
              }
            )
          },
        ]}
      />
    </Spin>
  )
};
export default TabExport;

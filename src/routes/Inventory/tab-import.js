import React, {useEffect, useRef} from "react";
import FilterImport from "./filter/filter-import";
import {Button, Checkbox, Form, Popconfirm, Space, Spin, Table} from "antd";
import {
  dateTimeFromString, defaultFormatDateTime,
  renderNumberFormat,
  renderPOStatus,
  renderPOStockCheck,
  renderPOType
} from "../../util/Helper";
import {GET_PO} from "../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";
import {PO_TYPE_IMPORT} from "../../constants/constant";
import {Link} from "react-router-dom";
import {PrinterOutlined} from "@ant-design/icons";
import PoTrackingPrintContent from "../../components/PoTrackingPrintContent";
import {useReactToPrint} from "react-to-print";
import {onCountPrint} from "../../appRedux/actions";
import PoStampPrintContent from "../../components/PoStampPrintContent";

const TabImport = ({...props}) => {
  const {purchaseOrders, listLoading, pagination} = useSelector(({inventory}) => inventory);
  const [searchForm] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    getPurchaseOrders();
  }, []);

  const getPurchaseOrders = (params = {}) => {
    const fValues = searchForm.getFieldsValue();
    const getParams = {
      ...params,
      ...fValues,
      po_type: PO_TYPE_IMPORT
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
                     <small className='text-mute'>Barcode: {r.barcode}</small>
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
               },
               {
                 title: "Đã kiểm",
                 dataIndex: 'stock_quantity',
                 key: 'po_item_stock_quantity',
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
      <FilterImport form={searchForm} onFinishForm={getPurchaseOrders}/>

      <Table
        onChange={onChangePage}
        dataSource={purchaseOrders}
        pagination={pagination}
        rowKey="id"
        expandable={{
          expandedRowRender: row => renderExpandedRow(row)
        }}
        columns={[
          {
            title: "Phiếu kho",
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
            title: "Từ",
            dataIndex: 'wh_from_name',
            key: 'wh_from_name',
            render: (w, r) => {
              let to = r.wh_to_name;
              return <Space size={"small"} direction={"vertical"}>
                <small>Từ: {w}</small>
                <small>Đến: {to}</small>
              </Space>;
            }
          },
          {
            title: "Trạng thái", dataIndex: 'status', key: 'status', render: (status) => {
              return renderPOStatus(status);
            }
          },
          {
            title: "Kiểm hàng",
            dataIndex: 'stock_check_status',
            key: 'stock_check_status',
            render: (key, raw) =>
              renderPOStockCheck(raw.po_type, key)
          },
          {
            title: "Ngày đến dự kiến",
            dataIndex: 'expected_date',
            key: 'expected_date',
            render: value => dateTimeFromString(value
              , defaultFormatDateTime
              , ""
              , {
                'fontSize': "12px"
              }
            )
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
export default TabImport;

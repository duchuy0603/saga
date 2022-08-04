import React, {useEffect, useRef, useState} from "react";
import {Button, Checkbox, Form, Popconfirm, Space, Spin, Table} from "antd";
import {
  dateTimeFromString, defaultFormatDateTime, renderCarrier, renderNumberFormat,
  renderPoPackingStatus,
  renderPOStatus,
  renderPOStockCheck, renderPOType
} from "../../util/Helper";
import {Link} from "react-router-dom";
import {PO_TYPE_IMPORT} from "../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {GET_PO} from "../../constants/ActionTypes";
import FilterTransfer from "./filter/filter-transfer";
import PoTrackingPrintContent from "../../components/PoTrackingPrintContent";
import {PrinterOutlined} from "@ant-design/icons";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import {reqSavePrintCount} from "../../appRedux/services/inventory";
import {onCountPrint} from "../../appRedux/actions";

const TabPo = ({...props}) => {
  const {purchaseOrders, listLoading, pagination} = useSelector(({inventory}) => inventory);
  const [searchForm] = Form.useForm();
  const {carriers} = useSelector(({auth}) => auth);
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
      ...fValues
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

  return (<Spin spinning={listLoading}>
      <FilterTransfer
        saveFilterName={'FilterAllPo'}
        form={searchForm}
        onFinishForm={getPurchaseOrders}
      />
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
        pagination={pagination}
        onChange={onChangePage}
        rowKey={'id'}
        dataSource={purchaseOrders}
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
              let to = "---";
              if (r.po_type === PO_TYPE_IMPORT) {
                to = r.wh_to_name;
              }
              if (!r.address_info) {
                to = r.address_info?.shipping_name;
              }
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
            title: "Kiểm hàng",
            dataIndex: 'stock_check_status',
            key: 'stock_check_status',
            render: (key, raw) =>
              renderPOStockCheck(raw.po_type, key)
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
export default TabPo;

import {
  Table,
  Alert,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Divider,
  InputNumber,
  Collapse,
  Checkbox,
  Select,
  DatePicker
} from 'antd'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
  formWrap,
  FULFILL_STATUS_DELIVERED,
  FULFILL_STATUS_DELIVERING, FULFILL_STATUS_END, FULFILL_STATUS_FULFILLED, FULFILL_STATUS_UN_FULFILL, GATE_WAYCODE,
  HARAVAN_FINANCE_PAID,
  HARAVAN_FINANCE_PENDING,
  HARAVAN_FINANCE_REFUNDED, ORDER_TRANS_TYPE, PAYMENT_STATUS, REFUND_REASON_WRONG_PRO,
} from "../../../constants/constant";
import SelectRefundReason from "../../../components/Input/SelectRefundReason";
import ProductItems from "./component/ProductItems";
import AdjustmentList from "./component/AdjustmentList";
import Payment from "./component/Payment";
import RefundList from "./component/RefundList";
import {PO_REFUND_CREATE} from "../../../constants/ActionTypes";
import ModalReturnExport from "../../Inventory/modals/ModalReturnExport";


const TabReturn = () => {
  const {order, pos, ots, isListLoading} = useSelector(({order}) => order);
  const [visible, setVisible] = useState(false);
  const [reasonKey, setReasonKey] = useState([]);
  const [formRefund] = Form.useForm();
  const dispatch = useDispatch();
  const renderFinanceStatus = (financeStatus) => {
    switch (financeStatus) {
      case HARAVAN_FINANCE_PENDING:
        return <Alert type={'warning'}
                      message={"Đơn hàng đang trong trạng thái chờ thanh toán, xin vui lòng kiểm tra các khoản thanh toán trước khi tiếp tục"}
                      showIcon
        />;
      case HARAVAN_FINANCE_PAID:
        return <Alert type={'success'}
                      message={"Đơn hàng đã thanh toán"}
                      showIcon
        />;
      case HARAVAN_FINANCE_REFUNDED:
        return <Alert type={'info'}
                      message={"Đơn hàng đã được xử lý hoàn trả"}
                      showIcon
        />;
      default:
        return <Alert type={'info'} message={"Đơn hàng chưa được thanh toán, hệ thống sẽ hoàn trả 0 đồng"} showIcon/>;
    }
  };

  const renderFulfilment = () => {
    switch (order.fulfillment_status) {
      case FULFILL_STATUS_UN_FULFILL:
        return <Alert message={'Đơn hàng chưa xử lý vận chuyển'} type={'warning'} showIcon/>;
      case FULFILL_STATUS_DELIVERING:
        return <Alert message={'Đơn hàng đang được giao'} type={'warning'} showIcon/>;
      case FULFILL_STATUS_DELIVERED:
        return <Alert message={'Đơn hàng đã vận chuyển đến nơi'} type={'success'} showIcon/>;
      case FULFILL_STATUS_FULFILLED:
        return <Alert message={'Đơn hàng đang xử lý vận chuyển'} type={'warning'} showIcon/>;
      case FULFILL_STATUS_END:
        return <Alert message={'Đơn hàng đã kết thúc vận chuyển'} type={'success'} showIcon/>;
      default:
        return <Alert message={'Đơn hàng chờ xử lý vận chuyển'} type={'warning'} showIcon/>
    }
  };
  const onCreateTurn = () => {
    setVisible(true);
  }

  const setActive = (evt) => {
    const {target} = evt;
    console.log("Evt: ", evt)
    if (target.checked) {
      setReasonKey([
        ...reasonKey,
        target.value
      ])
    } else {
      setReasonKey(reasonKey.filter(key => key !== target.value))
    }
  }
  useEffect(() => {
    formRefund.setFieldsValue({
      items: order.order_items.map(item => {
        return {
          ...item,
          currentQty: item.quantity,
          price_original: 0,
          quantity: 0
        }
      })
    })
  }, [])
  const onFinish = (data) => {
    let formData = data;
    if (reasonKey.includes('refund')) {
      formData = {
        ...data,
        is_refund_order: true
      }
    }
    dispatch({
      type: PO_REFUND_CREATE,
      payload: data
    })
    console.log("Data: ", formData)
  }
  return (
    <div>
      <Space direction={'vertical'} size={'small'}>
        <Button onClick={onCreateTurn} size={`small`} danger>Tạo phiếu yêu cấu đổi trả</Button>
        {renderFinanceStatus(order.finance_status)}
        {renderFulfilment()}
        <small className='text-mute'>* Đơn hàng chỉ được hoàn trả khi trạng thái vận chuyển đã hoàn tất</small>
        <small className='text-mute'>** Đối với đơn hàng đang chờ thanh toán, kiểm tra lại tình trạng thanh toán trước
          khi hoàn trả</small>
        <small className='text-mute'>*** Đối với đơn hàng chưa vận chuyển và chưa thanh toán, hoàn trả sẽ được tính như
          là hủy đơn hàng</small>
        <small className='text-mute'>**** Đối với đơn hàng chưa xử lý vận chuyển hoặc bị hủy vận chuyển, hoàn trả sẽ tự
          động chuyển về tồn kho</small>
        <Table
          dataSource={[]}
          columns={
            [
              {title: "ID"},
              {title: "Sản phẩm"},
              {title: "SL"},
              {title: "Trạng thái"},
              {title: "Phiếu kho"},
              {title: "Vận chuyển"},
              {title: "Lý do"}
            ]
          }
        />
      </Space>
      <Modal
        width={1280}
        onCancel={() => setVisible(false)}
        visible={visible}
        footer={[
          <Button onClick={() => setVisible(false)}>Hủy</Button>,
          <Button form={`refund-order`} htmlType={`submit`}>Lưu</Button>
        ]}
        title={`Tạo phiếu đổi trả`}>
        <Form id={`refund-order`} onFinish={onFinish} {...formWrap} form={formRefund}>
          <ModalReturnExport
            setVisible={setVisible}
            po={order.purchase_orders}
          />
        </Form>
      </Modal>
    </div>
  )
}
export default TabReturn;

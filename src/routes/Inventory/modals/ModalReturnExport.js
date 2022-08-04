import React, {useEffect, useState} from "react";
import {Button, Checkbox, Col, Collapse, Divider, Form, Image, Input, InputNumber, Row, Space, Typography} from "antd";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import {
  CUSTOMER_TYPE_CUSTOMER,
  CUSTOMER_TYPE_VENDOR,
  formWrap, REFUND_REASON_NO_CHANGE,
  REFUND_REASON_NSX_ERROR,
  WH_TYPE_EXCHANGE
} from "../../../constants/constant";
import {MinusOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {PO_REFUND_CREATE} from "../../../constants/ActionTypes";
import SelectCustomer from "../../../components/Input/SelectCustomer";
import SelectRefundReason from "../../../components/Input/SelectRefundReason";
import ProductItems from "../../Order/detail/component/ProductItems";
import AdjustmentList from "../../Order/detail/component/AdjustmentList";
import RefundList from "../../Order/detail/component/RefundList";
import Payment from "../../Order/detail/component/Payment";
import SelectProductWarehouse from "../../../components/Input/SelectProductWarehouse";

const ModalReturnExport = (props) => {
  const {visible, setVisible, po} = props;
  const [reasonKey, setReasonKey] = useState([]);
  const [reasonNote, setReasonNote] = useState('Yêu cầu điều chỉnh kho, nhập hoàn sản phẩm');
  const [formRefund] = Form.useForm();
  const dispatch = useDispatch();

  const setActive = (evt) => {
    const {target} = evt;
    if (target.checked) {
      setReasonKey([
        ...reasonKey,
        target.value
      ])
    } else {
      setReasonKey(reasonKey.filter(key => key !== target.value))
    }
  }

  const onFinish = (data) => {
    let formData = {
      ...data,
      po_id: po.id
    };
    if (reasonKey.includes('refund')) {
      formData = {
        ...formData,
        is_refund_order: true,
      }
    }
    dispatch({
      type: PO_REFUND_CREATE,
      payload: formData
    })
  }
  const renderNote = (reason) => {
    switch (reason) {
      case REFUND_REASON_NSX_ERROR:
        setReasonNote('Yêu cầu điều chỉnh kho, nhập/hoàn sản phẩm gửi nhầm, tạo đổi trả/hoàn tiền');
        break;
      case REFUND_REASON_NO_CHANGE:
        setReasonNote('Yêu cầu điều chỉnh kho sản phẩm gửi nhầm');
        break;
      default:
        setReasonNote('Yêu cầu điều chỉnh kho, nhập hoàn sản phẩm');
        break;
    }
  }
  useEffect(() => {
  }, [])

  return (
    <div>
      <Form id={`form-refund-import`} onFinish={onFinish} {...formWrap} form={formRefund}>
        <Row>
          <Col sm={12}>
            <Form.Item name={`reason`} label={`Lý do`}>
              <SelectRefundReason
                onChange={renderNote}/>
            </Form.Item>
            <div className={`d-flex space-center`}>
              <small className={`text-danger`}>*{reasonNote}</small>
            </div>
            <Form.Item name={`note`} label={`Ghi chú`}>
              <Input.TextArea style={{width: 400}}/>
            </Form.Item>
            <Form.Item
              initialValue={0}
              name={`total_shipping_fee`}
              label={`Giá ship`}>
              <InputNumber style={{width: 200}}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Collapse
              activeKey={reasonKey}
              ghost>
              <Collapse.Panel
                showArrow={false}
                header={<Checkbox value={`adjustment`} onChange={setActive}>Điều chỉnh kho</Checkbox>}
                key="adjustment">
                {reasonKey.includes('adjustment') &&
                <ProductItems
                  form={formRefund}
                />
                }

              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                header={<Checkbox value={`return`} onChange={setActive}>Nhập/Hoàn sản phẩm</Checkbox>}
                key="return">
                {reasonKey.includes('return') &&
                <ProductItems
                  fieldName={`return_items`}
                  form={formRefund}
                />}
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col sm={12}>
            <Collapse
              activeKey={reasonKey}
              ghost>
              <Collapse.Panel
                showArrow={false}
                header={<Checkbox value={`refund`} onChange={setActive}>Tạo đơn hàng đổi trả</Checkbox>}
                key="refund">
                {reasonKey.includes('refund') &&
                <ProductItems
                  fieldName={`refund_items`}
                  form={formRefund}
                />}
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                header={<Checkbox value={`payment`} onChange={setActive}>Tạo phiếu hoàn tiền</Checkbox>}
                key="payment">
                {reasonKey.includes('payment') && <Payment/>}
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>

      </Form>
    </div>
  )
}
export default ModalReturnExport;

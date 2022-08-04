import React from "react";
import {DatePicker, Form, Input, InputNumber, Select} from "antd";
import {GATE_WAYCODE, ORDER_TRANS_TYPE, ORDER_TRANS_TYPE_REFUND, PAYMENT_STATUS} from "../../../../constants/constant";


const Payment = () => {
  return (
    <>
      <Form.Item
        hidden
        initialValue={ORDER_TRANS_TYPE_REFUND}
        label={`Loại`} name={`trans_type`}>
        <Input/>
      </Form.Item>
      <Form.Item
        label={`Trạng thái`}
        name={`status`}>
        <Select style={{width: 200}}>
          {PAYMENT_STATUS.map(item => {
            return <Select.Option value={item.code}>
              {item.name}
            </Select.Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label={`Ngày thanh toán`}
        name={`paid_date`}>
        <DatePicker placeholder={`Ngày`} showTime style={{minWidth: 200}}/>
      </Form.Item>

      <Form.Item
        label={`Số tiền`}
        name={`total`}>
        <InputNumber type={'number'} style={{minWidth: 200}}/>
      </Form.Item>

      <Form.Item
        label={`Cổng thanh toán`}
        name='gateway_code'>
        <Select style={{width: 200}}>
          {GATE_WAYCODE.map(value => {
            return <Select.Option value={value.code}>
              {value.name}
            </Select.Option>
          })}
        </Select>
      </Form.Item>
    </>
  )
}
export default Payment;

import React from "react";
import {Button, DatePicker, Form, Input} from "antd";

const FilterByOrder = ({form, onFinish}) => {
  return (
    <Form size={'small'} layout={"inline"} onFinish={onFinish} form={form}>

      <Form.Item label={``} name={'id'}>
        <Input.TextArea placeholder={`Mã đơn hàng`}/>
      </Form.Item>

      <Form.Item label={``} name={'platform_order_id'}>
        <Input.TextArea placeholder={`Mã đơn hàng gốc`}/>
      </Form.Item>

      <Form.Item label={``} name={'order_number'}>
        <Input.TextArea placeholder={`Số đơn hàng`}/>
      </Form.Item>

      <Form.Item label={``} name={'po_id'}>
        <Input.TextArea placeholder={`Mã vận đơn`}/>
      </Form.Item>
      <Form.Item label={``} name={'created_at'}>
        <DatePicker style={{width: '100%'}} format={`YYYY-MM-DD`}/>
      </Form.Item>
      <Button htmlType={`submit`} size={'small'}>Tìm kiếm</Button>
    </Form>
  )
}
export default FilterByOrder;

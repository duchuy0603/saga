import React from 'react';
import {Button, Checkbox, Form, Input, Select} from "antd";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";

const FilterInventory = ({form, onFinish}) => {
  return (
    <Form onFinish={onFinish} size={'small'} layout={'inline'} form={form}>
      <Form.Item name={'warehouse_id'}>
        <SelectWarehouse form={form}/>
      </Form.Item>
      <Form.Item name={'status'}>
        <Checkbox onChange={e => form.setFieldsValue({status: e.target.checked && 'positive'})}>Còn tồn kho</Checkbox>
      </Form.Item>
      <Form.Item name={'waiting_import'}>
        <Checkbox onChange={e => form.setFieldsValue({waiting_import: e.target.checked && 'positive'})}>Đang chờ nhập</Checkbox>
      </Form.Item>
      <Button htmlType={`submit`} type={`default`}>Tìm kiếm</Button>
    </Form>
  )
}
export default FilterInventory;

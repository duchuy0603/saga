import React from 'react';
import {Button, Form, Input} from "antd";
import SelectManufacture from "../../../components/Input/SelectManufacture";

const FilterIndex = ({form, onFinish}) => {
  return (
    <Form layout={`inline`} size={`small`} form={form} onFinish={onFinish}>
      <Form.Item label={``} name={'manufacture_id'}>
        <SelectManufacture form={form}/>
      </Form.Item>
      <Form.Item label={''} name={`key`}>
        <Input placeholder={`Tên sản phẩm, sku, barcode`}/>
      </Form.Item>
      <Button htmlType={`submit`} type={`default`}>Tìm kiếm</Button>
    </Form>
  )
}
export default FilterIndex;

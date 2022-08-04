import React from 'react';
import {Button, DatePicker, Form, Input, Select} from "antd";
import {ADJUSTMENT_STT} from "../../../constants/constant";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";

const FilterAdjustment = ({form, onFinish}) => {
  return (
    <Form className={`mb-3`} size={`small`} form={form} onFinish={onFinish} layout={`inline`}>
      <Form.Item name={`id`} label={`Mã phiếu`}>
        <Input placeholder={`Mã phiếu..`}/>
      </Form.Item>
      <Form.Item name={`created_at`} label={`Ngày tạo`}>
        <DatePicker style={{width: '100%'}}/>
      </Form.Item>
      <Form.Item name={`warehouse_id`} label={`Kho`}>
        <SelectWarehouse/>
      </Form.Item>
      <Form.Item name={`status`} label={`Trạng thái`}>
        <Select allowClear style={{minWidth: '100px'}}>
          {ADJUSTMENT_STT && ADJUSTMENT_STT.map((item, key) => <Select.Option key={key}
                                                                              value={item.code}>{item.name}</Select.Option>)}
        </Select>
      </Form.Item>
      <Button type={`primary`} htmlType={`submit`}>Tìm kiếm</Button>
    </Form>
  )
}
export default FilterAdjustment;

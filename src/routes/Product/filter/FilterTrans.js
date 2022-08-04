import React from 'react';
import {Button, Checkbox, DatePicker, Form, Input, Select} from "antd";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import {PO_TYPES} from "../../../constants/constant";

const FilterTrans = ({form, onFinish}) => {
  return (
    <Form onFinish={onFinish} size={'small'} layout={'inline'} form={form}>
      <Form.Item name={'warehouse_id'}>
        <SelectWarehouse form={form}/>
      </Form.Item>
      <Form.Item name={'type'}>
        <Select allowClear style={{minWidth: '100px'}} placeholder={'Chọn loại hoạt động'}>
          {PO_TYPES && PO_TYPES.map((item, key) => {
              return (
                <Select.Option key={key} value={item.code}>{item.name}</Select.Option>
              )
            }
          )}
        </Select>
      </Form.Item>
      <Form.Item name={'created_at'}>
        <DatePicker allowClear placeholder={`Ngày tạo phiếu`} style={{width: '100%'}}/>
      </Form.Item>
      <Button htmlType={`submit`} type={`default`}>Tìm kiếm</Button>
    </Form>
  )
}
export default FilterTrans;

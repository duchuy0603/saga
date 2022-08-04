import React from "react";
import {Select} from "antd";
import {REFUND_REASON} from "../../constants/constant";

const SelectRefundReason = (props) => {
  const {onChange} = props
  return (
    <Select
      allowClear
      style={{width: 400}}
      onChange={onChange}
      placeholder={`Chọn lý do đổi trả`}>
      {REFUND_REASON && REFUND_REASON.map((item, key) => {
        return (
          <Select.Option value={item.key}>{item.label}</Select.Option>
        )
      })}
    </Select>
  )
}
export default SelectRefundReason;

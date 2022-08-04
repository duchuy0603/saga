import React, {useEffect, useState} from "react";
import {reqGetWarehouse} from "../../appRedux/services/inventory";
import {Select} from "antd";

const SelectWarehouse = (props) => {
  const {placeholder, size , showAll = true, excludes = [], onChange, value, keyName = 'wh_', params = {}} = props;

  const [warehouses, setWarehouses] = useState([]);

  const onSearchWarehouse = async (value) => {
    if (value.length > 3 || value.length === 0) {
      try {
        const res = await reqGetWarehouse({
          name: value,
          per_page: 5,
          ...params
        });
        setWarehouses(res.data.data);
      } catch (e) {
        setWarehouses([]);
      }
    }
  };
  useEffect(() => {
  }, [excludes])

  return (
    <Select
      size={size}
      showSearch
      placeholder={placeholder ? placeholder : "Chọn kho"}
      filterOption={false}
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      style={{minWidth: "100px"}}
      onFocus={() => onSearchWarehouse('')}
      onSearch={onSearchWarehouse}
    >
      {showAll && <Select.Option value={""}>Tất cả</Select.Option>}
      {warehouses.map(item => (<Select.Option
        disabled={excludes.includes(item.id)}
        key={`${keyName}${item.id}`}
        value={item.id}>
        {item.name}
      </Select.Option>))}
    </Select>);
};

export default SelectWarehouse;

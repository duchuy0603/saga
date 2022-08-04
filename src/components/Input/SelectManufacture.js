import React, {useState} from 'react';
import {reqGetCustomer, reqGetManufacture} from "../../appRedux/services/customer";
import {Select} from "antd";
import {CUSTOMER_TYPE_MANUFACTURE} from "../../constants/constant";

const SelectManufacture = (props) => {
  const {
    placeholder = 'Nhập tên nhà sản xuất ...',
    onChange,
    value,
    style,
    onSelect,
    keyName = 'manufacture_id'
  } = props;

  const [list, setList] = useState([]);

  const onSearch = async (value = '') => {
    if (value.length > 3 || value.length === 0) {
      try {
        const {data} = await reqGetManufacture({
          search: value,
          type: CUSTOMER_TYPE_MANUFACTURE,
          per_page: 5
        });
        setList(data.data);
      } catch (e) {
        setList([]);
      }
    }
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      filterOption={false}
      onChange={onChange}
      value={value}
      allowClear
      style={{minWidth: "100px", ...style}}
      onSelect={onSelect}
      onFocus={() => onSearch()}
      onSearch={onSearch}
    >
      {list.map(item => (<Select.Option
        key={`${keyName}${item.id}`}
        value={item.id}>
        {item.name}
      </Select.Option>))}
    </Select>);
}
export default SelectManufacture;

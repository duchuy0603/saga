import React, {useState} from "react";
import {Select} from "antd";
import {reqGetBrand} from "../../appRedux/services/brand";

const SelectBrand = (props) => {
  const {placeholder, onChange, value, style, onSelect, keyName='brand'} = props;

  const [brands, setBrands] = useState([]);
  const onSearchBrand = async (value = '') => {
    if (value.length > 3 || value.length === 0) {
      try {
        const {data} = await reqGetBrand({
          name: value,
          per_page: 5
        });
        setBrands(data.data);
      } catch (e) {
        setBrands([]);
      }
    }
  };

  return (
    <Select
      showSearch
      allowClear
      placeholder={placeholder ? placeholder : "Nhãn hàng"}
      filterOption={false}
      onChange={onChange}
      value={value}
      style={{minWidth: "100px", ...style}}
      onSelect={onSelect}
      onFocus={() => onSearchBrand()}
      onSearch={onSearchBrand}
    >
      {brands.map(item => (<Select.Option
        key={`${keyName}${item.id}`}
        value={item.id}>
        {item.name}
      </Select.Option>))}
    </Select>);
};

export default SelectBrand;

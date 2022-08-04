import React, {useState} from "react";
import {reqGetWarehouse} from "../../appRedux/services/inventory";
import {Select} from "antd";
import {reqGetProduct} from "../../appRedux/services/product";

const SelectProduct = (props) => {
  const {placeholder, onSelect, style, onChange, value, keyName = 'product_'} = props;

  const [products, setProducts] = useState([]);

  const onSearchProduct = async (value) => {
    if (value.length > 3 || value.length === 0) {
      try {
        const res = await reqGetProduct({
          name: value,
          group: 'has_children',
          per_page: 5
        });
        setProducts(res.data.data);
      } catch (e) {
        setProducts([]);
      }
    }
  };

  return (
    <Select
      showSearch
      placeholder={placeholder ? placeholder : "Chọn sản phẩm"}
      filterOption={false}
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      style={{minWidth: "100px", ...style}}
      onFocus={() => onSearchProduct('')}
      onSearch={onSearchProduct}
      onSelect={value => {
        if (typeof onSelect === "function") {
          onSelect(value, products)
        }
      }}
    >
      {products.map(item => (<Select.Option
        key={`${keyName}${item.id}`}
        value={item.id}>
        {item.name}
      </Select.Option>))}
    </Select>);
};

export default SelectProduct;

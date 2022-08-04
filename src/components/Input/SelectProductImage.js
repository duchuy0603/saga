import React, {useState} from "react";
import {Select, Space} from "antd";
import {reqGetProduct} from "../../appRedux/services/product";


const SelectProductImage = (props) => {
  const {onSelect, onChange, value, keyName = 'product_', placeholder = 'Chọn sản phẩm'} = props;
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
      onSelect={value => onSelect(value, products)}
      showSearch
      size={'large'}
      allowClear
      onChange={onSearchProduct}
      onSearch={onSearchProduct}
      style={{width: `100%`}}
      placeholder={placeholder}
      optionFilterProp="label"
      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      filterSort={(optionA, optionB) =>
        optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
      }
    >
      {products ? products.map(product => {
        return (
          <Select.Option
            key={`${keyName}-${product.id}`}
            label={product.name}
            value={product.id}>
            <Space className={`ml-1`} size={1}>

              <Space className={`ml-1`} size={1} direction={`vertical`}>
                <small>{product.name}</small>
              </Space>
            </Space>
          </Select.Option>
        )
      }) : null}
    </Select>
  );

}
export default SelectProductImage;

import React, {useEffect, useState} from "react";
import {Col, Image, message, Row, Select, Space, Tag} from "antd";
import {reqGetWarehouseProduct} from "../../appRedux/services/inventory";
import {defaultImage} from "../../util/Helper";
import {CheckCircleFilled, CheckCircleTwoTone} from "@ant-design/icons";

const SelectProductWarehouse = (props) => {
  const {onChange, checked = [], onSelect, keyName = 'product_', placeholder = 'Tên sản phẩm, barcode, sku...'} = props;
  const [products, setProduct] = useState([]);
  const onSearch = async (key) => {
    try {
      const response = await reqGetWarehouseProduct({
        name: key,
        sku: key,
        barcode: key,
        per_page: 10
      });
      setProduct(response.data.data);
    } catch (e) {
      message.error(e.messages);
    }
  }
  useEffect(() => {

  }, [])
  const Option = (item) => {
    return (
      <Select.Option object={item} className={`border-dash`} label={item.name} value={item.sku}>
        <Row>
          <Col sm={18}>
            <div className={`mr-1`}
                 aria-label={item.name}>
              <Space size={`small`}>
                <Tag color={`green`}>{item.barcode}</Tag>
                <small className={`wrap-text`}>{item.name}</small>
              </Space>
              <div className={`pb-0 d-flex space-around`}>
                <small>Tồn: {item.hand_in_stock}</small>
                <small>Khả dụng: {(item.hand_in_stock ?? 0) - (item.commited ?? 0)}</small>
                <small>Đã đặt: {item.commited ?? 0}</small>
              </div>
            </div>
          </Col>
          <Col sm={6}>
           <div className={`d-flex align-center`}>
             {item.product.image_url && <Image
               preview={false}
               width={50}
               height={50}
               sr={item.product.image_url ?? 'error'}
             />}
             {checked.includes(item.sku) ? <CheckCircleTwoTone twoToneColor={`#52c41a`}/> : ''}
           </div>
          </Col>
        </Row>
      </Select.Option>
    )
  }
  return (
    <Select
      mode={`multiple`}
      showSearch
      value={[]}
      onSelect={(value, e) => {
        if (typeof onSelect === "function") {
          onSelect(value, e);
        }
      }
      }
      autoClearSearchValue={true}
      menuItemSelectedIcon={<CheckCircleFilled size={`small`}/>}
      placeholder={placeholder ? placeholder : "Chọn sản phẩm"}
      filterOption={false}
      optionFilterProp="children"
      onChange={onChange}
      style={{minWidth: 500}}
      onSearch={onSearch}
      optionLabelProp="label"
    >
      {products.map(item => Option(item))}
    </Select>
  )
};
export default SelectProductWarehouse;

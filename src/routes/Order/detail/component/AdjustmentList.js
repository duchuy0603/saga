import React, {useEffect, useState} from "react";
import {Button, Col, Form, Image, Input, InputNumber, Row, Space, Tag} from "antd";
import {CloseCircleFilled, CreditCardOutlined, MinusOutlined} from "@ant-design/icons";
import SelectProduct from "../../../../components/Input/SelectProduct";
import SelectWarehouse from "../../../../components/Input/SelectWarehouse";
import {renderNumberFormat} from "../../../../util/Helper";

const AdjustmentList = (props) => {
  const {form} = props;
  const [items, setItems] = useState([])
  const changeQty = (value, index, key = 'quantity') => {
    const newItems = items.slice();
    newItems[index] = {
      ...newItems[index],
      [key]: value,
      total : (newItems[index].quantity ?? 1) * newItems[index].price_original
    };
    setItems(newItems)
  }
  useEffect(() => {
    form.setFieldsValue({
      items: [...items]
    })
  }, [items])
  return (
    <div>
      <Form.List name={'return_items'}>
        {(fields, {add, remove}) => {
          return (
            <>
              {fields.map((field, index) => {
                return (
                  <div className={`simple-card`} key={`p_${field.key}`}>
                    <Form.Item hidden name={[field.name, 'product_id']}><Input/></Form.Item>
                    <Row>
                      <Col sm={12}>
                        <div className={`d-flex pb-0`}>
                          <Image
                            preview={false}
                            width={50}
                            height={50}
                            src={items[index]?.product.image_url}
                          />
                          <div className={`flex-column ml-1`}>
                            <Tag>{items[index]?.sku}</Tag>
                            <small>{items[index]?.product_name}</small>
                          </div>
                        </div>
                      </Col>
                      <Col sm={12} className={`p-0`}>
                        <div className={`d-flex space-end align-center`}>
                          <Form.Item
                            className={`mb-0 mx-0`}>
                            <InputNumber
                              onChange={value => changeQty(value, index, 'price_original')}
                              name={[field.name, 'price_original']}
                              size={`small`}
                              className={`custom`}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\\s?|(,*)/g, '')}
                            />
                          </Form.Item>
                          <span className={`mr-1`}>x</span>
                          <Form.Item
                            name={[field.name, 'quantity']}
                            className={`mb-0 mx-0`}>
                            <InputNumber
                              onChange={value => changeQty(value, index)}
                              size={`small`}
                              className={`custom mr-0`}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\\s?|(,*)/g, '')}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row justify="end" className={`mx-0`}>
                      <Col>
                        <Space align={`baseline`}>
                          <Form.Item
                            className={`mx-0 mb-0`}
                            label={`Kho`}>
                            <SelectWarehouse size={`small`}/>
                          </Form.Item>
                          <CreditCardOutlined/>
                          <span>{renderNumberFormat(items[index].total) ?? 0}đ</span>
                          <CloseCircleFilled onClick={() => {
                            remove(index);
                            setItems(items.filter((item, key) => key !== index))
                          }}/>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                )
              })}
            </>
          )
        }}
      </Form.List>
    </div>
  )
}
export default AdjustmentList;

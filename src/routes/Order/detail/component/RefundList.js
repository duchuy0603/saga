import React from "react";
import {Button, Col, Form, Input, InputNumber, Row, Space} from "antd";
import {MinusOutlined} from "@ant-design/icons";
import SelectProduct from "../../../../components/Input/SelectProduct";

const RefundList = (props) => {
  const {form} = props;
  return (
    <div>
      <Form.List name={'refund_items'}>
        {(fields, {add, remove}) => {
          return (
            <>
              {fields.map((field, index) => {
                return (
                  <Row key={`p_${field.key}`}>
                    <Form.Item
                      hidden
                      name={[field.name, 'product_id']}>
                      <Input/>
                    </Form.Item>
                    <Col md={8}>
                      <Form.Item>
                        <SelectProduct style={{width: `100%`}}/>
                      </Form.Item>
                    </Col>
                    <Col md={6} className={`mx-0`}>
                      <Form.Item
                        rules={[{required: true, message: 'Số lượng nhập bắt buộc!'}]}
                        label={"SL"}
                        initialValue={0}
                        name={[field.name, 'quantity']}>
                        <InputNumber style={{width: `100%`}}/>
                      </Form.Item>
                    </Col>
                    <Col md={8} className={`mx-0`}>
                      <Form.Item
                        labelCol={{sm: 8}}
                        label={"Giá"}
                        initialValue={0}
                        name={[field.name, 'price']}>
                        <InputNumber style={{width: '100%'}}/>
                      </Form.Item>
                    </Col>

                    <Col md={2} className={`mx-0`}>
                      <Form.Item>
                        <Space>
                          <Button
                            type="dashed"
                            onClick={() => {
                              remove(field.name);
                            }}
                            icon={<MinusOutlined/>}
                          />
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              })}
              <Button type={`dashed`} onClick={add}>Thêm sản phẩm</Button>
            </>
          )
        }}
      </Form.List>
    </div>
  )
}
export default RefundList;

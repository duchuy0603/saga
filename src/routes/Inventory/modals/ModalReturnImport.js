import React, {useEffect, useState} from "react";
import {Button, Col, Divider, Form, Image, Input, InputNumber, Row, Space} from "antd";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import {CUSTOMER_TYPE_CUSTOMER, CUSTOMER_TYPE_VENDOR, formWrap, WH_TYPE_EXCHANGE} from "../../../constants/constant";
import {MinusOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {PO_REFUND_CREATE} from "../../../constants/ActionTypes";
import SelectCustomer from "../../../components/Input/SelectCustomer";

const ModalReturnImport = (props) => {
  const {visible, setVisible, po} = props;
  const [items, setItems] = useState([]);
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const onFinish = (data) => {
    dispatch({
      type: PO_REFUND_CREATE,
      payload: {
        po_id: po.id,
        ...data
      }
    })
    setVisible(false);
  }
  useEffect(() => {
    const poItems = po.po_items;
    setItems(poItems);
    console.log("Items:", poItems)
    form.setFieldsValue({
      items: poItems.map(item => {
        return {
          ...item,
          quantity: 0,
          price_original: 0
        }
      })
    })
  }, [])
  return (
    <div>
      <Form onFinish={onFinish} id={`form-refund-import`} form={form} {...formWrap}>
        <Form.Item
          name={`reason`}
          rules={[{required: true, message: 'Lý do bắt buộc!'}]}
          label={`Lý do đổi trả`}>
          <Input.TextArea/>
        </Form.Item>
        <Form.Item
          rules={[{required: true, message: 'Chọn nơi trả về!'}]}
          name={`vendor_id`}
          label={`Nơi đổi trả`}>
          <SelectCustomer
            type={CUSTOMER_TYPE_VENDOR}
            params={{wh_type: WH_TYPE_EXCHANGE}}
          />
        </Form.Item>
        <Form.List name={'items'}>
          {(fields, {add, remove}) => {
            return (
              <>
                {fields.map((field, index) => {
                  const packs = form.getFieldValue('items');
                  return (
                    <Row key={`p_${field.key}`}>
                      <Form.Item
                        hidden
                        name={[field.name, 'product_id']}>
                        <Input/>
                      </Form.Item>
                      <Col md={8}>
                        <Form.Item>
                          {packs[index].name}
                        </Form.Item>
                      </Col>
                      <Col md={6} className={`mx-0`}>
                        <Form.Item
                          rules={[{required: true, message: 'Số lượng nhập bắt buộc!'}]}
                          label={"SL"}
                          initialValue={``}
                          name={[field.name, 'quantity']}>
                          <InputNumber style={{width: `100%`}}/>
                        </Form.Item>
                      </Col>
                      <Col md={8} className={`mx-0`}>
                        <Form.Item
                          labelCol={{sm: 8}}
                          label={"Giá gốc"}
                          name={[field.name, 'price_original']}>
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
              </>
            )
          }}
        </Form.List>

      </Form>
    </div>
  )
}
export default ModalReturnImport;

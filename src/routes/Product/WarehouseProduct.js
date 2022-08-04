import React, {useState} from "react";
import {Button, Col, Descriptions, Divider, Form, Image, Input, InputNumber, Row, Select, Space} from "antd";
import {InboxOutlined, MinusOutlined} from "@ant-design/icons";
import {renderNumberFormat} from "../../util/Helper";
import SelectProductImage from "../../components/Input/SelectProductImage";

const WarehouseProduct = ({...props}) => {
  const {form, packages, setPackages, clearSelectItem} = props;

  const [productDisabled, setProductDisabled] = useState([]);
  const [totalFormat, setTotalFormat] = useState({
    total: {}
  });
  const [current, setCurrent] = useState(null);

  const removeItemPackage = item => {
    let packages = form.getFieldValue('packages');
    packages = packages.filter(index => index.product_id !== item.product_id);
    form.setFieldsValue({
      'packages': packages
    });
    setPackages(packages);
    let newList = productDisabled.filter(id => id !== item.product_id);
    setProductDisabled(newList);
  }

  const onSelect = (value, products, evt) => {
    const index = products.findIndex(item => item.id === value);
    const variants = products[index].childrens;
    let packs = [];
    if (variants.length > 0) {
      variants.map(item => {
        packs.push({
          product_id: item.id,
          name: item.name,
          quantity: 1,
          warehouse_id: form.getFieldValue('wh_to_id'),
          warehouse_name: form.getFieldValue('warehouse_name')
        })
      })
    }


    form.setFieldsValue({
      'packages': packs
    });
    setCurrent(products[index]);
    setPackages(packages);
    productDisabled.push(value);
    setProductDisabled(productDisabled);
  }
  const onChangeTotal = (value, index) => {
    let total = totalFormat.total;
    total[index] = renderNumberFormat(value, '', 'VND');
    setTotalFormat({
      ...totalFormat,
      total
    });
  };

  return (
    <div>
      <h4><InboxOutlined/> Sản phẩm lưu kho</h4>
      <Descriptions column={1}>
        <Descriptions.Item label={`Chọn sản phẩm`}>
          <SelectProductImage
            onSelect={onSelect}
          />
        </Descriptions.Item>
      </Descriptions>
      <Form.List name={'packages'}>
        {(fields, {add, remove}) => {
          return (
            <>

              <b>{current ? (
                <Space><b>Sản phẩm: </b> <Space align={`center`} direction={'horizontal'}><Image width={40} height={40}
                                                                                                 src={current.image_url}/>
                  <b>{current.name}</b></Space></Space>) : ''} </b>

              <Divider/>

              {fields.map((field, index) => {
                const packs = form.getFieldValue('packages');
                return (
                  <Row key={`p_${field.key}`}>
                    <Form.Item
                      hidden
                      name={[field.name, 'product_id']}>
                      <Input/>
                    </Form.Item>
                    <Col md={7}>
                      <Form.Item>
                        {packs[index].name}
                      </Form.Item>
                    </Col>
                    <Col md={7} className={`mx-0`}>
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
                        rules={[{required: true, message: 'Giá nhập bắt buộc!'}, {
                          min: 0,
                          message: 'Giá gốc là 1 số nguyên dương!'
                        }]}
                        initialValue={0}
                        label={"Giá gốc"}
                        name={[field.name, 'price_original']}>
                        <Space direction={"vertical"} size={'small'} style={{width: '100%'}}>
                          <InputNumber style={{width: '100%'}} onChange={val => onChangeTotal(val, index)}/>
                          <small className="text-muted">{totalFormat.total[index]}</small>
                        </Space>
                      </Form.Item>
                    </Col>

                    <Col md={2} className={`mx-0`}>
                      <Form.Item>
                        <Space>
                          <Button
                            type="dashed"
                            onClick={() => {
                              remove(field.name);
                              removeItemPackage(packs[index]);
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
    </div>
  )
}
export default WarehouseProduct;

import React, {useEffect, useState} from 'react';
import {formWrap, PO_TYPE_IMPORT, TRANSACTION_IMPORT} from "../../../constants/constant";
import {Button, Col, Divider, Form, Image, Input, InputNumber, message, Row, Select, Space} from "antd";
import WarehouseProduct from "../WarehouseProduct";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import SelectCustomer from "../../../components/Input/SelectCustomer";
import {MinusOutlined} from "@ant-design/icons";
import {renderNumberFormat} from "../../../util/Helper";
import {reqCreatePoViaProduct} from "../../../appRedux/services/inventory";

const ImportWarehouse = ({childrens, packages, setPackages, form, onSaveWarehouse}) => {


  const [totalFormat, setTotalFormat] = useState({
    total: {}
  });
  const onChangeTotal = (value, index) => {
    let total = totalFormat.total;
    total[index] = renderNumberFormat(value, '', 'VND');
    setTotalFormat({
      ...totalFormat,
      total
    });
  };

  const removeItemPackage = item => {
    let packages = form.getFieldValue('packages');
    packages = packages.filter(index => index.product_id !== item.product_id);
    form.setFieldsValue({
      'packages': packages
    });
    setPackages(packages);
  }
  useEffect(() => {
    console.log("childrens: ", childrens);
    if (childrens) {
      const packs = [];
      if (childrens.length > 0) {
        childrens.map(item => {
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
      setPackages(packs);
    }


  }, []);

  return (
    <Form
      autoComplete="off"
      initialValues={
        {
          packages: packages
        }
      }
      id={`pWarehouseForm`}
      form={form}
      {...{
        ...formWrap,
        labelCol: {
          xs: 10
        },
      }}
      onFinish={onSaveWarehouse}
    >
      <Form.Item name={`wh_from_name`} hidden><Input/></Form.Item>
      <Form.Item
        label={`Nhà cung cấp`}
        name={`wh_from_id`}
        rules={[{required: true, message: 'Chọn nhà cung cấp!'}]}
      >
        <SelectCustomer type={`vendor`} form={form}/>
      </Form.Item>
      <Form.Item name={`warehouse_name`} hidden><Input/></Form.Item>
      <Form.Item
        label={`Kho`}
        rules={[{required: true, message: 'Chọn kho lưu sản phẩm!'}]}
        name={`wh_to_id`}
      >
        <SelectWarehouse form={form}/>
      </Form.Item>
      <Form.List name={'packages'}>
        {(fields, {add, remove}) => {
          return (
            <>
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
    </Form>
  )
}
export default ImportWarehouse;

import React from "react";
import {Button, Col, DatePicker, Form, Input, Row} from "antd";
import ProvinceGroup from "../components/ProvinceGroup";
import {formWrap, CUSTOMER_TYPE_CUSTOMER} from "../constants/constant";
import {ClearOutlined} from "@ant-design/icons";

/**
 *
 * @param props
 * @constructor
 */
const FilterCustomer = ({...props}) => {
  const {type, form, hidden, onSearch, onReset} = props;

  return (
    <Form
      onFinish={onSearch}
      form={form} {
      ...{
        labelCol: {
          xs: {span: 24},
          sm: {span: 10},
        }, labelAlign: 'left'
      }
    }>
      <Row>
        <Form.Item
          hidden
          initialValue={type ? type : CUSTOMER_TYPE_CUSTOMER}
          name={`type`}>
          <Input/>
        </Form.Item>
        <Col md={6}>
          <Form.Item
            name={`name`}
            label={`Tên`}>
            <Input/>
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            name={`phone`}
            label={`STD`}>
            <Input/>
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            name={`email`}
            label={`Email`}>
            <Input/>
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            name={`cmnd`}
            label={`CMND`}>
            <Input/>
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            name={`date_of_birth`}
            label={`Ngày sinh`}>
            <DatePicker style={{width: '100%'}}/>
          </Form.Item>
        </Col>
        <Col md={18}>
          <ProvinceGroup
            horizontal
            label={false}
            form={form}/>
        </Col>
        <Col xs={24} md={2}>
          <div className={`d-flex space-between`}>
            <Button htmlType={`submit`} type={`primary`}>Tìm kiếm</Button>
            <Button onClick={onReset}><ClearOutlined/></Button>
          </div>
        </Col>
      </Row>

    </Form>
  );
}
export default FilterCustomer;

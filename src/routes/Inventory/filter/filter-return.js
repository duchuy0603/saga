import React from "react";
import {Button, Col, DatePicker, Form, Input, Row, Select} from "antd";
import {ClearOutlined} from "@ant-design/icons/lib/icons";

const FilterReturn = ({...props}) => {
  return (
    <Form onFinish={props.onSearch} {...{
      labelCol: {
        xs: {span: 24}
      },
      wrapperCol: {
        xs: {span: 24}
      },
      labelAlign: 'left',
    }}>
      <Row>
        <Col md={5}>
          <Form.Item
            label={``}
            name={`sku`}
          >
            <Input placeholder={`Mã sản phẩm`}/>
          </Form.Item>
        </Col>
        <Col md={4}>
          <Form.Item
            label={``}
            name={`date`}
          >
            <DatePicker placeholder={`Ngày`} style={{width: '100%'}} format={`YYYY/MM/DD`}/>
          </Form.Item>
        </Col>
        <Col md={5}>
          <Form.Item
            label={``}
            name={`category`}
          >
            <Input placeholder={`Nhà sản xuất`}/>
          </Form.Item>
        </Col>
        <Col md={5}>
          <Form.Item
            label={``}
            name={`status`}
          >
            <Select placeholder={`Lọc nhanh`}>
              <Select.Option value={``}>Tất cả</Select.Option>
              <Select.Option value={`active`}>Đang hoạt động</Select.Option>
              <Select.Option value={`out_stock`}>Hết hàng/Cảnh báo tồn</Select.Option>
              <Select.Option value={`de-active`}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={2}>
          <div className={`d-flex space-between`}>
            <Button htmlType={`submit`}>Tìm kiếm</Button>
            <Button><ClearOutlined/></Button>
          </div>
        </Col>
      </Row>
    </Form>
  )
}
export default FilterReturn;

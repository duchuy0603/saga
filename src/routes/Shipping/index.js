import React, {} from "react";
import {Card, Tabs, Table, Col, Button, DatePicker, Form, Select, Input, Row} from 'antd';
import {ClearOutlined} from '@ant-design/icons';
import {formWrap} from '../../constants/constant';

const {TabPane} = Tabs;
const Shipping = () => {
  const [form] = Form.useForm();
  return (
    <Card>
      <Card title={`Đơn Hàng`}>
        <Form form={form} {...formWrap}>
          <Row>
            <Col md={6}>
              <Form.Item
                label={`Mã`}
                name={`sku`}
              >
                <Input placeholder={`Mã`}/>
              </Form.Item>
            </Col>

            <Col md={6}>
              <Form.Item
                label={`Ngày`}
                name={`date`}
              >
                <DatePicker placeholder={`Ngày`} style={{width: '100%'}} format={`YYYY/MM/DD`}/>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                label={`Trạng thái`}
                name={`category`}
              >
                <Input placeholder={`Trạng thái`}/>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label={`Kho`}
                name={`status`}
              >
                <Select placeholder={`Chọn kho`}>
                  <Select.Option value="0">Tất cả</Select.Option>
                  <Select.Option value="1">Kho 1</Select.Option>
                  <Select.Option value="2">Kho 2</Select.Option>
                  <Select.Option value="3">Kho 3</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={2}>
              <div className={`d-flex space-between`}>
                <Button htmlType={`submit`}>Tìm kiếm</Button>
                <Button><ClearOutlined/></Button>
              </div>
            </Col>
          </Row>
        </Form>
        <Table

          dataSource={dataSource}
          rowKey={`index`}
          className="shipping-table"
          columns={[
            {
              title: 'ID', dataIndex: 'id', key: 'id',
              render: (id, raw) => {
                return (
                  <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                    <a className={`pl-1`} href={`/shipping/po/${id}`}>#{id}.{raw.name}</a>
                  </div>
                )
              }
            },
            {title: 'Đến', dataIndex: 'from', key: 'form'},
            {title: 'Từ', dataIndex: 'shop', key: 'shop'},
            {title: 'Trạng thái', dataIndex: 'status', key: 'status'},
            {title: 'Hóa Đơn', dataIndex: 'bill', key: 'bill'},
            {title: 'Phiếu Kho', dataIndex: 'warehouse_id', key: 'warehouse_id'},
            {title: 'Đóng Hàng', dataIndex: 'close_status', key: 'close_status'},
            {title: 'Vận chuyển', dataIndex: 'ship', key: 'ship'},
            {title: 'Giá Trị', dataIndex: 'total', key: 'total'},
          ]}
        />
      </Card>
    </Card>
  )
}
const dataSource = [
  {
    id: '1',
    from: 'Viet',
    shop: 'Shopee',
    status: 'Vận Chuyển',
    bill: '002',
    warehouse_id: '002',
    close_status: 'Hoàn thành',
    ship: 'Đang vận chuyển',
    total: '10000',
  },
  {
    id: '1',
    from: 'Viet',
    shop: 'Shopee',
    status: 'Vận Chuyển',
    bill: '002',
    warehouse_id: '002',
    close_status: 'Hoàn thành',
    ship: 'Đang vận chuyển',
    total: '10000',
  }, {
    id: '1',
    from: 'Viet',
    shop: 'Shopee',
    status: 'Vận Chuyển',
    bill: '002',
    warehouse_id: '002',
    close_status: 'Hoàn thành',
    ship: 'Đang vận chuyển',
    total: '10000',
  },
];
export default Shipping;

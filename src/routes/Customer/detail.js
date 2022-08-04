import React, {useEffect, useState} from "react";
import {Button, message, Card, Col, Descriptions, Divider, Image, Row, Table, Form, Input, Modal} from "antd";
import {Link, useParams} from "react-router-dom";
import {EditOutlined, LeftOutlined, PlusOutlined} from "@ant-design/icons";
import {reqCustomerDetail} from "../../appRedux/services/customer";
import TextArea from "antd/lib/input/TextArea";

const CustomerDetail = (props) => {
  const [state, setState] = useState({
    customer: {}
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    //summit
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const {customerId} = useParams();
  useEffect(() => {
    (async () => {
      try {
        const res = await reqCustomerDetail(customerId);
        setState({
          customer: res.data
        })
      } catch (e) {
        message.error(e.message);
      }
    })();
  }, []);
  return (
    <Row>
      <Col md={16}>
        <Card size={"small"} title={[
          <Button type={"link"}
                  className="m-0"
                  key="btn_back"
                  onClick={props.history.goBack} icon={<LeftOutlined />}>
            Quay lại
          </Button>,
          `#${state.customer.name}`
        ]}
              extra={<Link to={`/customer/update/${customerId}`}>
                <Button type="primary" size={"small"} icon={<EditOutlined />}>Sửa</Button>
              </Link>}>

          <Descriptions layout="horizontal">
            <Descriptions.Item label={<b>Loại</b>}>Khách hàng</Descriptions.Item>

          </Descriptions>
          <Descriptions title="Địa chỉ">
            <Row>
              <Col md={12}>
                <Descriptions title="Shippng" layout="vertical" column={1}>
                  <Descriptions.Item label="Tên">--</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    --
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col md={12}>
                <Descriptions title="Hóa đơn" layout="vertical" column={1}>
                  <Descriptions.Item label="Tên">--</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    --
                  </Descriptions.Item>
                </Descriptions>,
              </Col>
            </Row>
          </Descriptions>
        </Card>

        <Card size={"small"} title={`Lích sử`}>
          <p>Hoạt động Kho</p>
          <Table
            dataSource={[]}
            columns={[
              {title: 'Phiếu', dataIndex: 'id', key: 'id'},
              {title: 'Từ', dataIndex: 'from', key: 'from'},
              {title: 'Đến', dataIndex: 'to', key: 'to'},
              {title: 'Hóa đơn', dataIndex: 'idbill', key: 'idbill'},
              {title: 'Tình trạng', dataIndex: 'status', key: 'status'},
              {title: 'Ngày tạo', dataIndex: 'crtdate', key: 'crtdate'},
              {title: 'Số lượng', dataIndex: 'amount', key: 'amount'},
            ]}
          />
          <Button type="primary">Xem thêm</Button>
        </Card>
      </Col>
      {/* <Divider type="vertical" /> */}
      <Col md={8}>
        <Card title={`Thông tin khách hàng`}>
          <div className={`d-flex space-center`}>
            <Image
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </div>
        </Card>
        <Card title={`Thông tin cá nhân`} className="card-info-manufacture">
          <Descriptions layout="horizontal" column={1}>
            <Descriptions.Item label="Ngày sinh">{state.customer.date_of_birth}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{state.customer.phone}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {state.customer.address1}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title={`Người liên lạc`}
              extra={<Button className="btn-add-contact-manufacture" type="primary"
                             onClick={showModal}><PlusOutlined /></Button>}>

          <Modal className="model-add-contact" title="Người liên lạc" visible={isModalVisible} onOk={handleOk}
                 onCancel={handleCancel}>
            <Form.Item
              name={`name`}
              label={<b>Tên khách hàng</b>}
              rules={[{required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={`Phone`}
              label={<b>Số Điện Thoại</b>}
              rules={[{required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={`Phone`}
              label={<b>Địa chỉ</b>}
              rules={[{required: true}]}>
              <TextArea rows={4} />
            </Form.Item>
          </Modal>
          <Descriptions layout="horizontal" column={1}>
            <Descriptions.Item><Button className="btn-edit-contact-manufacture"
                                       type="primary"><EditOutlined /></Button></Descriptions.Item>
            <Descriptions.Item label="Tên">--</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions layout="horizontal" column={1}>
            <Descriptions.Item><Button className="btn-edit-contact-manufacture"
                                       type="primary"><EditOutlined /></Button></Descriptions.Item>
            <Descriptions.Item label="Tên">--</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  )
}
export default CustomerDetail;

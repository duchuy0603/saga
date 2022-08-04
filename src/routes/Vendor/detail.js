import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import { reqVendorDetail} from "../../appRedux/services/customer";
import {Button, Card, Col, Descriptions, Divider, Image, message, Row, Table} from "antd";
import {EditOutlined, LeftOutlined, PlusOutlined} from "@ant-design/icons";

const VendorDetail = (props) => {
  const [state, setState] = useState({
    vendor: {}
  });
  const {vendorId} = useParams();
  useEffect(() => {
    (async () => {
      try {
        const res = await reqVendorDetail(vendorId);
        setState({
          vendor: res.data
        })
      } catch (e) {
        message.error(e.message);
      }
    })();
  }, [])
  return (
    <Row>
      <Col md={16}>
        <Card title={[
          <Button type={"link"}
                  className="m-0"
                  key="btn_back"
                  onClick={props.history.goBack} icon={<LeftOutlined />}>
            Quay lại
          </Button>,
          `${state.vendor.name}`
        ]}
              extra={<Link to={`/vendor/update/${vendorId}`}> <Button type="primary"><EditOutlined/> Sửa</Button> </Link>}>

          <Descriptions title="Địa chỉ">
            <Row>
              <Col md={12}>
                <Descriptions title="Shippng" layout="vertical" column={1}>
                  <Descriptions.Item label="">--</Descriptions.Item>
                  <Descriptions.Item label="">--</Descriptions.Item>
                  <Descriptions.Item label="">
                    --
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col md={12}>
                <Descriptions title="Hóa đơn" layout="vertical" column={1}>
                  <Descriptions.Item label="">--</Descriptions.Item>
                  <Descriptions.Item label="">--</Descriptions.Item>
                  <Descriptions.Item label="">
                    --
                  </Descriptions.Item>
                </Descriptions>,
              </Col>
            </Row>
          </Descriptions>
        </Card>

        <Divider/>

        <Card title={`Lích sử`}>
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
        <Card title={`Thông tin nhà cung cấp`}>
          <div className={`d-flex space-center`}>
            <Image
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </div>
          <Divider/>
          <Card title={`Thông tin cá nhân`} className="card-info-manufacture">
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item label="Ngày sinh">{state.vendor.date_of_birth}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{state.vendor.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
            </Descriptions>
          </Card>
          <Divider/>
          <Card title={`Người liên lạc`}
                extra={<Button className="btn-add-contact-manufacture" type="primary"><PlusOutlined/></Button>}>
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item label="Tên">--</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item label="Tên">--</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
            </Descriptions>
          </Card>
        </Card>
      </Col>
    </Row>
  )
}
export default VendorDetail;

import React, {useEffect, useState} from "react";
import {Card, Table, Button, Row, Col, Divider, Image, message} from 'antd';
import {Descriptions} from 'antd';
import {EditOutlined, LeftOutlined, PlusOutlined} from '@ant-design/icons';
import {Link, useParams} from "react-router-dom";
import {reqManufactureDetail} from "../../appRedux/services/customer";

const ManufactureDetail = (props) => {
  const [state, setState] = useState({
    manufacture: {}
  });
  const {mId} = useParams();
  useEffect(() => {
    (async () => {
      try {
        const res = await reqManufactureDetail(mId);
        setState({
          manufacture: res.data
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
          </Button>
        ]}
              extra={<Link to={`/manufacture/update/${mId}`}> <Button type="primary"><EditOutlined /> Sửa</Button>
              </Link>}>

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

        <Divider />

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
        <Card title={`Thông tin nhà sản xuất`}>
          <div className={`d-flex space-center`}>
            <Image
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </div>
          <Divider />
          <Card title={`Thông tin cá nhân`} className="card-info-manufacture">
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item label="Ngày sinh">{state.manufacture.date_of_birth}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{state.manufacture.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
            </Descriptions>
          </Card>
          <Divider />
          <Card title={`Người liên lạc`}
                extra={<Button className="btn-add-contact-manufacture" type="primary"><PlusOutlined /></Button>}>
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item label="Tên">--</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">--</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">--</Descriptions.Item>
            </Descriptions>
            <Divider />
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
export default ManufactureDetail;

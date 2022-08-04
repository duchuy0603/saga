import React from "react";
import {Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select, Upload,} from "antd";
import {useDispatch} from "react-redux";
import {ClearOutlined, LeftOutlined, SaveOutlined, TagOutlined} from "@ant-design/icons";
import {CUSTOMER_TYPE, CUSTOMER_TYPE_MANUFACTURE, formMsg} from '../../constants/constant';
import ProvinceGroup from "../../components/ProvinceGroup";
import {UploadOutlined} from "@ant-design/icons/lib/icons";
import {CREATE_MANUFACTURE} from "../../constants/ActionTypes";

const ManufactureCreate = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const submitCustomer = data => {
    try {
      dispatch({
        type: CREATE_MANUFACTURE,
        payload: data
      });
    } catch (e) {
      message.error(e.message);
    }

  };
  return (
    <Card title={[
      <Button type={"link"}
              className="m-0"
              key="btn_back"
              onClick={props.history.goBack} icon={<LeftOutlined />}>
        Quay lại
      </Button>,
      `Thêm mới nhà sản xuất`
    ]}
          extra={[
            <small className={`text-note danger`}>* các thông tin bắt buộc</small>,
            <Button htmlType={`reset`}><ClearOutlined /> Nhập lại</Button>,
            <Button form={`form-manufacture`} type={`primary`} htmlType={`submit`}><SaveOutlined /> Lưu</Button>,
          ]}

    >
      <Form onFinish={submitCustomer} id={`form-manufacture`} form={form} layout="horizontal"
            {...{
              labelAlign: 'left',
              labelCol: {
                xs: {span: 24},
                sm: {span: 8},
              },
              wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
              },
            }}
            validateMessages={formMsg}>

        <Row>
          <Col xs={24} md={24}>
            <Form.Item
              name={`name`}
              label={<b>Tên Nhà cung cấp</b>}
              rules={[{required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={`type`}
              label={<b>Loại</b>}
              initialValue={CUSTOMER_TYPE_MANUFACTURE}
              rules={[{required: true}]}>
              <Select disabled placeholder="Chọn">
                {CUSTOMER_TYPE.map(item => <Select.Option value={item.key}>{item.label}</Select.Option>)}
              </Select>
            </Form.Item>
            <Divider />
            <h4><TagOutlined /> Thông tin liên lạc</h4>
            <Row>
              <Col md={12}>
                <Form.Item
                  name={`phone`}
                  label={`SĐT`}
                >
                  <Input />
                </Form.Item>

                {/*<Form.Item name={`birth`} label={`Ngày sinh`}>*/}
                {/*  <DatePicker placeholder={`Ngày sinh`} style={{width: '100%'}} />*/}
                {/*</Form.Item>*/}
              </Col>
              <Col md={12}>
                <Form.Item name={`email`} label={`Email`} rules={[{type: 'email'}]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <h4><TagOutlined /> Địa chỉ</h4>
            <Row>
              <Col md={12}>
                <Form.Item
                  name={`username_sh`}
                  label={`Tên`}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={`tel_sh`}
                  label={`SĐT`}
                >
                  <Input />
                </Form.Item>

                <Form.Item name={`email_sh`} label={`Email`} rules={[{type: 'email'}]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col md={12}>
                <ProvinceGroup
                  wardCode={`ship_ward_code`}
                  cityCode={`ship_city_code`}
                  districtCode={`ship_district_code`}
                  districtName={`ship_district_name`}
                  wardName={`ship_ward_name`}
                  cityName={`shi_scity_name`}
                  form={form} />
              </Col>
            </Row>
            <Divider />
            {/*<h4><TagOutlined /> Hóa đơn</h4>*/}
            {/*<Row>*/}
            {/*  <Col md={12}>*/}
            {/*    <Form.Item*/}
            {/*      name={`username_bi`}*/}
            {/*      label={`Tên`}*/}
            {/*    >*/}
            {/*      <Input />*/}
            {/*    </Form.Item>*/}

            {/*    <Form.Item*/}
            {/*      name={`tel_bi`}*/}
            {/*      label={`SĐT`}*/}
            {/*    >*/}
            {/*      <Input />*/}
            {/*    </Form.Item>*/}

            {/*    <Form.Item name={`email_bi`} label={`Email`} rules={[{type: 'email'}]}>*/}
            {/*      <Input />*/}
            {/*    </Form.Item>*/}

            {/*    <Form.Item name={`numtax_bi`}>*/}
            {/*      <Input />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*  <Col md={12}>*/}
            {/*    <ProvinceGroup*/}
            {/*      wardCode={`order_ward_code`}*/}
            {/*      cityCode={`order_city_code`}*/}
            {/*      districtCode={`order_district_code`}*/}
            {/*      districtName={`order_district_name`}*/}
            {/*      wardName={`order_ward_name`}*/}
            {/*      cityName={`order_city_name`}*/}
            {/*      form={form} />*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </Col>
          {/*<Col xs={24} md={6} className={`border-left`}>*/}
          {/*  <Form.Item*/}
          {/*    name={`image_url`}*/}
          {/*    label={`Hình ảnh`}*/}
          {/*  >*/}
          {/*    <Upload*/}
          {/*      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*/}
          {/*      listType="picture"*/}
          {/*      maxCount={1}*/}
          {/*    >*/}
          {/*      <Button icon={<UploadOutlined />}>Upload</Button>*/}
          {/*    </Upload>*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col md={24}>
            <Divider />
            <div className={`d-flex align-center space-end`}>
              <small className={`text-note danger`}>* các thông tin bắt buộc</small>
              <Button htmlType={`reset`}><ClearOutlined /> Nhập lại</Button>
              <Button type={`primary`} htmlType={`submit`}><SaveOutlined /> Lưu</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
export default ManufactureCreate;

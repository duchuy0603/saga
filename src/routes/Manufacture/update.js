import React, {useEffect, useState} from "react";
import {
  Card,
  Row,
  DatePicker,
  Col,
  Button,
  Form,
  message,
  Input,
  Select,
  Divider, Upload
} from "antd";
import {useDispatch} from "react-redux";
import {ClearOutlined, LeftOutlined, SaveOutlined, TagOutlined} from "@ant-design/icons";
import {CUSTOMER_TYPE, formMsg, CUSTOMER_TYPE_MANUFACTURE} from '../../constants/constant';
import ProvinceGroup from "../../components/ProvinceGroup";
import {UploadOutlined} from "@ant-design/icons/lib/icons";
import {useParams} from "react-router-dom";
import {reqCustomerDetail} from "../../appRedux/services/customer";
import {UPDATE_MANUFACTURE} from "../../constants/ActionTypes";
import moment from 'moment';


const ManufactureUpdate = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {mId} = useParams();

  const [state, setState] = useState({
    customer: {}
  });
  const submitCustomer = data => {
    try {
      dispatch({
        type: UPDATE_MANUFACTURE,
        payload: {
          ...data,
          type: CUSTOMER_TYPE_MANUFACTURE
        }
      });
    } catch (e) {
      message.error(e.message);
    }

  };
  useEffect(() => {
    (async () => {
      try {
        const {data} = await reqCustomerDetail(mId);
        form.setFieldsValue({
          ...data,
          date_of_birth: data.date_of_birth ? moment.unix(data.date_of_birth) : null
        });
        setState({
          customer: data
        })
      } catch (e) {
        message.error(e.message);
      }
    })()
  }, []);
  return (

    <Card size={"small"} title={[
      <Button type={"link"}
              className="m-0"
              key="btn_back"
              onClick={props.history.goBack} icon={<LeftOutlined/>}>
        Quay lại
      </Button>,
      <span key={'top-title'}>`Cập nhật nhà sản xuất`</span>
    ]}
          extra={[
            <small className={`text-note danger`}>* các thông tin bắt buộc</small>,
            <Button htmlType={`reset`}><ClearOutlined/> Nhập lại</Button>,
            <Button form="formCustomer" type={`primary`} htmlType={`submit`}><SaveOutlined/> Lưu</Button>,
          ]}
    >
      <Form id={`formCustomer`} onFinish={submitCustomer} form={form}
            layout="horizontal"
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
              name={`id`}
              hidden
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name={`name`}
              label={<b>Tên nhà cung cấp</b>}
              rules={[{required: true}]}>
              <Input/>
            </Form.Item>
            {/*<Form.Item*/}
            {/*  name={`type`}*/}
            {/*  hidden*/}
            {/*  label={<b>Loại</b>}*/}
            {/*  rules={[{required: true}]}>*/}
            {/*  <Select placeholder="Chọn">*/}
            {/*    {CUSTOMER_TYPE.map(item => <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}*/}
            {/*  </Select>*/}
            {/*</Form.Item>*/}
            <Divider/>
            <h4><TagOutlined/> Thông tin liên lạc</h4>
            <Row>
              <Col md={8}>
                <Form.Item
                  rules={[{required: true, message: 'Số điện thoại bắt buộc!'}]}
                  name={`phone`}
                  label={`SĐT`}
                >
                  <Input/>
                </Form.Item>
                <Form.Item name={`email`} label={`Email`} rules={[{type: 'email'}]}>
                  <Input/>
                </Form.Item>
                {/*<Form.Item name={`date_of_birth`} label={`Ngày sinh`}>*/}
                {/*  <DatePicker style={{width: '100%'}}/>*/}
                {/*</Form.Item>*/}
              </Col>
              <Col md={12}>
                <ProvinceGroup
                  emptyName={true}
                  districtName={`district_name`}
                  wardName={`ward_name`}
                  cityName={`city_name`}
                  form={form}/>
              </Col>
            </Row>
            <Divider/>
            <h4><TagOutlined/> Địa chỉ</h4>
            <Row>
              <Col md={12}>
                <Form.Item
                  name={``}
                  label={`Tên`}
                >
                  <Input/>
                </Form.Item>

                <Form.Item
                  name={``}
                  label={`SĐT`}
                  rules={[{type: 'number'}]}>
                  <Input/>
                </Form.Item>

                <Form.Item name={``} label={`Email`} rules={[{type: 'email'}]}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col md={12}>
                <ProvinceGroup
                  cityCode={`ship_city_code`}
                  cityName={`ship_city_name`}
                  districtCode={`ship_district_code`}
                  districtName={`ship_district_name`}
                  wardCode={`ship_ward_code`}
                  wardName={`ship_ward_name`}
                  form={form}/>
              </Col>
            </Row>
            <Divider/>
            {/*<h4><TagOutlined/> Hóa đơn</h4>*/}
            {/*<Row>*/}
            {/*  <Col md={12}>*/}
            {/*    <Form.Item*/}
            {/*      name={``}*/}
            {/*      label={`Tên`}*/}
            {/*    >*/}
            {/*      <Input/>*/}
            {/*    </Form.Item>*/}

            {/*    <Form.Item*/}
            {/*      name={``}*/}
            {/*      label={`SĐT`}*/}
            {/*    >*/}
            {/*      <Input/>*/}
            {/*    </Form.Item>*/}

            {/*    <Form.Item name={``} label={`Email`} rules={[{type: 'email'}]}>*/}
            {/*      <Input/>*/}
            {/*    </Form.Item>*/}

            {/*    <Form.Item name={``} label={`MST`}>*/}
            {/*      <Input/>*/}
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
            {/*      form={form}/>*/}
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
          {/*      <Button icon={<UploadOutlined/>}>Upload</Button>*/}
          {/*    </Upload>*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col md={24}>
            <Divider/>
            <div className={`d-flex align-center space-end`}>
              <small className={`text-note danger`}>* các thông tin bắt buộc</small>
              <Button htmlType={`reset`}><ClearOutlined/> Nhập lại</Button>
              <Button type={`primary`} htmlType={`submit`}><SaveOutlined/> Lưu</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
export default ManufactureUpdate;

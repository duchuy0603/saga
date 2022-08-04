import React, {useEffect} from "react";
import {
  Row,
  DatePicker,
  Col,
  Button,
  Form,
  Input,
  Divider,
  Upload
} from "antd";
import {ClearOutlined, SaveOutlined, TagOutlined, UploadOutlined} from "@ant-design/icons";
import ProvinceGroup from "../../components/ProvinceGroup";
import {CUSTOMER_TYPE_CUSTOMER} from "../../constants/constant";

const FormCustomer = (props) => {
  const {customer, onFinish} = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...customer,
      type: CUSTOMER_TYPE_CUSTOMER
    });
  }, [customer]);

  return (
    <Form
      id={"formCustomer"}
      onFinish={(formData) => onFinish(formData)}
      form={form}
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
      }}>
      <Row>
        <Col xs={24} md={18}>
          <Form.Item
            name={`type`}
            label={false}
            hidden
            rules={[{required: true, message: 'Loại là bắt buộc'}]}>
            <Input type={"hidden"} />
          </Form.Item>
          <Form.Item
            name={`name`}
            label={<b>Tên khách hàng</b>}
            rules={[{required: true, message: 'Tên là bắt buộc'}]}>
            <Input />
          </Form.Item>
          {/*<Form.Item*/}
          {/*  name={`type`}*/}
          {/*  hidden*/}
          {/*  label={<b>Loại</b>}*/}
          {/*  rules={[{required: true}]}>*/}
          {/*  <Select placeholder="Chọn">*/}
          {/*    {CUSTOMER_TYPE.map(item =>*/}
          {/*      <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          <Divider />
          <h4><TagOutlined /> Thông tin liên lạc</h4>
          <Row>
            <Col md={8}>
              <Form.Item
                rules={[{required: true, message: 'Số điện thoại bắt buộc!'}]}
                name={`phone`}
                label={`SĐT`}
              >
                <Input />
              </Form.Item>
              <Form.Item name={`email`} label={`Email`} rules={[{type: 'email'}]}>
                <Input />
              </Form.Item>
              <Form.Item name={`date_of_birth`} label={`Ngày sinh`}>
                <DatePicker style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <ProvinceGroup
                districtCode={`district_code`}
                wardCode={`ward_code`}
                cityCode={`city_code`}
                districtName={`district`}
                wardName={`ward`}
                cityName={`city`}
                form={form} />
            </Col>
          </Row>
          <Divider />
          <h4><TagOutlined /> Địa chỉ shipping</h4>
          <Row>
            <Col md={12}>
              <Form.Item
                name={``}
                label={`Tên`}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={``}
                label={`SĐT`}
                rules={[{type: 'number'}]}>
                <Input />
              </Form.Item>

              <Form.Item name={``} label={`Email`} rules={[{type: 'email'}]}>
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
          <h4><TagOutlined /> Hóa đơn</h4>
          <Row>
            <Col md={12}>
              <Form.Item
                name={``}
                label={`Tên`}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={``}
                label={`SĐT`}
              >
                <Input />
              </Form.Item>

              <Form.Item name={``} label={`Email`} rules={[{type: 'email'}]}>
                <Input />
              </Form.Item>

              <Form.Item name={``} label={`MST`}>
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <ProvinceGroup
                wardCode={`order_ward_code`}
                cityCode={`order_city_code`}
                districtCode={`order_district_code`}
                districtName={`order_district_name`}
                wardName={`order_ward_name`}
                cityName={`order_city_name`}
                form={form} />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6} className={`border-left`}>
          <Form.Item
            name={`image_url`}
            label={`Hình ảnh`}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Col>
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
  )
};
export default FormCustomer;

import React, {useEffect} from "react";
import {formWrap} from "../../constants/constant";
import {PlusCircleOutlined} from "@ant-design/icons/lib/icons";
import {Button, Card, Col, Divider, Form, Input, Row, Select, Space} from 'antd';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CREATE_PRODUCT} from "../../constants/ActionTypes";
import {LeftOutlined} from "@ant-design/icons";
import ProductVariableTable from "./product-variable-table";

const ProductCreate = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {vendors} = useSelector(({vendor}) => vendor);
  const {manufactures} = useSelector(({manufacture}) => manufacture);

  const onFinish = (product) => {
    dispatch({
      type: CREATE_PRODUCT,
      payload: {
        product
      }
    });
  };
  const setName = (name, value) => {
    form.setFieldsValue({
      ...form,
      [name]: value.children
    });
  };
  useEffect(() => {
    // dispatch({
    //   type: GET_MANUFACTURE,
    //   payload: {
    //     page: -1
    //   }
    // });
    // dispatch({
    //   type: GET_VENDOR,
    //   payload: {
    //     page: -1
    //   }
    // });
  }, []);

  return (
    <>
      <Form form={form} onFinish={onFinish} layout="horizontal" {...formWrap}>

        <Card
          extra={[
            <Button htmlType={`submit`} type="primary">Lưu</Button>
          ]}
          title={[
            <Link to={`/product`}><LeftOutlined /> Danh sách </Link>,
            `Tạo sản phẩm mới`
          ]}
        >
          <Row>
            <Col xs={24} md={16}>
              <Form.Item
                name={`name`}
                label={`Tên sản phẩm`}
                rules={[{required: true, message: 'Tên sản phẩm bắt buộc!'}]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`short_description`}
                label={`Mô tả ngắn`}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              {/*<Form.Item*/}
              {/*  initialValue={`draft`}*/}
              {/*  name={`status`}*/}
              {/*  label={`Trạng thái`}*/}
              {/*>*/}
              {/*  <Select placeholder={'Chọn'}>*/}
              {/*    <Select.Option value={`draft`}>Nháp</Select.Option>*/}
              {/*    <Select.Option value={`active`}>Hiển thị</Select.Option>*/}
              {/*    <Select.Option value={`de-active`}>Ẩn</Select.Option>*/}
              {/*  </Select>*/}
              {/*</Form.Item>*/}
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={`unit`}
                label={`Đơn vị`}
              >
                <Select placeholder={'Chọn'}>
                  <Select.Option value={`Chiếc`}>Chiếc</Select.Option>
                  <Select.Option value={`Chai`}>Chai</Select.Option>
                  <Select.Option value={`Hộp`}>Hộp</Select.Option>
                </Select>
              </Form.Item>
              <div className={`d-flex space-between`}>
                <Form.Item
                  className={`label-custom`}
                  style={{width: '100%'}}
                  name={`manufacture_id`}
                  label={`Nhà sản xuất`}
                >
                  <Select onChange={(val, evt) => setName('manufacture_name', evt)}
                          placeholder={'Chọn'}>
                    {manufactures ?
                      manufactures.map(manufacture =>
                        <Select.Option value={manufacture.id}>{manufacture.name}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
                <Link to={`/manufacture/create`}>
                  <Button><PlusCircleOutlined /></Button>
                </Link>
              </div>
              <div className={`d-flex space-between`}>
                <Form.Item
                  className={`label-custom`}
                  style={{width: `100%`}}
                  name="vendor_id"
                  label={`Nhà cung cấp`}
                >
                  <Select onChange={(val, evt) => setName('vendor_name', evt)}
                          placeholder={'Chọn'}>
                    {vendors ?
                      vendors.map(vendor =>
                        <Select.Option value={vendor.id}>{vendor.name}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
                <Link to={`/vendor/create`}>
                  <Button><PlusCircleOutlined /></Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Card>
      </Form>
      <ProductVariableTable />
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Space align="center">
          <p style={{color: 'red'}} className={`text-danger`}>(*) Thông tin bắt buộc</p>
          <Button htmlType={`reset`}>Làm mới</Button>
          <Button htmlType={`submit`} type="primary">Lưu</Button>
        </Space>
      </div>
    </>
  )
};
export default ProductCreate;

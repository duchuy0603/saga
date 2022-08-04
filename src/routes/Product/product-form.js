import React, {useEffect} from "react";
import {formWrap, PRODUCT_GROUP_SINGLE, PRODUCT_STATUS, PRODUCT_UNITS} from "../../constants/constant";
import {PlusCircleOutlined} from "@ant-design/icons/lib/icons";
import {
  Row,
  Col,
  Space,
  Form,
  Select,
  Divider,
  Card,
  Input,
  Button,
  InputNumber,
  Spin, Image
} from 'antd';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {GET_MANUFACTURE} from "../../constants/ActionTypes";
import {LeftOutlined} from "@ant-design/icons";
import SelectManufacture from "../../components/Input/SelectManufacture";
import {defaultImage} from "../../util/Helper";

const ProductForm = (props) => {
  const {product, form, onFinish} = props;
  const dispatch = useDispatch();
  const {pDetailLoading} = useSelector(({product}) => product);
  const {productId} = useParams();

  const setName = (name, value) => {
    form.setFieldsValue({
      ...form,
      [name]: value.children
    });
  };

  const onSearchManufacture = (name) => {
    dispatch({
      type: GET_MANUFACTURE,
      payload: {
        perPage: 5,
        name
      }
    });
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product]);

  return (
    <Spin spinning={pDetailLoading}>
      <Form form={form} onFinish={onFinish} layout="horizontal" {...formWrap}>
        <Card
          size={'small'}
          extra={[
            <Button key={'btn_submit'} loading={pDetailLoading} htmlType={`submit`} type="primary">Lưu</Button>
          ]}
          title={<Space split={"|"}>
            <Button onClick={() => props.history.goBack()} type={"link"} className={'m-0'}>
              <LeftOutlined/> Quay lại
            </Button>
            <span>#{productId} - {product.name}</span>
          </Space>}
        >
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name={`id`}
                hidden
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name={`name`}
                label={`Tên sản phẩm`}
                rules={[{required: true, message: 'Tên sản phẩm bắt buộc!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name={`sku`}
                label={`SKU`}
                // rules={[{required: true, message: 'Mã sản phẩm bắt buộc!'}]}
              >
                <Input disabled={product.group === PRODUCT_GROUP_SINGLE}/>
              </Form.Item>
              <Form.Item
                name={`barcode`}
                label={`Barcode`}
                // rules={[{required: true, message: 'Mã sản phẩm bắt buộc!'}]}
              >
                <Input disabled={product.group === PRODUCT_GROUP_SINGLE}/>
              </Form.Item>
              <Form.Item
                initialValue={0}
                name={`price`}
                label={`Giá sản phẩm`}
              >
                <InputNumber style={{width: '50%'}} placeholder={'Giá sản phẩm'}/>
              </Form.Item>
              <Form.Item
                initialValue={0}
                label={`Loại sản phẩm`}
              >
                <span>{product.group === PRODUCT_GROUP_SINGLE ?
                  <Space>
                    <span>Sản phẩm con | <Link to={`/product/update/${product.parent_id}`}>Xem sản phẩm cha</Link></span>
                  </Space>:
                  `Sản phẩm cha`}
                </span>
              </Form.Item>
              {/*<Form.Item*/}
              {/*  name={`short_description`}*/}
              {/*  label={`Mô tả ngắn`}*/}
              {/*>*/}
              {/*  <Input.TextArea rows={4}/>*/}
              {/*</Form.Item>*/}

              <Form.Item
                name={`unit`}
                label={`Đơn vị`}
              >
                <Select placeholder={'Chọn'}>
                  {PRODUCT_UNITS.map(item => <Select.Option
                    key={`u_${item.code}`}
                    value={item.code}>
                    {item.name}
                  </Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item
                initialValue={`draft`}
                name={`status`}
                label={`Trạng thái`}
              >
                <Select placeholder={'Chọn'}>
                  {PRODUCT_STATUS.map(item => <Select.Option
                    key={`stt_${item.code}`}
                    value={item.code}>
                    {item.name}
                  </Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Image
                width={200}
                height={200}
                src={product.image_url}
                fallback={defaultImage()}
              />
            </Col>
          </Row>
          <Divider/>
          <Row gutter={[24, 0]}>
            <Col md={12}>
              <Form.Item
                hidden
                name={`manufacture_name`}
              >
                <Input/>
              </Form.Item>
              <div className={`d-flex space-between`}>
                <Form.Item
                  className={`label-custom`}
                  style={{width: '100%'}}
                  name={`manufacture_id`}
                  label={`Nhà sản xuất`}
                >
                  <SelectManufacture onChange={v => setName('manufacture_name', v)} fo={form}/>
                </Form.Item>
                <Link to={`/manufacture/create`}>
                  <Button><PlusCircleOutlined/></Button>
                </Link>
              </div>
              <Form.Item
                name={`upc`}
                label={`UPC`}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name={`isbn`}
                label={`USBN`}
              >
                <Input/>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name={`weight`}
                label={`Khối lượng (kg)`}
              >
                <InputNumber/>
              </Form.Item>

              <Form.Item
                name={`ean`}
                label={`EAN`}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name={`mpn`}
                label={`MPN`}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>
          <Divider/>

          <Row gutter={[24, 0]}>
            {/*<Col md={12}>*/}
            {/*<Form.Item*/}
            {/*  name={`vendor_name`}*/}
            {/*  hidden*/}
            {/*>*/}
            {/*  <Input />*/}
            {/*</Form.Item>*/}
            {/*<div className={`d-flex space-between`}>*/}
            {/*  <Form.Item*/}
            {/*    className={`label-custom`}*/}
            {/*    style={{width: `100%`}}*/}
            {/*    name="vendor_id"*/}
            {/*    label={`Nhà cung cấp`}*/}
            {/*  >*/}
            {/*    <Select onChange={(val, evt) => setName('vendor_name', evt)}*/}
            {/*            placeholder={'Chọn'}>*/}
            {/*      {vendors ?*/}
            {/*        vendors.map(vendor =>*/}
            {/*          <Select.Option value={vendor.id}>{vendor.name}</Select.Option>)*/}
            {/*        : null}*/}
            {/*    </Select>*/}
            {/*  </Form.Item>*/}
            {/*  <Link to={`/vendor/create`}>*/}
            {/*    <Button><PlusCircleOutlined /></Button>*/}
            {/*  </Link>*/}
            {/*</div>*/}

            {/*<h2>Danh sách lưu kho</h2>*/}
            {/*<Table*/}
            {/*  dataSource={[]}*/}
            {/*  columns={[*/}
            {/*    {title: 'Kho', dataIndex: 'warehouse_id', key: 'warehouse_id'},*/}
            {/*    {title: 'Kho', dataIndex: 'warehouse_id', key: 'warehouse_id'},*/}
            {/*    {title: 'Kho', dataIndex: 'warehouse_id', key: 'warehouse_id'},*/}
            {/*  ]}*/}
            {/*/>*/}
            {/*</Col>*/}
            <Col md={12}>
              <Form.Item
                name={`stock_warn`}
                label={`Cảnh báo tồn`}
              >
                <Input type={'number'} min={0}/>
              </Form.Item>
            </Col>
          </Row>
          <Divider/>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Space align="center">
              <p style={{color: 'red'}} className={`text-danger`}>(*) Thông tin bắt buộc</p>
              <Button htmlType={`reset`}>Làm mới</Button>
              <Button htmlType={`submit`} type="primary">Lưu</Button>
            </Space>
          </div>
        </Card>
      </Form>
    </Spin>
  )
};
export default ProductForm;

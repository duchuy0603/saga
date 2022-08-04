import React, {useEffect, useState} from 'react';
import {
  Button,
  Card, Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
  CARRIER_CREATE,
  CARRIER_DELETE,
  CARRIER_GET_LIST, CARRIER_UPDATE,
} from "../../constants/ActionTypes";
import {ClearOutlined, DeleteOutlined, EditOutlined, TagOutlined} from "@ant-design/icons";
import {CARRIER_TYPE_MANUAL, CARRIER_TYPES} from "../../constants/constant";
import {getEmpty, renderNumberFormat} from "../../util/Helper";

const Brand = (props) => {
  const [state, setState] = useState({
    modalVisible: false,
    modalTitle: ''
  });
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [totalFormat, setTotalFormat] = useState(0);
  const dispatch = useDispatch();
  const {carrierList, isLoading, carrierPaginate} = useSelector(({carrier}) => carrier);
  const getCarriers = (params = {}) => {
    const searchFields = searchForm.getFieldsValue();
    dispatch({
      type: CARRIER_GET_LIST,
      payload: {
        ...searchFields,
        ...params,
      }
    })
  }
  const onCancel = () => {
    setState({
      ...state,
      modalVisible: false,
      modalTitle: ''
    });
    form.resetFields();
  }
  const onCreate = () => {
    setState({
      ...state,
      modalVisible: true,
      modalTitle: 'Tạo đơn vị vận chuyển'
    });
  }
  const onUpdate = data => {
    setState({
      ...state,
      modalVisible: true,
      modalTitle: 'Cập nhật đơn vị vận chuyển'
    });
    form.setFieldsValue({
      ...data,
      shipping_fee: data.shipping_fee,
    });
  }
  const onDelete = carrierId => {
    dispatch({
      type: CARRIER_DELETE,
      payload: {
        carrierId
      }
    })
  }
  const onChangeTotal = (value) => {
    setTotalFormat(renderNumberFormat(value, '', '₫'));
  };
  const submitForm = data => {
    let action = CARRIER_CREATE;
    if (typeof data.id !== "undefined") {
      action = CARRIER_UPDATE;
    }
    dispatch({
      type: action,
      payload: data
    });
    onCancel();
  }
  useEffect(() => {
    getCarriers();
  }, []);
  return (
    <Card title={`Đơn vị vận chuyển`}
          extra={[
            <Button onClick={onCreate}><TagOutlined/> Thêm ĐVVC</Button>
          ]}>
      <Form
        {...{
          labelCol: {
            xs: {span: 24},
            sm: {span: 24},
          },
          wrapperCol: {
            xs: {span: 24},
            sm: {span: 24},
          },
        }}
        form={searchForm} onFinish={data => getCarriers(data)}>
        <Row>
          <Col sm={6}>
            <Form.Item name={`name`}>
              <Input placeholder={`Tên ĐVVC`}/>
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item name={`code`}>
              <Input placeholder={`Mã`}/>
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item name={`carrier_type`}>
              <Select allowClear placeholder={'Loại vận chuyển...'}>
                {CARRIER_TYPES && CARRIER_TYPES.map((i, k) => (
                  <Select.Option key={k} value={i.code}>{i.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Button htmlType={`submit`} type={`primary`}>Lọc</Button>
            <Button onClick={() => {
              searchForm.resetFields();
              getCarriers();
            }}>Bỏ lọc</Button>
          </Col>
        </Row>
      </Form>
      <Spin spinning={isLoading}>
        <Table
          rowKey={'id'}
          onChange={({current, pageSize}) => getCarriers({page: current})}
          pagination={carrierPaginate}
          dataSource={carrierList}
          columns={[
            {
              title: 'Tên', dataIndex: 'name', key: 'name', render: (name, raw) => {
                return <Space size={1} direction={'vertical'}>
                  <b>{name}</b>
                  <small>code: {raw.code}</small>
                </Space>
              }
            },
            {
              title: 'Loại', dataIndex: 'carrier_type', key: 'carrier_type', render: type => {
                const hasType = CARRIER_TYPES.find(carrier => carrier.code === type);
                if (!hasType) {
                  return getEmpty();
                }
                return hasType.title;
              }
            },
            {
              title: 'Phí ship',
              dataIndex: 'shipping_fee',
              key: 'shipping_fee',
              render: fee => renderNumberFormat(fee, 'đ')
            },
            {title: 'Trạng thái', dataIndex: 'origin_status', key: 'origin_status'},
            {
              title: '', key: 'action', render: raw => {
                return <Space>
                  <Button onClick={() => onUpdate(raw)} size={'small'}><EditOutlined/></Button>
                  <Popconfirm title={`Xóa ĐVVC hàng này?`} onConfirm={() => onDelete(raw.id)}>
                    <Button danger type={`dashed`} size={'small'}><DeleteOutlined/></Button>
                  </Popconfirm>
                </Space>
              }
            },
          ]}
        />
      </Spin>
      <Modal
        footer={<Space>
          <small className={`text-note danger`}>* thông tin bắt buộc</small>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type={`primary`} htmlType={'submit'} form={'carrier-form'}>Lưu</Button>
        </Space>}
        onCancel={onCancel}
        visible={state.modalVisible}
        title={state.modalTitle}>
        <Form
          onFinish={submitForm}
          form={form}
          id={'carrier-form'}
          {...{
            labelCol: {
              xs: {span: 24},
              sm: {span: 8},
            },
            wrapperCol: {
              xs: {span: 24},
              sm: {span: 16},
            },
            labelAlign: 'left',
          }}
        >
          <Form.Item
            name={'id'}
            hidden
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'name'}
            rules={[{required: true, message: 'Nhập tên đơn vị vận chuyển'}]}
            label={'Tên đơn vị vận chuyển'}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'code'}
            rules={[{required: true, message: 'Mã ĐVVC'}]}
            label={'Mã'}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            // initialValue={0}
            name={'shipping_fee'}
            rules={[
              {required: true, message: 'Nhập phí vận chuyển'},
              {min: 0, message: 'Giá trị nhập phải lớn hơn 0'}
            ]}
            label={'Phí vận chuyển'}
          >
            <Space direction={"vertical"} size={'small'} style={{width: '100%'}}>
              <InputNumber value={form.getFieldValue('shipping_fee')} style={{width: '100%'}} onChange={onChangeTotal}/>
              <small className="text-muted">{totalFormat ? totalFormat : form.getFieldValue('shipping_fee')}</small>
            </Space>
          </Form.Item>
          <Form.Item
            initialValue={CARRIER_TYPE_MANUAL}
            name={'carrier_type'}
            rules={[{required: true, message: 'Chọn loại vận chuyển'}]}
            label={'Loại VC'}
          >
            <Select placeholder={'Chọn...'}>
              {CARRIER_TYPES && CARRIER_TYPES.map((i, k) => (
                <Select.Option key={k} value={i.code}>{i.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'carrier_class'}
            label={'Class'}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'origin_status'}
            label={'Origin status'}
          >
            <Input.TextArea rows={3}/>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
export default Brand;

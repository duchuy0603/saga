import React, {useEffect, useState} from "react";
import {Button, Card, Spin, Table, Space, Modal, Input, Form, Select, message, Popconfirm} from "antd";
import {TagOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {CREATE_BRAND, DELETE_BRAND, GET_BRAND, UPDATE_BRAND} from "../../constants/ActionTypes";
import {formWrap} from "../../constants/constant";
import ProvinceGroup from "../../components/ProvinceGroup";


const Brand = () => {
  const [state, setState] = useState({
    modalVisible: false,
    modalTitle: ''
  });
  const [form] = Form.useForm();
  const {brandList, isLoading, pagination} = useSelector(({brand}) => brand);
  const dispatch = useDispatch();
  const getBrands = (params) => {
    try {
      dispatch({
        type: GET_BRAND,
        payload: params
      })
    } catch (e) {
      message.error(e.message)
    }
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
      modalTitle: 'Tạo nhãn hàng'
    });
  }
  const onUpdate = data => {
    setState({
      ...state,
      modalVisible: true,
      modalTitle: 'Cập nhật nhãn hàng'
    });
    form.setFieldsValue(data);
  }
  const onDelete = brandId => {
    dispatch({
      type: DELETE_BRAND,
      payload: {
        brandId
      }
    })
  }
  const submitForm = data => {
    let action = CREATE_BRAND;
    if (typeof data.id !== "undefined") {
      action = UPDATE_BRAND;
    }
    dispatch({
      type: action,
      payload: data
    });
    onCancel();
  }
  useEffect(() => {
    getBrands();
  }, []);
  return (
    <Card title={`Nhãn hàng`}
          extra={[
            <Button onClick={onCreate}><TagOutlined/> Tạo nhãn hàng</Button>
          ]}>
      <Spin spinning={isLoading}>
        <Table
          rowKey={'id'}
          pagination={pagination}
          onChange={({current, pageSize}) => getBrands({page: current})}
          dataSource={brandList}
          columns={[
            {title: 'ID', dataIndex: 'id', key: 'id', render: id => <span>#{id}</span>},
            // {
            //   title: 'Mã', dataIndex: 'code', key: 'code', render: code => code ? code.toString() : '---'
            // },
            {title: 'Tên nhãn', dataIndex: 'name', key: 'name'},
            {title: 'Địa chỉ', dataIndex: 'address', key: 'address'},
            {title: 'Thành phố', dataIndex: 'city', key: 'city'},
            {title: 'Quận/Huyện', dataIndex: 'district', key: 'district'},
            {title: 'Phường', dataIndex: 'ward', key: 'ward'},
            {title: 'Điện thoại', dataIndex: 'phone', key: 'phone'},
            {
              title: '', key: 'action', render: raw => {
                return <Space>
                  <Button onClick={() => onUpdate(raw)} size={'small'}><EditOutlined/></Button>
                  <Popconfirm title={`Xóa nhãn hàng này?`} onConfirm={() => onDelete(raw.id)}>
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
          <Button type={`primary`} htmlType={'submit'} form={'brand-form'}>Lưu</Button>
        </Space>}
        onCancel={onCancel}
        visible={state.modalVisible}
        title={state.modalTitle}>
        <Form
          onFinish={submitForm}
          form={form}
          id={'brand-form'}
          {...formWrap}
        >
          <Form.Item
            name={'id'}
            hidden
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'code'}
            rules={[{required: true, message: 'Nhập mã nhãn hàng'}]}
            label={'Mã nhãn hàng'}
          >
            <Select mode={`tags`}/>
          </Form.Item>
          <Form.Item
            name={'name'}
            rules={[{required: true, message: 'Nhập tên nhãn hàng'}]}
            label={'Tên nhãn hàng'}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'phone'}
            rules={[{required: true, message: 'Nhập tên nhãn hàng'}]}
            label={'Số điện thoại'}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            rules={[{required: true, message: 'Nhập tên nhãn hàng'}]}
            name={'address'}
            label={'Địa chỉ'}
          >
            <Input.TextArea rows={3}/>
          </Form.Item>
          <ProvinceGroup
            cityCode={`city_code`}
            cityName={`city`}
            districtCode={`district_code`}
            districtName={`district`}
            wardCode={`ward_code`}
            wardName={`ward`}
            form={form}/>
        </Form>
      </Modal>
    </Card>
  )
}
export default Brand;

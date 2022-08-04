import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Spin, Table} from "antd";
import {DeleteOutlined, EditOutlined, TagOutlined} from "@ant-design/icons";
import {formWrap, TAG_TYPES} from "../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {
  TAG_CREATE,
  TAG_DELETE,
  TAG_GET_LIST, TAG_UPDATE,
} from "../../constants/ActionTypes";

const Tag = () => {
  const [state, setState] = useState({
    modalVisible: false,
    modalTitle: ''
  });
  const [form] = Form.useForm();
  const {tagList, isLoading, tagPaginate} = useSelector(({tag}) => tag);
  const dispatch = useDispatch();
  const getTags = (params) => {
    try {
      dispatch({
        type: TAG_GET_LIST,
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
      modalTitle: 'Tạo tag'
    });
  }
  const onUpdate = data => {
    setState({
      ...state,
      modalVisible: true,
      modalTitle: 'Chỉnh sửa tag'
    });
    form.setFieldsValue(data);
  }
  const onDelete = tagId => {
    dispatch({
      type: TAG_DELETE,
      payload: {
        tagId
      }
    })
  }
  const submitForm = data => {
    let action = TAG_CREATE;
    if (typeof data.id !== "undefined") {
      action = TAG_UPDATE;
    }
    dispatch({
      type: action,
      payload: data
    });
    onCancel();
  }
  useEffect(() => {
    getTags();
  }, []);
  return (
    <Card title={`Tag`}
          extra={[
            <Button onClick={onCreate}><TagOutlined/> Tạo tag</Button>
          ]}>
      <Spin spinning={isLoading}>
        <Table
          onChange={(number) => getTags({page: number})}
          rowKey={'id'}
          dataSource={tagList}
          pagination={tagPaginate}
          columns={[
            {title: 'ID', dataIndex: 'id', key: 'id', render: id => <span>#{id}</span>},
            {title: 'Tên tag', dataIndex: 'name', key: 'name'},
            {title: 'Loại', dataIndex: 'type', key: 'type'},
            {title: 'Ref', dataIndex: 'ref', key: 'ref'},
            {
              title: '', key: 'action', render: raw => {
                return <Space>
                  <Button onClick={() => onUpdate(raw)} size={'small'}><EditOutlined/></Button>
                  <Popconfirm title={`Xóa tag này?`} onConfirm={() => onDelete(raw.id)}>
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
          <Button type={`primary`} htmlType={'submit'} form={'tag-form'}>Lưu</Button>
        </Space>}
        onCancel={onCancel}
        visible={state.modalVisible}
        title={state.modalTitle}>
        <Form
          onFinish={submitForm}
          form={form}
          id={'tag-form'}
          {...formWrap}
        >
          <Form.Item
            name={'id'}
            hidden
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'name'}
            rules={[{required: true, message: 'Nhập tên tag'}]}
            label={'Tên tag'}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={'type'}
            rules={[{required: true, message: 'Phân loại'}]}
            label={'Phân loại'}
          >
            <Select>
              {TAG_TYPES && TAG_TYPES.map(item => <Select.Option value={item.code}>{item.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name={'ref'}
            rules={[{required: true, message: 'Ref'}]}
            label={'Ref'}
          >
            <Input/>
          </Form.Item>

        </Form>
      </Modal>
    </Card>
  )
}
export default Tag;

import React from 'react';
import {Modal, Form, Input, Button, Select, Space} from "antd";
import {formWrap, USER_ACTIVE, USER_DEACTIVE, USER_ROLES} from "../../../constants/constant";
import {UPDATE_ACCOUNT} from "../../../constants/ActionTypes";
import {toInt} from "../../../util/Helper";
import {useDispatch} from "react-redux";

const AssignOpenAccount = ({account, acLoading, onClose, modalVisible}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onSave = (data) => {
    dispatch({
        type: UPDATE_ACCOUNT,
        payload: {
          account: {
            ...account,
            ...data,
            status: toInt(account.status) === 1 ? USER_DEACTIVE : USER_ACTIVE
          }
        }
      }
    );
    if (!acLoading) {
      onClose();
    }
  }
  return (
    <Modal
      onCancel={onClose}
      visible={modalVisible}
      footer={<Space>
        <small>* thông tin bắt buộc</small>
        <Button onClick={onClose}>Hủy</Button>
        <Button loading={acLoading} form={`active-form`} htmlType={`submit`} type={`primary`}>Lưu</Button>
      </Space>}
      title={`Thay đổi trạng thái`}>
      <Form onFinish={onSave} {...formWrap}
            id={'active-form'}
            form={form}>
        {!account.password &&
        <>
          <Form.Item
            rules={[{required: true, message: 'Nhập mật khẩu'}]}
            name={'password'}
            label={`Mật khẩu`}>
            <Input.Password/>
          </Form.Item>
          <Form.Item
            rules={[{required: true, message: 'Nhập lại mật khẩu'}]}
            name={'password_confirmation'}
            label={`Nhập lại mật khẩu`}>
            <Input.Password/>
          </Form.Item>
        </>}
        {!account.role && (
          <Form.Item
            rules={[{required: true, message: 'Chọn quyền cho tài khoản'}]}
            label={`Phân quyền`}
            name={`role`}
          >
            <Select placeholder={`Chọn`}>
              {USER_ROLES && USER_ROLES.map((role, key) => {
                return (
                  <Select.Option key={key} value={role.key}>{role.title}</Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        )}

      </Form>
    </Modal>
  )
}
export default AssignOpenAccount;

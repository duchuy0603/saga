import React from "react";
import {Button, Form, Input, Modal} from "antd";
import {formWrap, PRO_CAT_TYPE_ARCHIVE} from "../../../constants/constant";
import {useDispatch} from "react-redux";
import {PRODUCT_CAT_CREATE, PRODUCT_CAT_UPDATE} from "../../../constants/ActionTypes";

const ModalCreate = (props) => {
  const {setVisible, form, loading, visible, name = 'danh mục', initialValue = {}, type = PRO_CAT_TYPE_ARCHIVE} = props;
  const dispatch = useDispatch();
  const onFinish = data => {
    dispatch({
      type: !data.id ? PRODUCT_CAT_CREATE : PRODUCT_CAT_UPDATE,
      payload: data
    });
    setVisible(false)
  }

  return (
    <Modal
      onCancel={() => setVisible(false)}
      visible={visible}
      title={name}
      footer={[
        <span className={`text-danger mr-1`}>* Các trường bắt buộc!</span>,
        <Button type={`default`} onClick={() => setVisible(false)}>Hủy</Button>,
        <Button loading={loading} htmlType={`submit`} form={`brand-form`} type={`primary`}>Lưu</Button>
      ]}
    >
      <Form
        onFinish={onFinish}
        initialValues={initialValue}
        {...formWrap} id={`brand-form`}
        form={form}>
        <Form.Item
          hidden
          name={`id`}>
          <Input/>
        </Form.Item>
        <Form.Item
          hidden
          initialValue={type}
          name={`type`}>
          <Input/>
        </Form.Item>
        <Form.Item
          rules={[{required: true, message: 'Nhập tên danh mục!'}]}
          name={`name`}
          label={`Tên danh mục`}>
          <Input/>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Nhập mã code danh mục!'
            },
            {
              min: 2,
              message: 'Mã code tối thiểu 2 ký tự'
            },
            {
              type: 'regexp',
              pattern: /[^a-zA-Z0-9\s]/gi,
              message: 'Mã code không phù hợp!',
            }
          ]}
          name={`code`}
          label={`Mã code`}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ModalCreate

import React, {} from "react";
import {
  Card,
  Button, message
} from "antd";
import {ClearOutlined, LeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {CREATE_CUSTOMER} from "../../constants/ActionTypes";
import FormCustomer from "./form-customer";

const CustomerCreate = (props) => {
  const dispatch = useDispatch();
  const submitCustomer = data => {
    try {
      dispatch({
        type: CREATE_CUSTOMER,
        payload: data
      });
    } catch (e) {
      message.error(e.message);
    }

  };
  return (
    <Card size={"small"} title={[
      <Button type={"link"}
              className="m-0"
              key="btn_back"
              onClick={props.history.goBack} icon={<LeftOutlined/>}>
        Quay lại
      </Button>,
      `Thêm mới khách hàng`
    ]}
          extra={[
            <small className={`text-note danger`}>* các thông tin bắt buộc</small>,
            <Button htmlType={`reset`}><ClearOutlined/> Nhập lại</Button>,
            <Button form="formCustomer" type={`primary`} htmlType={`submit`}><SaveOutlined/> Lưu</Button>,
          ]}
    >
      <FormCustomer onFinish={submitCustomer} customer={{}}/>
    </Card>
  )
};
export default CustomerCreate;

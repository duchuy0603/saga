import React, {useEffect, useState} from "react";
import {
  Card,
  Button,
  message,
} from "antd";
import {useDispatch} from "react-redux";
import {ClearOutlined, LeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import {reqCustomerDetail} from "../../appRedux/services/customer";
import {UPDATE_CUSTOMER} from "../../constants/ActionTypes";
import FormCustomer from "./form-customer";


const CustomerCreate = (props) => {
  const {customerId} = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    customer: {}
  });
  const submitCustomer = data => {
    try {
      dispatch({
        type: UPDATE_CUSTOMER,
        payload: {
          customerId,
          params: data
        }
      });
    } catch (e) {
      message.error(e.message);
    }

  };
  useEffect(() => {
    (async () => {
      try {
        const {data} = await reqCustomerDetail(customerId);
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
              onClick={props.history.goBack} icon={<LeftOutlined />}>
        Quay lại
      </Button>,
      <span key={"t-t"}>`Thêm mới khách hàng`</span>
    ]}
          extra={[
            <small className={`text-note danger`}>* các thông tin bắt buộc</small>,
            <Button htmlType={`reset`}><ClearOutlined /> Nhập lại</Button>,
            <Button form="formCustomer" type={`primary`} htmlType={`submit`}><SaveOutlined /> Lưu</Button>,
          ]}
    >
      <FormCustomer customer={state.customer} onFinish={submitCustomer} />
    </Card>
  )
};
export default CustomerCreate;

import React, {useEffect} from "react";
import {Button, message, Checkbox, Form, Input} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {userSignIn} from "../appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";


const SignIn = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(({auth}) => auth.token);

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {
    console.log("finish", values)
    dispatch(userSignIn(values));
  };

  useEffect(() => {
    if (token !== null) {
      props.history.push('/');
    }
  }, [token, props.history]);

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
              <img src={require("assets/images/smile.jpeg")} alt='Smileup'/>
            </div>
            <div className="gx-app-logo-wid">
              <h1><IntlMessages id="app.userAuth.signIn"/></h1>
              <p><IntlMessages id="app.userAuth.bySigning"/></p>
              <p><IntlMessages id="app.userAuth.getAccount"/></p>
            </div>
            <div className="gx-app-logo">
              <img alt="example" src={require("assets/images/logo.png")}/>
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              initialValues={{remember: true}}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0">

              <Form.Item
                initialValue="admin@gmail.com"
                rules={[{required: true, message: 'The input is not valid E-mail!'}]} name="email">
                <Input placeholder="Email"/>
              </Form.Item>
              <Form.Item
                initialValue="123456"
                rules={[{required: true, message: 'Please input your Password!'}]} name="password">
                <Input type="password" placeholder="Password"/>
              </Form.Item>
              <Form.Item>
                <Checkbox name={`rememberMe`}>Remember me</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signIn"/>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

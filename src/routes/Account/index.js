import React, {useEffect, useState} from "react";
import {
  Card,
  Modal,
  Space,
  Button,
  Popconfirm, Typography,
  Form,
  Table,
  Input,
  Select, Spin, Divider, Checkbox,
} from "antd";
import {CheckOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {
  CREATE_ACCOUNT,
  GET_ACCOUNT,
  UPDATE_ACCOUNT
} from "../../constants/ActionTypes";
import {dateTimeFromString, getEmpty, renderRoleName, renderUserStt, toInt} from "../../util/Helper";
import UserHaravanComponent from "./modal/UserHaravanComponent";
import AssignOpenAccount from "./modal/AssignOpenAccount";
import {USER_ACTIVE, USER_DEACTIVE, USER_ROLES} from "../../constants/constant";

const Account = () => {
  const [form] = Form.useForm();
  const [activeUser, setActiveUser] = useState(null);
  const [changePass, setChangePass] = useState(false);
  const [modalVisible, setVisible] = useState(null);
  const {acList, acLoading, error, loader, acPaginate} = useSelector(({account}) => account);
  const [state, setState] = useState({
    modalVisible: false,
    syncModal: false,
    modalTitle: '',
    changePass: false,
  });
  const dispatch = useDispatch();
  const onClose = () => {
    setState({
      ...state,
      modalVisible: false,
      modalTitle: '',
      syncModal: false
    });
    setChangePass(false);
    setVisible(false);
    setActiveUser(null);
    form.resetFields();
  };

  const onAdd = () => {
    setState({
      ...state,
      modalTitle: 'Thêm tài khoản mới',
      modalVisible: true
    })
  };

  const onUpdate = (current) => {
    setState({
      ...state,
      modalTitle: 'Chỉnh sửa tài khoản',
      modalVisible: true,
    });
    setActiveUser(current);
    form.setFieldsValue({
      ...current,
      password: null
    });
  };

  const onChangeStt = account => {
    if (account.open_id && (!account.role || !account.password)) {
      setActiveUser(account);
      setVisible(true);
    } else {
      dispatch({
        type: UPDATE_ACCOUNT,
        payload: {
          account: {
            ...account,
            status: toInt(account.status) === 1 ? USER_DEACTIVE : USER_ACTIVE
          }
        }
      });
    }
  };

  const onSubmitForm = account => {
    let type = CREATE_ACCOUNT;
    if (account.id !== undefined) {
      type = UPDATE_ACCOUNT;
    }
    dispatch({
      type: type,
      payload: {
        account
      }
    });
    if (!error) {
      onClose();
    }
  };

  const getAccount = (params = {}) => {
    dispatch({
      type: GET_ACCOUNT,
      payload: {
        page: 1,
        orderBy: 'id DESC',
        ...params
      }
    });
  };

  const hasChangePassword = value => {
    setChangePass(value.target.checked);
  };

  useEffect(() => {
    getAccount();
  }, []);

  const hasUpdate = (isOpen = false) => {
    if (activeUser) {
      if (isOpen) {
        return !!activeUser.open_id;
      }
      return true;
    }
    return false;
  };

  return (
    <Card
      title={`Danh sách tài khoản`} extra={
      <Space>
        <Button size={`small`} type={`dashed`} onClick={() => setState({...state, syncModal: true})}>Haravan
          Sync</Button>
        <Button size={'small'} onClick={onAdd}>Thêm tài khoản</Button>
      </Space>
    }>

      <Spin spinning={loader}>
        <Table
          dataSource={acList}
          pagination={acPaginate}
          onChange={({page, per_page}) => getAccount({page, per_page})}
          columns={
            [
              {
                title: 'Họ Tên', dataIndex: 'name', key: 'name', render: (name, raw) => {
                  return (
                    <Space size={1} direction={`vertical`}>
                      <span>{name}</span>
                      <small>alias: {getEmpty(raw.alias)}</small>
                      <small>Nguồn: {getEmpty(raw.src_platform)}</small>
                    </Space>
                  )
                }
              },
              {
                title: 'Email', dataIndex: 'email', key: 'email',
                render: mail => <a href={`mailto:${mail}`}>{mail}</a>
              },
              {title: 'Quyền', dataIndex: 'role', key: 'role', render: role => renderRoleName(role)},
              {
                title: 'Tình trạng', dataIndex: 'status', key: 'status', render: stt => {
                  return renderUserStt(stt);
                }
              },
              {title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', render: time => dateTimeFromString(time)},
              {
                title: '', key: 'action', render: raw => {
                  const isActive = raw.status === USER_ACTIVE;
                  return (
                    <Space>
                      {isActive && <Button size={`small`} primary onClick={() => onUpdate(raw)}>
                        <EditOutlined/>
                      </Button>}

                      <Popconfirm
                        title={`Khóa tài khoản này?`}
                        onConfirm={() => onChangeStt(raw)}
                      >
                        <Button size={`small`} type={`dashed`}>
                          {isActive ? <DeleteOutlined style={{color: 'red'}}/> :
                            <CheckOutlined style={{color: 'green'}}/>} <Typography.Text>
                          {!isActive ? 'kích hoạt' : 'hủy'}
                        </Typography.Text>
                        </Button>
                      </Popconfirm>
                    </Space>
                  )
                }
              }
            ]
          }
        />
      </Spin>
      <Modal
        footer={<Space>
          <small className={`text-note danger`}>* Thông tin bắt buộc</small>
          <Button type={'primary'} htmlType={`submit`} form={`accountForm`}>Lưu</Button>
          <Button onClick={onClose}>Đóng</Button>
        </Space>}
        visible={state.modalVisible}
        onCancel={onClose}
        title={state.modalTitle}>
        <Spin spinning={loader}>
          <Form onFinish={onSubmitForm}
                id={`accountForm`} form={form} {...{
            labelCol: {
              xs: {span: 24},
              sm: {span: 8},
            },
            wrapperCol: {
              xs: {span: 24},
              sm: {span: 18},
            },
            labelAlign: 'left',
          }} >
            <Form.Item hidden name={`id`}><Input/></Form.Item>
            <Form.Item

              label={`Họ và tên`}
              name={`name`}
              rules={[{required: true, message: "Tên bắt buộc!"}]}

            >
              <Input disabled={hasUpdate(true)} placeholder={`Nhập`}/>
            </Form.Item>

            <Form.Item
              label={`Email`}
              name={`email`}
              rules={[{type: 'email', message: 'Email không đúng định dạng!'}, {
                required: true,
                message: "Email bắt buộc!"
              }]}
            >
              <Input disabled={hasUpdate(true)} placeholder={`Nhập`}/>
            </Form.Item>
            <Form.Item
              label={`Quyền`}
              name={`role`}
            >
              <Select disabled={hasUpdate(true)} placeholder={`Chọn`}>
                {USER_ROLES && USER_ROLES.map((role, key) => {
                  return (
                    <Select.Option key={key} value={role.key}>{role.title}</Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              label={`Định danh`}
              name={`alias`}
            >
              <Input placeholder={`Định danh tài khoản`}/>
            </Form.Item>
            <Form.Item
              label={`Trạng thái`}
              name={`status`}
              initialValue={`active`}
              rules={[{required: true, message: "Trạng thái bắt buộc!"}]}
            >
              <Select placeholder={`Trạng thái`}>
                <Select.Option value={USER_ACTIVE}>Kích hoạt</Select.Option>
                <Select.Option value={USER_DEACTIVE}>Ngưng kích hoạt</Select.Option>
              </Select>
            </Form.Item>

            {activeUser !== null ?
              <>
                <>
                  <Divider/>
                  <Checkbox checked={changePass} onChange={hasChangePassword}>Đổi mật khẩu</Checkbox>
                  {changePass &&
                  <>
                    <Form.Item
                      label={`Mật khẩu mới`}
                      name={`password`}
                      rules={[{required: true, message: "Mật khẩu bắt buộc"}]}

                    >
                      <Input type="password" placeholder={`Mật khẩu mới`}/>
                    </Form.Item>
                    <Form.Item
                      label={`Nhập lại mật khẩu`}
                      name={`password_confirmation`}
                      rules={[{required: true, message: "Mật khẩu bắt buộc"}]}

                    >
                      <Input type="password" placeholder={`Nhập lại mật khẩu mới`}/>
                    </Form.Item>
                  </>}
                </>
              </>
              : <Form.Item
                label={`Mật khẩu`}
                name={`password`}
                rules={[{required: true, message: "Mật khẩu bắt buộc"}]}
              >
                <Input type="password" placeholder={`Mật khẩu`}/>
              </Form.Item>}
          </Form>
        </Spin>
      </Modal>

      <Modal
        width={800}
        footer={<Space>
          <small className={`text-note danger`}>* Thông tin bắt buộc</small>
          <Button onClick={() => {
            getAccount();
            onClose();
          }
          }>Đóng</Button>
        </Space>}
        visible={state.syncModal}
        onCancel={onClose}
        title={`Sync Haravan User`}>
        <UserHaravanComponent getAccount={getAccount} onClose={onClose}/>
      </Modal>
      {activeUser &&
      (<AssignOpenAccount
        onClose={onClose}
        modalVisible={modalVisible}
        setVisible={setVisible}
        account={activeUser}
        acLoading={acLoading}/>)}

    </Card>
  )
};
export default Account;

import React, {useEffect, useState} from 'react'
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Button,
  Table,
  Popconfirm,
  Spin,
  message,
  Tooltip,
  Space
} from 'antd'
import {
  CheckOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import {
  formWrap,
  GATE_WAYCODE, ORDER_STATUS_CLOSED, ORDER_STATUS_UNCLOSED,
  ORDER_TRANS_TYPE, ORDER_TRANS_TYPE_PAID,
  PAYMENT_STATUS,
  PAYMENT_STATUS_PENDING
} from "../../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {
  CHANGE_STATUS_ORDER_TRANSACTION_SUCCESS,
  CREATE_ORDER_TRANSACTION_SUCCESS,
  GET_ORDER_TRANSACTION_LIST
} from "../../../constants/ActionTypes";
import {reqCreateOT, reqOtChangeStatus} from "../../../appRedux/services/order";
import {renderGateway, renderNumberFormat, renderPaymentStatus} from "../../../util/Helper";
import moment from "moment";


const TabPayment = () => {
  const dispatch = useDispatch();

  const {ots, otPagination, isListLoading, order} = useSelector(({order}) => order);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalFormat, setTotalFormat] = useState('');
  const [formErrors, setFormErrors] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const showModal = () => {
    setVisible(true)
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleSave = async () => {
    setLoading(true);
    setFormErrors([]);
    const values = form.getFieldsValue();
    try {
      const res = await reqCreateOT({
        order_id: order.id,
        order_platform_id: order.platform_order_id,
        ...values
      });
      dispatch({
        type: CREATE_ORDER_TRANSACTION_SUCCESS,
        payload: res.data
      });
      setVisible(false);
    } catch (e) {
      setFormErrors(e.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async (otId, status) => {
    setStatusLoading(true);
    try {
      const res = await reqOtChangeStatus(otId, status);
      dispatch({
        type: CHANGE_STATUS_ORDER_TRANSACTION_SUCCESS,
        payload: res.data
      });

    } catch (e) {
      message.warn(e.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const onChangeTotal = (value) => {
    setTotalFormat(renderNumberFormat(value, '', 'VND'));
  };

  useEffect(() => {
    getPayments();
    setTotalFormat(renderNumberFormat(order.total_price, '', 'VND'));
  }, []);

  const getPayments = (page = 1,) => {
    dispatch({
      type: GET_ORDER_TRANSACTION_LIST,
      payload: {
        page,
        order_id: order.id
      }
    });
  };

  const renderAddModal = () => {
    return (<Modal
      title={`Thêm thông tin thanh toán`}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSave}
      confirmLoading={loading}
      footer={[
        <small className={`text-note danger`}>* Thông tin bắt buộc</small>,
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        id='order-payment-form'
        form={form} {...formWrap}
        initialValues={
          {
            trans_type: ORDER_TRANS_TYPE_PAID,
            status: PAYMENT_STATUS_PENDING,
            total: order.total_price,
            paid_date: moment()
          }
        }
      >
        <Form.Item label={`Loại`} name={`trans_type`}>
          <Select>
            {ORDER_TRANS_TYPE.map(value => {
              return <Select.Option value={value.code}>
                {value.name}
              </Select.Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item label={`Trạng thái`} name={`status`}>
          <Select>
            {PAYMENT_STATUS.map(item => {
              return <Select.Option value={item.code}>
                {item.name}
              </Select.Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item label={`Ngày thanh toán`} name={`paid_date`}>
          <DatePicker placeholder={`Ngày`} showTime style={{width: '100%'}} />
        </Form.Item>
        <Form.Item label={`Số tiền`} name={`total`} className='gx-mb-0'>
          <InputNumber type={'number'} style={{width: '100%'}} onChange={onChangeTotal} />
        </Form.Item>
        <Form.Item label={false}>
          <small className="text-muted">{totalFormat}</small>
        </Form.Item>
        <Form.Item label={`Cổng thanh toán`} name='gateway_code'>
          <Select>
            {GATE_WAYCODE.map(value => {
              return <Select.Option value={value.code}>
                {value.name}
              </Select.Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item label={`Ghi chú`} name={`note`}>
          <Input.TextArea style={{width: '100%'}} />
        </Form.Item>
      </Form>
      <ul className='gx-text-danger'>
        {Object.keys(formErrors).map((value, idx) => {
          return <li key={idx}>{formErrors[value][0]}</li>;
        })}
      </ul>
    </Modal>)
  };

  return (
    <div>
      <Spin spinning={isListLoading}>
        <Table
          dataSource={ots}
          pagination={otPagination}
          columns={
            [
              {
                title: "Mã số",
                key: "id",
                dataIndex: 'id'
              },
              {
                title: "Cổng thanh toán",
                key: "gateway_code",
                dataIndex: 'gateway_code',
                render: (value) => {
                  return renderGateway(value);
                }
              },
              {
                title: "Trạng thái",
                key: "status",
                dataIndex: 'status',
                render: (value) => {
                  return renderPaymentStatus(value);
                }
              },
              {
                title: "Ngày thanh toán",
                key: "paid_date",
                dataIndex: 'paid_date'
              },
              {
                title: "Số tiền",
                key: "total",
                dataIndex: 'total',
                render: (value) => renderNumberFormat(value, "", 'VND')
              },
              {
                title: "",
                key: 'actions',
                render: (text, row) => {
                  return <Space size="small">
                    {row.status === 'ip' &&
                    <Popconfirm title={"Xác nhận đã nhận được thanh toán này?"}
                                onConfirm={() => handleSaveStatus(row.id, 'success')}
                                icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
                      <Button disabled={statusLoading || order.closed_status === ORDER_STATUS_CLOSED}
                              icon={<CheckOutlined />}
                              title="Hoàn thành" />
                    </Popconfirm>}
                    {row.status !== 'cancel' &&
                    <Popconfirm title={"Bạn có muốn hủy hóa đơn này không?"}
                                onConfirm={() => handleSaveStatus(row.id, 'cancel')}
                                icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
                      <Button disabled={statusLoading || order.closed_status === ORDER_STATUS_CLOSED}
                              icon={<DeleteOutlined />} title={'Hủy'} />
                    </Popconfirm>}
                    {row.note && <Tooltip title={row.note}><InfoCircleOutlined /></Tooltip>}
                  </Space>
                }
              }
            ]
          }
        >
        </Table>
      </Spin>
      {renderAddModal()}
      <Space className='gx-mt-2'>
        {/*<Popconfirm title={"Xác nhận đơn hàng đã thanh toán đủ?"}>*/}
        {/*  <Button type="primary">*/}
        {/*    <CheckOutlined /> Xác nhận Thanh toán*/}
        {/*  </Button>*/}
        {/*</Popconfirm>*/}
        {order.closed_status === ORDER_STATUS_UNCLOSED && <Button type="default" onClick={showModal}>
          <PlusOutlined /> Thêm thanh toán
        </Button>}
      </Space>
    </div>
  )
};
export default TabPayment;

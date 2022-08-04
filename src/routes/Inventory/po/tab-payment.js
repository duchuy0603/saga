import React, {useEffect, useState} from "react";
import {
  Table,
  Modal,
  Select,
  Form,
  Button,
  DatePicker,
  message,
  Input,
  InputNumber,
  Spin,
  Space,
  Popconfirm, Tooltip
} from "antd";
import {
  DeleteOutlined,
  QuestionCircleOutlined,
  CheckOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import {
  formWrap, GATE_WAYCODE, ORDER_TRANS_TYPE_PAID,
  PAYMENT_STATUS,
  PAYMENT_STATUS_PENDING,
} from "../../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {
  CHANGE_STATUS_ORDER_TRANSACTION_SUCCESS,
  CREATE_ORDER_TRANSACTION_SUCCESS,
  GET_ORDER_TRANSACTION_LIST,
} from "../../../constants/ActionTypes";
import {renderGateway, renderNumberFormat, renderPaymentStatus} from "../../../util/Helper";
import {reqCreateOT, reqOtChangeStatus} from "../../../appRedux/services/order";

const TabPoPayment = ({...props}) => {
  const {po} = props;
  const {ots, otPagination, isListLoading, order} = useSelector(({order}) => order);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [totalFormat, setTotalFormat] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [state, setState] = useState({
    modalVisible: false,
    isCreatePayment: false
  });
  const addPayment = () => {
    setState({
      modalVisible: true
    })
  }
  const onChangeTotal = (value) => {
    setTotalFormat(renderNumberFormat(value, '', '₫'));
  };
  const submitPayment = async (data) => {
    setState({
      ...state,
      isCreatePayment: true
    })
    try {
      const res = await reqCreateOT({
        order_id: po.order_id,
        po_id: po.id,
        ...data
      });
      dispatch({
        type: CREATE_ORDER_TRANSACTION_SUCCESS,
        payload: res.data
      });
      form.resetFields();
      message.info('Tạo phiếu thanh toán thành công!');
    } catch (e) {
      message.error(e.message);
    } finally {
      setState({
        modalVisible: false,
        isCreatePayment: false
      });
    }
  }
  useEffect(() => {
    dispatch({
      type: GET_ORDER_TRANSACTION_LIST,
      payload: {
        page: -1,
        po_id: po.id,
        order_id: po.order_id
      }
    });
  }, []);

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
  return (
    <div>
      <Spin spinning={isListLoading}>
        <Table
          dataSource={ots}
          columns={[
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
              render: (value) => renderNumberFormat(value, "", '₫')
            },
            {
              title: '', render: row => {
                return <Space size="small">
                  {row.status === 'ip' &&
                  <Popconfirm title={"Xác nhận đã nhận được thanh toán này?"}
                              onConfirm={() => handleSaveStatus(row.id, 'success')}
                              icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
                    <Button disabled={statusLoading}
                            icon={<CheckOutlined />}
                            title="Hoàn thành" />
                  </Popconfirm>}
                  {row.status !== 'cancel' &&
                  <Popconfirm title={"Bạn có muốn hủy hóa đơn này không?"}
                              onConfirm={() => handleSaveStatus(row.id, 'cancel')}
                              icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
                    <Button disabled={statusLoading}
                            icon={<DeleteOutlined />} title={'Hủy'} />
                  </Popconfirm>}
                  {row.note && <Tooltip title={row.note}><InfoCircleOutlined /></Tooltip>}
                </Space>
              }
            }
          ]}
          footer={() => <Button onClick={addPayment}>Thêm thanh toán</Button>}
        />
      </Spin>


      <Modal
        footer={[
          <small className={`text-note danger`}>* Thông tin bắt buộc</small>,
          <Button onClick={() => setState({modalVisible: false})}>Hủy</Button>,
          <Button loading={state.isCreatePayment} type={`primary`} htmlType={`submit`} form={`payment`}>Lưu</Button>,
        ]}
        onCancel={() => setState({modalVisible: false})}
        visible={state.modalVisible}
        title={`Thêm phiếu thanh toán`}
      >
        <Form onFinish={submitPayment} id={`payment`} form={form} {...formWrap}>
          <Form.Item
            hidden
            initialValue={ORDER_TRANS_TYPE_PAID}
            name={`trans_type`}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            initialValue={PAYMENT_STATUS_PENDING}
            label={`Trạng thái`}
            name={`status`}
          >
            <Select>
              {PAYMENT_STATUS.map(stt => <Select.Option value={stt.code}>{stt.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item rules={[{required: true, message: 'Điền ngày thanh toán'}]} label={`Ngày thanh toán`}
                     name={`paid_date`}>
            <DatePicker placeholder={`Ngày`} showTime style={{width: '100%'}}/>
          </Form.Item>
          <Form.Item
            initialValue={0}
            rules={[{required: true, message: 'Nhập số tiền thanh toán'}]}
            label={`Số tiền`}
            name={`total`}
          >
            <Space direction={"vertical"} size={'small'} style={{width: '100%'}}>
              <InputNumber style={{width: '100%'}} onChange={onChangeTotal}/>
              <small className="text-muted">{totalFormat}</small>
            </Space>

          </Form.Item>
          <Form.Item initialValue={'cod'} label={`Cổng thanh toán`} name='gateway_code'>
            <Select>
              {GATE_WAYCODE.map(value => {
                return <Select.Option value={value.code}>
                  {value.name}
                </Select.Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name={`note`}
            label={`Ghi chú`}>
            <Input.TextArea rows={3}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default TabPoPayment;

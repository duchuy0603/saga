import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  DatePicker,
  Input,
  Menu,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tooltip, Modal, Form
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
  GET_ORDER_TRANSACTION_LIST,
  OT_COD_CONFIRM,
  OT_DEPOSIT_CONFIRM, OT_SET_CANCEL,
  OT_SET_COMPLETE, OT_SET_NOTE
} from "../../constants/ActionTypes";
import {
  dateTimeFromString,
  renderNumberFormat, renderOTType,
  renderPaymentStatus
} from "../../util/Helper";
import {Link} from "react-router-dom";
import {
  PAYMENT_STATUS_CANCEL, PAYMENT_STATUS_SUCCESS
} from "../../constants/constant";
import {CloseOutlined} from "@ant-design/icons";
import FilterReconcile from "./filter/filter-reconcile";

const Reconciliation = (props) => {
  const dispatch = useDispatch();
  const [noteValue, setNoteValue] = useState('');
  const [form] = Form.useForm();
  const [modalNote, setModalNote] = useState({
    current: null,
    visible: false
  });
  const {ots, isListLoading, actionLoading, otPagination} = useSelector(({order}) => order);
  const getList = (params = {}) => {
    const fValues = form.getFieldsValue();
    dispatch({
      type: GET_ORDER_TRANSACTION_LIST,
      payload: {
        statusBy: 'asc',
        ...params,
        ...fValues
      }
    })
  };
  useEffect(() => {
    getList({page: 1});
  }, []);

  const renderBtns = (raw) => {
    if (raw.status === PAYMENT_STATUS_CANCEL) {
      return "";
    }

    if (raw.status === PAYMENT_STATUS_SUCCESS) {
      return <Popconfirm onConfirm={() => onCancel(raw.id)} title={`Xác nhận hủy đối soát`}>
        <Button size={"small"} danger type={"dashed"} icon={<CloseOutlined/>}>
          Hủy
        </Button>
      </Popconfirm>
    }

    return (
      <Popconfirm
        onConfirm={() => doComplete(raw.id)}
        title={'Xác nhận hoàn thành đối soát'}>
        <Dropdown.Button
          size={`small`}
          overlay={() => (<Menu>
            <Popconfirm onConfirm={() => onCancel(raw.id)} title={`Xác nhận hủy đối soát`}>
              <Menu.Item key="3">
                Hủy
              </Menu.Item>
            </Popconfirm>
          </Menu>)}>
          Hoàn thành
        </Dropdown.Button>
      </Popconfirm>
    )
  };

  const onCancel = (id) => {
    dispatch({
      type: OT_SET_CANCEL,
      payload: {id}
    });
  };
  const onCodConfirm = (id) => {
    dispatch({
      type: OT_COD_CONFIRM,
      payload: {id}
    });
  };
  const onDepositConfirm = (id) => {
    dispatch({
      type: OT_DEPOSIT_CONFIRM,
      payload: {id}
    });
  };
  const doComplete = (id) => {
    dispatch({
      type: OT_SET_COMPLETE,
      payload: {id}
    });
  };

  const setNote = (raw) => {
    setNoteValue(raw.note);
    setModalNote({
      current: raw.id,
      visible: true
    });
  };
  const onSaveNote = () => {
    dispatch({
      type: OT_SET_NOTE,
      payload: {
        id: modalNote.current,
        note: noteValue
      }
    });
    if (!actionLoading) {
      setNoteValue('');
      setModalNote({
        current: null,
        visible: false
      });
    }
  };
  return (
    <Card
      extra={<Space>
        <Button className="btn-active" size={"small"} type={"dashed"}>
          <Link to={`/reconcile`}>Lọc theo danh sách</Link>
        </Button>
        <Button size={"small"} type={"dashed"}>
          <Link to={`/reconcile-by-order`}>Lọc theo order</Link>
        </Button>
      </Space>}
      title={`Đối soát`}>
      <FilterReconcile form={form} onFinishForm={getList}/>
      <Spin spinning={actionLoading || isListLoading}>
        <Table
          ellipse
          rowKey={"id"}
          onChange={({current, pageSize}) => getList({page: current})}
          pagination={otPagination}
          dataSource={ots}
          summary={(data) => (
            <Table.Summary style={{backgroundColor: '#ccc'}} fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={8} index={0}><b>Tổng: {otPagination.total}</b></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
          columns={[
            {
              title: 'Order ID', dataIndex: 'created_at', key: 'created_at',
              render: (time, raw) => {
                return (<Space direction={`vertical`} size={1}>
                  <Link to={`/order/${raw.order_id}`}>#{raw.order_id}</Link>
                  <Tooltip placement={'bottom'} title={`Source | Platform order ID`}>
                    <small className={`text-mute`}> {raw.source ? raw.source : '---'} -
                      #{raw.order_platform_id}</small>
                  </Tooltip>
                  <small className={`text-mute`}>{dateTimeFromString(time)}</small>
                </Space>)
              }
            },
            {
              title: 'Loại', dataIndex: 'trans_type', key: 'trans_type',
              render: (value) => renderOTType(value)
            },
            {
              title: 'Trạng thái', dataIndex: 'status', key: 'status',
              render: (status) => renderPaymentStatus(status)
            },
            {
              title: 'Cổng', dataIndex: 'gateway', key: 'gateway',
              render: (value) => <small>{value}</small>
            },
            {
              title: 'Đối soát',
              dataIndex: 'deposit',
              key: 'deposit',
              render: (deposit, raw) => {
                return renderNumberFormat(deposit, '', 'đ');
              }
            },
            {
              title: 'Tổng hóa đơn',
              dataIndex: 'total',
              key: 'total',
              render: (value, raw) => {
                return renderNumberFormat(value, '', 'đ');
              }
            },
            {
              title: 'Ghi chú',
              dataIndex: 'note',
              key: 'note',
              render: (note, raw) => (
                <Tooltip title={note}>
                  <Button onClick={() => setNote(raw)} size={`small`}
                          type={`dashed`}>Ghi chú</Button>
                </Tooltip>
              )
            },
            {title: '', key: 'action', render: raw => renderBtns(raw)}
          ]}
        />
      </Spin>
      <Modal
        visible={modalNote.visible}
        onCancel={() => {
          setNoteValue('');
          setModalNote({...modalNote, current: null, visible: false})
        }}
        footer={<Space>
          <small className={`text-note danger`}>* thông tin bắt buộc</small>
          <Button onClick={() => {
            setNoteValue('');
            setModalNote({...modalNote, current: null, visible: false})
          }}>Đóng</Button>
          <Button loading={actionLoading} type={`primary`} onClick={onSaveNote}>Lưu</Button>
        </Space>}
        title={`Ghi chú đối soát`}>
        <Input.TextArea
          value={noteValue}
          rows={4}
          placeholder={`Ghi chú`}
          onChange={e => setNoteValue(e.target.value)}/>
      </Modal>
    </Card>
  )
};
export default Reconciliation;

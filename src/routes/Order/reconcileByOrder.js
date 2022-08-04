import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip, Modal, Form
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
  GET_OT_LIST_BY_ORDER,
  OT_SET_CANCEL,
  OT_SET_COMPLETE, OT_SET_NOTE
} from "../../constants/ActionTypes";
import {
  countChildren,
  countTotal,
  dateTimeFromString, getEmpty,
  renderNumberFormat, renderOTType,
  renderPaymentStatus
} from "../../util/Helper";
import {Link} from "react-router-dom";
import {
  PAYMENT_STATUS_CANCEL, PAYMENT_STATUS_SUCCESS
} from "../../constants/constant";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import FilterByOrder from "./filter/filter-by-order";

const ReconcileByOrder = (props) => {
  const dispatch = useDispatch();
  const [otRelated, setOTRelated] = useState([]);
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
      type: GET_OT_LIST_BY_ORDER,
      payload: {
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

  const onCancel = async (id) => {
    dispatch({
      type: OT_SET_CANCEL,
      payload: {id}
    });
  };

  const doComplete = async (id) => {
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
      getList();
    }
  };

  const expandRowRender = (row) => {
    const {order_trans} = row;
    return (<Table
      size={'small'}
      pagination={false}
      dataSource={order_trans}
      columns={[
        {title: 'Loại', dataIndex: 'trans_type', key: 'trans_type', render: (value) => renderOTType(value)},
        {title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => renderPaymentStatus(status)},
        {title: 'Đối soát', dataIndex: 'deposit', key: 'deposit', render: deposit => renderNumberFormat(deposit)},
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
        {
          title: 'Actions', key: 'action', render: raw => {

            return (
              <Space>
                {raw.status !== PAYMENT_STATUS_SUCCESS &&
                <Popconfirm onConfirm={() => doComplete(raw.id)} title={`Xác nhận hủy đối soát`}>
                  <Button size={"small"} type={"dashed"} icon={<CheckOutlined/>}>
                    Hoàn thành
                  </Button>
                </Popconfirm>}
                {raw.status !== PAYMENT_STATUS_CANCEL &&
                <Popconfirm onConfirm={() => onCancel(raw.id)} title={`Xác nhận hủy đối soát`}>
                  <Button size={"small"} danger type={"dashed"} icon={<CloseOutlined/>}>
                    Hủy
                  </Button>
                </Popconfirm>}

              </Space>
            )
          }
        },
      ]}
    />)
  }
  return (
    <Card
      extra={<Space>
        <Button size={"small"} type={"dashed"}>
          <Link to={`/reconcile`}>Lọc theo danh sách</Link>
        </Button>
        <Button className="btn-active" size={"small"} type={'dashed'}>
          <Link to={`/reconcile-by-order`}>Lọc theo order</Link>
        </Button>
      </Space>}
      title={`Đối soát theo order`}>
      <FilterByOrder form={form} onFinish={getList}/>
      <Spin spinning={actionLoading || isListLoading}>
        <Table
          className={'components-table-demo-nested'}
          ellipse
          rowKey={"id"}
          onChange={({current, pageSize}) => getList({page: current})}
          pagination={otPagination}
          dataSource={ots}
          summary={(data) => (
            <Table.Summary style={{backgroundColor: '#ccc'}} fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={8} index={0}><b>Tổng: {otPagination.total} | Đối
                  soát: {countChildren(ots, 'order_trans', 'total')} | Đơn
                  hàng: {countTotal(ots, 'total_price')}</b></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
          expandable={{
            expandedRowRender: row => expandRowRender(row)
          }}
          columns={[
            {
              title: 'Order ID', dataIndex: 'id', key: 'id',
              render: (id, raw) => {
                return (<Space direction={`vertical`} size={1}>
                  <Link to={`/order/${raw.id}`}>#{raw.id}</Link>
                  <Tooltip placement={'bottom'} title={`Source | Platform order ID`}>
                    <small className={`text-mute`}> {getEmpty(raw.platform)} -
                      #{raw.platform_order_id}</small>
                  </Tooltip>
                  <small className={`text-mute`}>{dateTimeFromString(raw.created_at)}</small>
                </Space>)
              }
            },
            {
              title: 'Cổng', dataIndex: 'gateway', key: 'gateway',
              render: (value) => <small>{value}</small>
            },
            {
              title: 'Tổng tiền',
              dataIndex: 'total_price',
              key: 'total_price',
              render: (value, raw) => {
                return renderNumberFormat(value, '', 'đ');
              }
            },
            {
              title: 'ID user tạo',
              dataIndex: 'confirm_user',
              key: 'confirm_user'
            },
            {
              title: 'Nguồn',
              dataIndex: 'platform_src',
              key: 'platform_src'
            },
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
export default ReconcileByOrder;

import React, {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Space, Spin, Table, Tag, Tooltip} from "antd";
import {InfoCircleOutlined, SyncOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {GET_ORDER_LIST} from "../../constants/ActionTypes";
import {
  dateTimeFromString,
  getEmpty,
  renderNumberFormat,
  renderOrderChannelSrc,
  renderOrderFulfillmentStatus,
  renderOrderPaidStatus,
  renderOrderStatus,
  renderTag
} from "../../util/Helper";
import {Link} from "react-router-dom";
import HaravanOrderSync from "./sync/haravan-order-sync";
import OrderFilter from "./OrderFilter";
import PancakeOrderSync from "./sync/pancake-order-sync";

const Order = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {orders, pagination, isListLoading} = useSelector(({order}) => order);
  const [isSyncVisible, setSyncVisible] = useState(false);
  const [isPancakeSyncVisible, setPancakeSyncVisible] = useState(false);

  const getOrders = (params = {}) => {
    const filters = form.getFieldsValue();
    dispatch({
      type: GET_ORDER_LIST,
      payload: {
        ...params,
        ...filters
      }
    });
  };

  useEffect(() => {
    getOrders();
  }, []);

  const searchOrder = () => {
    getOrders();
  };

  return (
    <Spin spinning={isListLoading}>
      <Space>
        <Button type={'dashed'}
                size={"small"}
                icon={<SyncOutlined />}
                title={`Đồng bộ Đơn từ Haravan`}
                onClick={() => setSyncVisible(true)}
        >
          Haravan
        </Button>
        <Button type={'dashed'}
                size={"small"}
                icon={<SyncOutlined />}
                title={`Đồng bộ Đơn từ Pancake`}
                onClick={() => setPancakeSyncVisible(true)}
        >
          Pancake
        </Button>
      </Space>
      <Card title={`Danh sách đơn hàng`}>

        <OrderFilter
          form={form}
          onFinishForm={searchOrder}
        />

        <Table
          size={'small'}
          rowKey={`id`}
          onChange={({current}) => getOrders({page: current})}
          dataSource={orders}
          pagination={pagination}
          summary={(data) => (
            <Table.Summary style={{backgroundColor: '#ccc'}} fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={9} index={0}><b>Tổng: {pagination.total}</b></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
          columns={[
            {
              title: 'ID', key: 'id', dataIndex: 'id',
              render: (id, row) => {
                return (
                  <>
                    <div>
                      <Link className={`pl-1`} to={`/order/${id}`}>#{row.id}</Link>
                      {row.note && <Tooltip title={row.note}>
                        {` `}<InfoCircleOutlined />
                      </Tooltip>}
                    </div>
                    <small className="text-muted">{dateTimeFromString(row.updated_at)}</small>
                    <br />
                    <small className="text-muted">{row.platform} - {row.order_num}</small>
                  </>
                )
              }
            },
            {
              title: 'Khách hàng', dataIndex: 'customer_id', key: 'customer_id', render: (id, raw) => {
                if (!raw.customer) {
                  return getEmpty();
                }
                const {customer} = raw;
                const name = `${getEmpty(customer.first_name, '', '')} ${getEmpty(customer.last_name, '', '')}`;
                return (
                  <Space direction={`vertical`} size={1}>
                    <span>{name}</span>
                    <small><a href={`tel:${raw.customer.phone}`}>{raw.customer.phone}</a></small>
                  </Space>
                )
              }
            },
            {
              title: 'Tỉnh/Thành phố', dataIndex: 'customer_id', key: 'customer_id', render: (col, raw) => {
                const {shipping_address} = raw;
                if (!shipping_address) {
                  return 'Chưa xác định';
                }
                return (
                  <Space size={'small'} split={"|"} wrap>
                    <small>{shipping_address.shipping_district}</small>
                    <small>{shipping_address.shipping_province ?
                      shipping_address.shipping_province :
                      shipping_address.shipping_city
                    }
                    </small>
                  </Space>
                )
              }
            },
            {
              title: 'Trạng thái', dataIndex: 'status', key: 'status',
              render: (status, row) => {
                return renderOrderStatus(row, {fontSize: "11px"});
              }
            },
            {
              title: 'Thanh toán', dataIndex: 'statusPayed', key: 'statusPayed',
              render: (value, row) => {
                return renderOrderPaidStatus(row);
              }
            },
            {
              title: 'Vận chuyển', dataIndex: 'statusShipped', key: 'statusShipped',
              render: (value, row) => {
                return renderOrderFulfillmentStatus(row);
              }
            },
            {
              title: 'Tổng tiền', dataIndex: 'total_price', key: 'total_price',
              render: (value) => {
                return renderNumberFormat(value);
              }
            },
            {
              title: 'Kênh', dataIndex: 'platform_src', key: 'platform_src',
              render: (value, row) => {
                return <Space size={"small"} direction={"vertical"}>
                  <small>Kênh: {renderOrderChannelSrc(value)}</small>
                  <small>Brand: {getEmpty(row?.brand?.name)}</small>
                </Space>
              }
            },
            {
              title: 'Tag', dataIndex: 'tags', key: 'tags',
              render: (value, row) => {
                return renderTag(value, row);
              }
            }
          ]}
        />
      </Card>

      <Modal
        visible={isSyncVisible}
        onCancel={() => {
          setSyncVisible(false);
          getOrders();
        }}
        title={"Dánh sách đơn trên Haravan"}
        maskClosable={false}
        footer={null}
        width={920}
      >
        <HaravanOrderSync />
      </Modal>
      <Modal
        visible={isPancakeSyncVisible}
        onCancel={() => {
          setPancakeSyncVisible(false);
          getOrders();
        }}
        title={"Dánh sách đơn trên Pancake"}
        maskClosable={false}
        footer={null}
        width={920}
      >
        <PancakeOrderSync />
      </Modal>
    </Spin>
  )
};
export default Order;

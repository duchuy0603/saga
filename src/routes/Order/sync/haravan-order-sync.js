import React, {useEffect, useState} from "react";
import {Form, message, Spin, Table, DatePicker, Space, Button, Popconfirm} from "antd";
import {reqGetHrvOrders, reqSyncHrvOrder} from "../../../appRedux/services/HaranvanSync";
import moment from "moment";

import {
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
  SyncOutlined
} from "@ant-design/icons";
import {
  renderHrvOrderFFStatus,
  renderNumberFormat
} from "../../../util/Helper";
import {ORDER_STATUS_CLOSED, ORDER_STATUS_CONFIRM} from "../../../constants/constant";

const HaravanOrderSync = () => {

  useEffect(() => {
    searchForm.setFieldsValue({
      date: moment()
    });
    haravanSync(1);
  }, []);

  const [isLoadingHrvOrder, setHrvOrderLoading] = useState(false);
  const [hrvOrders, setHrvOrders] = useState([]);

  const [isSyncOrderLoading, setIsSyncOrderLoading] = useState(false);

  const [hrvOrdersPagination, setHrvOrdersPagination] = useState({
    next: false,
    prev: false,
    page: 1,
    limit: 20
  });
  const [searchForm] = Form.useForm();

  const haravanSync = async (page) => {
    try {
      const searchValues = searchForm.getFieldsValue();
      const formData = {
        ...searchValues,
        date: searchValues.date.format("YYYY-MM-DD")
      };
      setHrvOrderLoading(true);
      const params = {page, ...formData};
      const res = await reqGetHrvOrders(params);
      const syncLists = res.data;
      console.log(syncLists);
      let pagination = {
        next: true,
        prev: true,
        page: 1,
        limit: 20
      };

      if (parseInt(syncLists.page) <= 1) {
        pagination.prev = false;
      }
      if (parseInt(syncLists.limit) > syncLists.data.length) {
        pagination.next = false;
      }
      pagination.page = parseInt(syncLists.page);
      pagination.limit = parseInt(syncLists.limit);
      setHrvOrdersPagination(pagination);
      setHrvOrders(syncLists.data);
    } catch (e) {
      message.error(e.message);
    } finally {
      setHrvOrderLoading(false);
    }
  };

  const onPrev = () => {
    const page = hrvOrdersPagination.page - 1;
    haravanSync(page);
  };
  const onNext = () => {
    const page = hrvOrdersPagination.page + 1;
    haravanSync(page);
  };

  const syncOrder = async (id) => {
    try {
      setIsSyncOrderLoading(true);
      const res = await reqSyncHrvOrder({ids: id});
      console.log(res);
      res.data.map(item => {
        if (item.success) {
          message.success("Đã đồng bộ thành công đơn hàng #" + item.message);
        } else {
          message.error(item.message);
        }
      })
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsSyncOrderLoading(false);
    }
  };

  const renderSearchForm = () => {
    return <Form form={searchForm}>
      <Form.Item name={'date'} label={false}>
        <DatePicker onChange={() => haravanSync(1)}/>
      </Form.Item>
    </Form>
  };

  return <Spin spinning={isLoadingHrvOrder}>
    <Space direction={'vertical'}>
      {renderSearchForm()}
      <Table
        pagination={false}
        rowKey={"id"}
        dataSource={hrvOrders}
        columns={[
          {
            title: 'ID', dataIndex: 'id', key: 'hrv_id',
            render: (value, row) => {
              return <Space direction={"vertical"} size={"small"}>
                <span>{row.order_number}</span>
                <small className="text-mute">{row.email}</small>
                <small className="text-mute">{row.gateway}</small>
              </Space>;
            }
          },
          {
            title: 'Giá trị', dataIndex: 'total_price', key: 'hrv_total_price',
            render: (value, row) => {
              return renderNumberFormat(value, '', ' VND');
            }
          },
          {
            title: 'Thanh toán', dataIndex: 'financial_status', key: 'hrv_financial_status',
            render: (value, row) => {
              return <Space direction={"vertical"} size={"small"}>
                <span>{row.gateway} - <small>{row.gateway_code}</small></span>
                <span>{row.financial_status}</span>
              </Space>;
            }
          },
          {
            title: 'Vận chuyển', dataIndex: 'fulfillment_status', key: 'hrv_fulfillment_status',
            render: (value, row) => {
              return renderHrvOrderFFStatus(row);
            }
          },
          {
            title: 'Xác nhận', dataIndex: 'confirmed_status', key: 'hrv_confirmed_status',
            render: (value, row) => {
              return value === ORDER_STATUS_CONFIRM ? <CheckOutlined className="gx-text-success"/>
                : <CheckOutlined className="text-mute"/>;
            }
          },
          {
            title: 'Lưu trữ', dataIndex: 'closed_status', key: 'hrv_closed_status',
            render: (value, row) => {
              return value === ORDER_STATUS_CLOSED ? <CheckOutlined className="gx-text-success"/>
                : <CheckOutlined className="text-mute"/>;
            }
          },
          {
            title: '', dataIndex: 'id', key: 'hrv_actions',
            render: (value, row) => {
              return <Popconfirm
                title={`Đồng bộ về hệ thống?`}
                onConfirm={() => syncOrder(value)}
              >
                <Button
                  loading={isSyncOrderLoading}
                  size={'small'}
                  type={"dashed"}
                  danger
                  icon={<SyncOutlined/>}
                >
                  Đồng bộ
                </Button>
              </Popconfirm>
                ;
            }
          },
        ]}
      />
      <Space>
        <Button disabled={!hrvOrdersPagination.prev} icon={<LeftOutlined/>} onClick={() => onPrev()}/>
        <Button disabled={!hrvOrdersPagination.next} icon={<RightOutlined/>} onClick={() => onNext()}/>
      </Space>
    </Space>
  </Spin>;
};

export default HaravanOrderSync;

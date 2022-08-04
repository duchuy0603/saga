import React, {useEffect, useState} from "react";
import {Button, DatePicker, Form, message, Popconfirm, Space, Spin, Table, Tag} from "antd";
import moment from "moment";

import {LeftOutlined, RightOutlined, SyncOutlined} from "@ant-design/icons";
import {renderNumberFormat} from "../../../util/Helper";
import {reqPancakeGetOrders, reqPancakeSyncOrder} from "../../../appRedux/services/PancakeSync";

const PancakeOrderSync = () => {

  useEffect(() => {
    searchForm.setFieldsValue({
      date: moment()
    });
    getOrders(1);
  }, []);

  const [isLoadingHrvOrder, setHrvOrderLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const [isSyncOrderLoading, setIsSyncOrderLoading] = useState(false);

  const [ordersPagination, setOrdersPagination] = useState({
    next: false,
    prev: false,
    page: 1,
    limit: 20
  });
  const [searchForm] = Form.useForm();

  const getOrders = async (page) => {
    try {
      const searchValues = searchForm.getFieldsValue();
      const formData = {
        ...searchValues
      };
      setHrvOrderLoading(true);
      const params = {page_number: page, ...formData};
      const res = await reqPancakeGetOrders(params);
      const syncLists = res.data;
      console.log(syncLists);
      let pagination = {
        next: true,
        prev: true,
        page: syncLists.page_number,
        limit: syncLists.page_size
      };

      if (pagination.page <= 1) {
        pagination.prev = false;
      }
      if (pagination.page >= syncLists.total_pages) {
        pagination.next = false;
      }
      setOrdersPagination(pagination);
      setOrders(syncLists.data);
    } catch (e) {
      message.error(e.message);
    } finally {
      setHrvOrderLoading(false);
    }
  };

  const onPrev = () => {
    const page = ordersPagination.page - 1;
    getOrders(page);
  };
  const onNext = () => {
    const page = ordersPagination.page + 1;
    getOrders(page);
  };

  const syncOrder = async (order) => {
    try {
      setIsSyncOrderLoading(true);
      const res = await reqPancakeSyncOrder(order);
      console.log(res);
      // res.data.map(item => {
      //   if (item.success) {
      //     message.success("Đã đồng bộ thành công đơn hàng #" + item.message);
      //   } else {
      //     message.error(item.message);
      //   }
      // })
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsSyncOrderLoading(false);
    }
  };

  const renderSearchForm = () => {
    return <Form form={searchForm}>
      <Form.Item name={'date'} label={false}>
        <DatePicker onChange={() => getOrders(1)} />
      </Form.Item>
    </Form>
  };

  const renderStatus = (status) => {
    let color = "default";
    let statusLabel = "";
    switch (status) {
      case 0:
        color = "processing";
        statusLabel = "Mới";
        break;
      case 6:
        color = "red";
        statusLabel = "Đã hủy";
        break;
      case 3:
        color = "success";
        statusLabel = "Đã giao";
        break;
      default:
        statusLabel = status

    }
    return <Tag color={color}>{statusLabel}</Tag>
  };

  return <Spin spinning={isLoadingHrvOrder}>
    <Space direction={'vertical'}>
      {renderSearchForm()}
      <Table
        pagination={false}
        rowKey={"id"}
        dataSource={orders}
        columns={[
          {
            title: 'ID', dataIndex: 'id', key: 'hrv_id',
            render: (value, row) => {
              return <Space direction={"vertical"} size={"small"}>
                <span>{value}</span>
                <small className="text-mute">{row.bill_full_name}</small>
                <small className="text-mute">{row.bill_phone_number}</small>
              </Space>;
            }
          },
          {
            title: 'Giá trị', dataIndex: 'total_price_after_sub_discount', key: 'hrv_total_price',
            render: (value, row) => {
              return renderNumberFormat(
                value
                , ''
                , ' VND'
              );
            }
          },
          {
            title: 'COD', dataIndex: 'cod', key: 'order_cod',
            render: (value, row) => {
              return renderNumberFormat(
                value
                , ''
                , ' VND'
              );
            }
          },
          {
            title: 'Trạng thái', dataIndex: 'status', key: 'hrv_fulfillment_status',
            render: (value, row) => {
              return renderStatus(value);
            }
          },
          {
            title: 'Người tạo', dataIndex: 'creator', key: 'p_creator',
            render: (value, row) => {
              if (row.creator) {
                return `${row.creator.name}`;
              } else {
                return "Không xác định";
              }
            }
          },
          {
            title: '', dataIndex: 'id', key: 'hrv_actions',
            render: (value, row) => {
              return <Popconfirm
                title={`Đồng bộ về hệ thống?`}
                onConfirm={() => syncOrder(row)}
              >
                <Button
                  loading={isSyncOrderLoading}
                  size={'small'}
                  type={"dashed"}
                  danger
                  icon={<SyncOutlined />}
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
        <Button disabled={!ordersPagination.prev} icon={<LeftOutlined />} onClick={() => onPrev()} />
        <Button disabled={!ordersPagination.next} icon={<RightOutlined />} onClick={() => onNext()} />
      </Space>
    </Space>
  </Spin>;
};

export default PancakeOrderSync;

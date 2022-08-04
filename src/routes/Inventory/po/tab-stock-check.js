import React, {useEffect, useState} from "react";
import {message, Space, Spin, Table, Button, Popconfirm} from "antd";
import {reqCancelStockCheck, reqConfirmStockCheck, reqGetStockCheck} from "../../../appRedux/services/inventory";
import {
  dateTimeFromString,
  getPaginate,
  renderNumberFormat,
  renderStockCheckStt
} from "../../../util/Helper";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {STOCK_CHECK_STT_CANCEL, STOCK_CHECK_STT_CONFIRM, STOCK_CHECK_STT_DRAFT} from "../../../constants/constant";

const TabStockCheck = ({...props}) => {
  const {po} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [stockChecks, setStockChecks] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 20,
  });

  useEffect(() => {
    getStockCheck(1);
  }, [po]);

  const getStockCheck = async (page) => {
    try {
      setIsLoading(true);
      const res = await reqGetStockCheck({
        page,
        poId: po.id
      });
      console.log(res);
      setStockChecks(res.data.data);
      setPagination(getPaginate(res.data));
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setConfirm = async (id) => {
    try {
      setIsLoading(true);
      const res = await reqConfirmStockCheck(id);
      let items = [...stockChecks];
      console.log(items, res);
      const idx = items.findIndex(item => item.id = res.data.id);
      if (idx >= 0) {
        items[idx].status = STOCK_CHECK_STT_CONFIRM;
      }
      setStockChecks(items);
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setCancel = async (id) => {
    try {
      setIsLoading(true);
      const res = await reqCancelStockCheck(id);
      let items = [...stockChecks];
      console.log(items, res);
      const idx = items.findIndex(item => item.id = res.data.id);
      if (idx >= 0) {
        items[idx].status = STOCK_CHECK_STT_CANCEL;
      }
      setStockChecks(items);
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changePage = async (page) => {
    console.log(page);
    getStockCheck(page);
  };

  return (
    <Spin spinning={isLoading}>
      <Table
        pagination={pagination}
        onChange={changePage}
        dataSource={stockChecks}
        expandedRowRender={row => {
          return <Table

            dataSource={row.items}
            pagination={false}
            columns={[
              {
                title: 'Sản phẩm',
                dataIndex: 'product_name',
                key: 'st_c_product_id',
                render: (value, row) => {
                  return <Space split={"|"}>
                    <span>{value}</span>
                  </Space>;
                }
              },
              {
                title: 'Số lượng kiểm',
                dataIndex: 'quantity',
                key: 'st_c_quantity',
                render: (value) => {
                  return renderNumberFormat(value, '', '');
                }
              },
            ]}

          />
        }}
        columns={[
          {
            title: '#ID', dataIndex: 'id', key: 'st_id', render: (value, row) => {
              console.log(row.created_at);
              return <Space split={"|"}>
                <span>Phiếu kiểm #{value}</span>
                {dateTimeFromString(row.created_at)}
              </Space>;
            }
          },
          {title: 'Người kiểm', dataIndex: 'owner_id', key: 'st_owner_id'},
          {
            title: 'Trạng thái', dataIndex: 'status', key: 'st_status',
            render: (value, row) => {
              return renderStockCheckStt(value);
            }
          },
          {
            title: 'Ghi chú', dataIndex: 'note', key: 'st_note',
            render: (value) => {
              return value;
            }
          },
          {
            title: '', dataIndex: '', key: 'st_action',
            render: (value, row) => {
              return <Space>
                {row.status === STOCK_CHECK_STT_DRAFT
                && <Popconfirm title={"Xác nhận hoàn thành phiếu?"}
                               onConfirm={() => setConfirm(row.id)}
                >
                  <Button size={"small"} type={"dashed"}
                          title={"Hoàn thành"}
                          icon={<CheckOutlined />} />
                </Popconfirm>}
                {(row.status === STOCK_CHECK_STT_DRAFT || row.status === STOCK_CHECK_STT_CONFIRM)
                && <Popconfirm title={"Xác nhận hủy phiếu?"}
                               onConfirm={() => setCancel(row.id)}
                >
                  <Button size={"small"} type={"dashed"} icon={<CloseOutlined />} />
                </Popconfirm>}
              </Space>
            }
          },
        ]}
      />
    </Spin>
  )
};

export default TabStockCheck;

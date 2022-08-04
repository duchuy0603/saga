import React, {useEffect, useState} from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Select,
  Table,
  Form,
  Popconfirm,
  Space,
  Input,
  Skeleton,
  Modal,
  message,
  Spin, Image
} from "antd";
import {
  BarChartOutlined,
  CaretDownFilled,
  CheckOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  SyncOutlined
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {DELETE_WAREHOUSE, GET_WAREHOUSE, WAREHOUSE_SET_DEFAULT} from "../../constants/ActionTypes";
import WarehouseForm from "./WarehouseForm";
import {dateTime, defaultImage, renderWhStt} from "../../util/Helper";
import {
  reqHaravanSyncUpdateLocation, reqtSyncHaravanGetLocation
} from "../../appRedux/services/HaranvanSync";
import {Link} from "react-router-dom";
import {WH_TYPE_EXCHANGE, WH_TYPE_VALID} from "../../constants/constant";

const initialState = {
  showModal: false,
  haravanModal: false,
  syncLoadings: {},
  syncLists: [],
  modalTitle: ''
};
const Warehouse = () => {
  const [state, setState] = useState(initialState);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const {warehouses, pagination, isLoading} = useSelector(({warehouse}) => warehouse);

  const getWarehouses = (params = {}) => {
    dispatch({
      type: GET_WAREHOUSE,
      payload: {
        ...params,
        wh_type: 'main'
      }
    })
  };

  useEffect(() => {
    getWarehouses();
  }, []);

  const onDelete = warehouseId => {
    dispatch({
      type: DELETE_WAREHOUSE,
      payload: {
        warehouseId
      }
    })

  };

  const onSetDefault = warehouseId => {
    dispatch({
      type: WAREHOUSE_SET_DEFAULT,
      payload: {
        warehouseId
      }
    })

  };

  const addWarehouse = () => {
    setState({
      modalTitle: 'Thêm kho',
      showModal: true
    });
    form.resetFields();
  };
  const updateWarehouse = (warehouse) => {
    setState({
      modalTitle: 'Cập nhật kho',
      showModal: true
    });
    form.setFieldsValue(warehouse)
  };
  const hideModal = () => {
    setState(initialState);
  };
  const searchWarehouse = data => {
    getWarehouses(data);
  };

  const processSync = (key, isLoading = true) => {
    const syncLoadings = state.syncLoadings;
    syncLoadings[key] = isLoading;
    setState({
      ...state,
      syncLoadings
    })
  };

  const haravanSync = async () => {
    try {
      const res = await reqtSyncHaravanGetLocation();
      const syncLists = res.data,
        syncLoadings = {};
      syncLists.map(item => {
        syncLoadings[item.id] = false;
      })
      setState({
        haravanModal: true,
        syncLists,
        syncLoadings
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  const onSync = async (location) => {
    try {
      processSync(location.id);
      await reqHaravanSyncUpdateLocation(location);
      processSync(location.id, false);
      getWarehouses();
      message.success('Cập nhật thành công!');
    } catch (e) {
      message.error(e.message);
    }
  };

  const haravanSyncCancel = () => {
    setState({
      haravanModal: false
    })
  };

  const renderExpandedRow = row => {
    return <Table pagination={false} size={`small`} dataSource={row.extract_wh}
                  rowKey={`id`}
                  columns={[
                    {title: 'ID', key: 'id', dataIndex: 'id', render: id => `#${id}`},
                    {
                      title: 'Tên kho', dataIndex: 'name', key: 'name', render: (name, raw) => {
                        return (
                          <Space direction={`vertical`} size={1}>
                            <b>{name}</b>
                            <small>Nguồn: {raw.platform}</small>
                            <small>ID : {raw.platform_id}</small>
                          </Space>
                        )
                      }
                    },
                    {
                      title: 'Loại kho', dataIndex: 'wh_type', key: 'wh_type', render: wh_type => {
                        switch (wh_type) {
                          case WH_TYPE_VALID:
                            return 'Kho khả dụng';
                          case WH_TYPE_EXCHANGE:
                            return 'Kho đổi trả';
                          default:
                            return 'Kho tổng';
                        }
                      }
                    },
                    {
                      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: stt => {
                        return renderWhStt(stt);
                      }
                    },
                    {
                      title: '', key: 'action', render: raw => {
                        return (
                          <Space>
                            <Button onClick={() => updateWarehouse(raw)} size={`small`} type={`primary`}>
                              <EditOutlined/>
                            </Button>
                            <Popconfirm
                              title={`Xoá kho này?`}
                              onConfirm={() => onDelete(raw.id)}
                            >
                              <Button size={`small`} danger type={`dashed`}>
                                <DeleteOutlined/>
                              </Button>
                            </Popconfirm>
                          </Space>
                        )
                      }
                    },
                  ]}
                    />
                  };


  return (
    <Card title={`Danh sách kho`} extra={[
      <Button key={"b_a"} onClick={addWarehouse}>Thêm kho</Button>
    ]}>
      <Spin spinning={isLoading}>
        <Form onFinish={searchWarehouse} {...{
          labelCol: {
            xs: {span: 24}
          },
          wrapperCol: {
            xs: {span: 24}
          },
          labelAlign: 'left',
        }}>
          <Row>
            <Col md={6}>
              <Form.Item
                name={`id`}>
                <Input placeholder={`Mã`}/>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                name={`name`}>
                <Input placeholder={`Tên`}/>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name={`status`}>
                <Select placeholder={`Trạng thái`}>
                  <Select.Option value={1}>Hoạt động</Select.Option>
                  <Select.Option value={2}>Tạm ngưng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name={`type`}>
                <Select placeholder={`Loại kho`}>
                  <Select.Option value={`pos`}>Pos</Select.Option>
                  <Select.Option value={`online`}>Online</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={2}>
              <div className={`d-flex space-between`}>
                <Button htmlType={`submit`} type={`primary`}>Tìm kiếm</Button>
                <Button><ClearOutlined/></Button>
              </div>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey={`id`}
          dataSource={warehouses}
          pagination={pagination}
          expandable={{
            expandedRowRender: row => renderExpandedRow(row)
          }}
          columns={[
            {title: 'ID', key: 'id', dataIndex: 'id', render: id => `#${id}`},
            {
              title: 'Tên kho', dataIndex: 'name', key: 'name', render: (name, raw) => {
                return (
                  <Space direction={`vertical`} size={1}>
                    <b>{name}</b>
                    <small>Nguồn: {raw.platform}</small>
                    <small>ID : {raw.platform_id}</small>
                  </Space>
                )
              }
            },
            {
              title: 'Trạng thái', dataIndex: 'status', key: 'status', render: stt => {
                return renderWhStt(stt);
              }
            },
            {title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', render: time => dateTime(time)},
            {
              title: 'Loại kho', dataIndex: 'type', key: 'type', render: type => {
                return type.toUpperCase();
              }
            },
            {title: 'Thành phố', dataIndex: 'city_name', key: 'city_name'},
            {title: 'Quận', dataIndex: 'district_name', key: 'district_name'},
            {
              title: '', key: 'action', render: raw => {
                return (
                  <Space>
                    {raw.default === 0 ? <Popconfirm
                        title={`Chọn kho này là mặc định?`}
                        onConfirm={() => onSetDefault(raw.id)}
                      >
                        <Button size={`small`} type={`dashed`} icon={<CheckOutlined/>}
                                title={"Chọn làm mặc định"}/>
                      </Popconfirm> :
                      <CheckOutlined title={"Kho mặc định"}/>
                    }
                    <Link to={`/warehouse/${raw.id}`}>
                      <Button size={`small`} type={`primary`}>
                        <BarChartOutlined/>
                      </Button>
                    </Link>

                    <Button onClick={() => updateWarehouse(raw)} size={`small`} type={`primary`}>
                      <EditOutlined/>
                    </Button>
                    <Popconfirm
                      title={`Xoá kho này?`}
                      onConfirm={() => onDelete(raw.id)}
                    >
                      <Button size={`small`} danger type={`dashed`}>
                        <DeleteOutlined/>
                      </Button>
                    </Popconfirm>
                  </Space>
                )
              }
            },
          ]}
        />
      </Spin>
      <Modal
        footer={
          <div className={`d-flex space-end align-center`}>
            <small className={`text-note danger`}>* thông tin bắt buộc</small>
            <Button onClick={hideModal}>Hủy</Button>
            <Button htmlType={`submit`} form={`warehouseForm`}>Lưu</Button>
          </div>}
        title={state.modalTitle}
        onCancel={hideModal}
        visible={state.showModal}>
        <WarehouseForm
          form={form}
          hideModal={hideModal}/>
      </Modal>
      <Modal
        width={1200}
        onCancel={haravanSyncCancel}
        title={`Haravan warehouse sync`}
        visible={state.haravanModal}
        footer={[
          <Button onClick={haravanSyncCancel}>Đóng</Button>
        ]}
      >
        {state.syncLists == null ? <Skeleton/> :
          <Table
            className={'hide-paginate'}
            rowKey={`id`}
            dataSource={state.syncLists}
            columns={[
              {title: 'Tên kho', dataIndex: 'name', key: 'name'},
              {title: 'Email', dataIndex: 'email', key: 'email'},
              {title: 'Phone', dataIndex: 'phone', key: 'phone'},
              {title: 'Quốc gia', dataIndex: 'country_name', key: 'country_name'},
              {title: 'Thành phố', dataIndex: 'province_name', key: 'province_name'},
              {title: 'zip', dataIndex: 'zip', key: 'zip'},
              {
                title: '', key: 'action', render: raw => {
                  return (
                    <Space>
                      <Button loading={state.syncLoadings[raw.id]}
                              onClick={() => onSync(raw)} size={`small`}
                              type={`danger`}><SyncOutlined/> Synchronize</Button>
                    </Space>)
                }
              },
            ]}
          />
        }
      </Modal>
    </Card>
  )
}
export default Warehouse;

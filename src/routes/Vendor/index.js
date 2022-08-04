import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {Button, Card, Form, Popconfirm, Skeleton, Space, Table} from "antd";
import {CUSTOMER_TYPE_VENDOR} from "../../constants/constant";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {DELETE_VENDOR, GET_VENDOR} from "../../constants/ActionTypes";
import FilterCustomer from "../../containers/FilterCustomer";

const Vendor = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {vendors, pagination} = useSelector(({vendor}) => vendor);
  const getVendor = (params = {}) => {
    dispatch({
      type: GET_VENDOR,
      payload: {
        ...params,
        type: CUSTOMER_TYPE_VENDOR
      }
    });
  };
  const onDelete = vendorId => {
    dispatch({
      type: DELETE_VENDOR,
      payload: {vendorId}
    })
  };
  useEffect(() => {
    getVendor();
  }, []);
  const onSearch = data => {
    getVendor(data)
  };
  const onReset = () => {
    getVendor();
    form.resetFields();
  };
  return (
    <Card title={
      `Danh sách nhà cung cấp`
    } extra={<Link to={`/vendor/create`}>
      <Button><PlusOutlined/> Thêm nhà cung cấp</Button></Link>}>

      <FilterCustomer
        onSearch={onSearch}
        onReset={onReset}
        form={form}
        type={CUSTOMER_TYPE_VENDOR}
      />

      {vendors == null ? <Skeleton active/> :
        <Table
          rowKey={`id`}
          dataSource={vendors}
          pagination={pagination}
          columns={
            [
              {
                title: "Tên", dataIndex: 'name', key: 'name',
                render: (name, raw) => <Link to={`/vendor/update/${raw.id}`}>{name}</Link>
              },
              {
                title: "Liên Lạc",
                dataIndex: 'phone',
                key: 'phone',
                render: phone => <a href={`tel:${phone}`}>{phone}</a>
              },
              {title: "Thành phố", dataIndex: 'city', key: 'city'},
              {title: "Quận/Huyện", dataIndex: 'district', key: 'district'},
              {
                title: "", render: raw => {
                  return (
                    <Space>
                      <Link to={`/vendor/update/${raw.id}`}>
                        <Button size={`small`} primary>
                          <EditOutlined/>
                        </Button>
                      </Link>
                      <Popconfirm
                        title={`Xoá sản phẩm này?`}
                        onConfirm={() => onDelete(raw.id)}
                      >
                        <Button size={`small`} danger type={`dashed`}>
                          <DeleteOutlined/>
                        </Button>
                      </Popconfirm>
                    </Space>
                  )
                }
              }
            ]
          }/>}
    </Card>
  )
};
export default Vendor;

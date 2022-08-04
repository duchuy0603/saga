import React, {useEffect} from "react";
import {
  Card,
  Space,
  Button,
  Popconfirm,
  Form,
  Table,
  Skeleton,
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {DeleteOutlined, PlusOutlined, EditOutlined} from "@ant-design/icons";
import {CUSTOMER_TYPE_CUSTOMER} from '../../constants/constant';
import {Link} from "react-router-dom";
import {DELETE_CUSTOMER, GET_CUSTOMER} from "../../constants/ActionTypes";
import FilterCustomer from "../../containers/FilterCustomer";


const Customer = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {customers, pagination} = useSelector(({customer}) => customer);
  const getCustomer = (params = {}) => {
    dispatch({
      type: GET_CUSTOMER,
      payload: {
        ...params,
        type: CUSTOMER_TYPE_CUSTOMER
      }
    });
  };
  const onDelete = customerId => {
    dispatch({
      type: DELETE_CUSTOMER,
      payload: {customerId}
    })
  };
  const onSearch = data => {
    getCustomer(data)
  };
  const onReset = () => {
    getCustomer();
    form.resetFields();
  };
  useEffect(() => {
    getCustomer();
  }, []);
  return (

    <Card size={"small"} title={
      `Danh sách khách hàng`
    } extra={<Link to={`/customer/create`}>
      <Button><PlusOutlined /> Thêm khách hàng</Button></Link>}>

      <FilterCustomer
        onReset={onReset}
        onSearch={onSearch}
        form={form} />
      {customers == null ? <Skeleton active /> :
        <Table
          rowKey={`id`}
          dataSource={customers}
          pagination={pagination}
          columns={
            [
              {
                title: "Tên", dataIndex: 'name', key: 'name',
                render: (name, raw) => <Link to={`/customer/update/${raw.id}`}>{name}</Link>
              },
              {
                title: "Liên Lạc",
                dataIndex: 'phone',
                key: 'phone',
                render: phone => <a href={`tel:${phone}`}>{phone}</a>
              },
              {title: "Thành phố", dataIndex: 'province', key: 'province'},
              {title: "Quận/Huyện", dataIndex: 'district', key: 'district'},
              {
                title: "", render: raw => {
                  return (
                    <Space>
                      <Link to={`/customer/update/${raw.id}`}>
                        <Button size={`small`} primary>
                          <EditOutlined />
                        </Button>
                      </Link>
                      <Popconfirm
                        title={`Xoá sản phẩm này?`}
                        onConfirm={() => onDelete(raw.id)}
                      >
                        <Button size={`small`} danger type={`dashed`}>
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>
                    </Space>
                  )
                }
              }
            ]
          } />}
    </Card>
  )
}
export default Customer;

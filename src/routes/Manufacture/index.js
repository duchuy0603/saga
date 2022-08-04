import React, {useEffect} from "react";
import {Card, Table, Button, Form, Space, Popconfirm, Skeleton} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {CUSTOMER_TYPE_MANUFACTURE} from "../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {DELETE_MANUFACTURE, GET_MANUFACTURE} from "../../constants/ActionTypes";
import FilterCustomer from "../../containers/FilterCustomer";

const Manufacture = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {pagination, manufactures} = useSelector(({manufacture}) => manufacture);
  const getManufacture = (params = {}) => {
    dispatch({
      type: GET_MANUFACTURE,
      payload: {
        ...params,
        type: CUSTOMER_TYPE_MANUFACTURE
      }
    });
  };
  useEffect(() => {
    getManufacture();
  }, []);
  const onDelete = (mdId) => {
    dispatch({
      type: DELETE_MANUFACTURE,
      payload: {
        mdId
      }
    })
  };
  const onSearch = data => {
    getManufacture(data)
  };
  const onReset = () => {
    getManufacture();
    form.resetFields();
  };
  return (
    <Card title={`Nhà sản xuất`}
          extra={
            <Link to={`/manufacture/create`}>
              <Button><PlusOutlined/> Thêm mới</Button>
            </Link>
          }
    >
      <FilterCustomer
        onSearch={onSearch}
        onReset={onReset}
        form={form}
        type={CUSTOMER_TYPE_MANUFACTURE}
      />
      {manufactures == null ? <Skeleton active/> : <Table
        dataSource={manufactures}
        pagination={pagination}
        rowKey={`index`}
        columns={
          [
            {
              title: "Tên", dataIndex: 'name', key: 'name',
              render: (name, raw) => <Link to={`/manufacture/update/${raw.id}`}>{name}</Link>
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
                    <Link to={`/manufacture/update/${raw.id}`}>
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

  );
}
export default Manufacture;

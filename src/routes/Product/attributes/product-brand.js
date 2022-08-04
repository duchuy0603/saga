import React, {useEffect, useState} from "react";
import {Button, Card, Form, Input, Modal, Popconfirm, Space, Table} from "antd";
import {formWrap, PRO_CAT_TYPE_ARCHIVE, PRO_CAT_TYPE_BRAND} from "../../../constants/constant";
import ModalCreate from "./ModalCreate";
import {useDispatch, useSelector} from "react-redux";
import {PRODUCT_CAT_DEL, PRODUCT_CAT_GET_LIST} from "../../../constants/ActionTypes";
import {dateTimeFromString} from "../../../util/Helper";
import ModalImport from "./ModalImport";

const ProductBrand = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState();
  const [importVisible, setImportVisible] = useState();
  const {catList, acLoad} = useSelector(({product}) => product);
  const dispatch = useDispatch();
  const getArchive = async (params = {}) => {
    dispatch({
      type: PRODUCT_CAT_GET_LIST,
      payload: {
        ...params,
        type: PRO_CAT_TYPE_BRAND,
      }
    })
  }
  useEffect(() => {
    getArchive()
  }, [])
  return (
    <Card
      extra={[
        <Button onClick={() => setVisible(true)}>Thêm mới</Button>,
        <Button onClick={() => setImportVisible(true)}>Nhập Excel</Button>
      ]}
      title={`Thương hiệu sản phẩm`}>
      <Table
        columns={[
          {title: 'ID', dataIndex: 'id', key: 'id', render: id => `#${id}`},
          {title: 'Tên', dataIndex: 'name', key: 'name'},
          {title: 'Code', dataIndex: 'code', key: 'code'},
          {
            title: 'Ngày cập nhật',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: time => dateTimeFromString(time)
          },
          {
            title: '', key: 'action', render: raw => {
              return (<Space>
                <Popconfirm onConfirm={() => {
                  dispatch({
                    type: PRODUCT_CAT_DEL,
                    payload: {
                      catId: raw.id
                    }
                  })
                }} title={`Xóa dữ liệu này?`}>
                  <Button size={`small`} type={`dashed`} danger>
                    <i className={`icon icon-trash`}/>
                  </Button>
                </Popconfirm>
                <Button onClick={() => {
                  form.setFieldsValue(raw);
                  setVisible(true)
                }} size={`small`} type={`primary`}>
                  <i className={`icon icon-edit`}/>
                </Button>
              </Space>)
            }
          }
        ]}
        dataSource={catList}
      />
      <ModalCreate
        form={form}
        loading={acLoad}
        visible={visible}
        type={PRO_CAT_TYPE_BRAND}
        setVisible={setVisible}
        name={`Thương hiệu sản phẩm`}
      />
      <ModalImport
        callback={getArchive}
        visible={importVisible}
        setVisible={setImportVisible}
      />
    </Card>
  )
}
export default ProductBrand;

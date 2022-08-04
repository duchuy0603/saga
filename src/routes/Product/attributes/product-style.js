import React, {useEffect, useState} from "react";
import {Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag} from "antd";
import {formWrap, PRO_CAT_TYPE_BRAND, PRO_CAT_TYPE_GROUP, PRO_CAT_TYPE_STYLE} from "../../../constants/constant";
import {Link} from "react-router-dom";
import ModalCreate from "./ModalCreate";
import {useDispatch, useSelector} from "react-redux";
import {PRODUCT_CAT_DEL, PRODUCT_CAT_GET_LIST} from "../../../constants/ActionTypes";
import {dateTimeFromString} from "../../../util/Helper";
import ModalImport from "./ModalImport";

const ProductStyle = () => {
  const [importVisible, setImportVisible] = useState();
  const {catList, acLoad} = useSelector(({product}) => product);
  const dispatch = useDispatch();
  const getArchive = async (params = {}) => {
    dispatch({
      type: PRODUCT_CAT_GET_LIST,
      payload: {
        ...params,
        type: PRO_CAT_TYPE_STYLE,
      }
    })
  }
  useEffect(() => {
    getArchive()
  }, [])
  return (
    <Card
      extra={[
        <Link to={`/product/style-create`}><Button type={`primary`}>Thêm mới</Button></Link>,
        <Button onClick={() => setImportVisible(true)}>Nhập Excel</Button>
      ]}
      title={`Loại sản phẩm`}>
      <Table
        columns={[
          {title: 'ID', dataIndex: 'id', key: 'id', render: id => `#${id}`},
          {title: 'Tên', dataIndex: 'name', key: 'name'},
          {title: 'Code', dataIndex: 'code', key: 'code'},
          {
            title: 'Giá trị',
            dataIndex: 'variants',
            key: 'variants',
            render: variants => {
              return variants?.option?.map(variant => {
                return <Tag>{variant.name}-{variant.code}</Tag>
              })
            }
          },
          {
            title: 'Ngày cập nhật',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: time => dateTimeFromString(time)
          },
          {
            title: '',
            key: 'action',
            render: raw => {
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
                <Link to={`/product/style-create/${raw.id}`}>
                  <Button size={`small`} type={`primary`}>
                    <i className={`icon icon-edit`}/>
                  </Button>
                </Link>
              </Space>)
            }
          },
        ]}
        dataSource={catList}
      />
      <ModalImport
        importType={`category`}
        callback={getArchive}
        visible={importVisible}
        setVisible={setImportVisible}
      />
    </Card>
  )
}
export default ProductStyle;

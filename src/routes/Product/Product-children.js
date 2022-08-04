import React from "react";
import {Button, Drawer, Image, Popconfirm, Space, Table} from "antd";
import {getWindowDimensions,defaultImage, getEmpty} from "../../util/Helper";
import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";


const ProductChildren = ({...props}) => {

  const {visible, onClose, onDelete, product} = props;
  return (
      <Drawer
        width={1200}
        className={`drawer-custom`}
        onClose={onClose}
        title={`Loại sản phẩm ${product && product.name}`}
        visible={visible}>
        {!product ? null :
          <Table
            scroll={{y : getWindowDimensions().height - 250}}
            rowKey={`id`}
            dataSource={product.childrens}
            columns={[
              {
                title: 'ID - Name', width: '25%', dataIndex: 'id', key: 'id',
                render: (id, raw) => {
                  return (
                    <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                      <Image
                        width={80}
                        height={80}
                        src={raw.image_url}
                        fallback={defaultImage()}
                      />
                      <Space className={`pl-1`} size={1} direction={`vertical`}>
                        <Link to={`/product/${id}`}>#{id}.{raw.parent_name}</Link>
                        <small>Loại: {raw.group === 'single' ? getEmpty(raw.name) : '--'}</small>
                        <small>Barcode: {raw.barcode}</small>
                        <small>Trọng lượng: {raw.weight}</small>
                      </Space>
                    </div>
                  )
                }
              },
              {title: 'SKU', dataIndex: 'sku', key: 'sku'},
              {title: 'NCC', dataIndex: 'vendor_name', key: 'vendor_name'},
              {title: 'Đơn vị', dataIndex: 'unit', key: 'unit'},
              {title: 'tồn tổng/kho', dataIndex: 'alert', key: 'alert'},
              {title: 'Giá trị trung bình', dataIndex: 'average', key: 'average'},
              {
                title: '',  width: 120,key: 'action', render: raw => {
                  return (
                    <Space>
                      <Link to={`/product/update/${raw.id}`}>
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
            ]}
          />
        }
      </Drawer>
  )
}
export default ProductChildren;

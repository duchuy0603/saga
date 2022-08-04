import React, {useEffect, useState} from "react";
import {Button, Image, message, Space, Spin, Table} from "antd";
import {reqWarehouseSyncList} from "../../../appRedux/services/inventory";
import {defaultImage, getPaginate, renderNumberFormat} from "../../../util/Helper";
import {reqInventorySync} from "../../../appRedux/services/PancakeSync";

const WarehousePancakeSyncList = () => {
  const [syncList, setSyncList] = useState([]);
  const [syncPage, setSyncPage] = useState({});
  const [syncLoad, setSyncLoad] = useState(false);
  const [syncAcLoad, setSyncAcLoad] = useState(false);

  const getListSync = async (params = {}) => {
    try {
      setSyncLoad(true)
      const response = await reqWarehouseSyncList(params);
      setSyncList(response.data.data);
      setSyncPage({
        ...getPaginate(response.data),
        simple: true
      })
    } catch (e) {
      message.error(e.message);
    } finally {
      setSyncLoad(false)
    }
  }
  const onDoSync = async (raw) => {
    try {
      setSyncAcLoad(true)

      const postData = {
        variantPlatformId: raw.product_platforms?.platform_id,
        warehousePlatformId: raw.warehouse_platforms?.platform_id,
        remainQuantity: raw.hand_in_stock ?? 0,
        whId: raw.warehouse_id,
        productId: raw.product_id
      }
      const response = await reqInventorySync(postData);
      message.success("Đồng bộ thành công!");
    } catch (e) {
      message.error(e.message);
    } finally {
      setSyncAcLoad(false)
    }
  }
  useEffect(() => {
    getListSync();
  }, [])

  return (
    <Spin spinning={syncLoad}>
      <Table
        dataSource={syncList}
        pagination={syncPage}
        columns={[
          {
            title: 'Sản phẩm',
            dataIndex: 'product_name',
            key: 'product_id',
            render: (name, raw) => {
              return <Space size={`small`}>
                <Image
                  src={raw.product?.image_url ?? 'error'}
                  fallback={defaultImage()}
                  width={80}
                  height={80}/>
                <Space size={`small`} direction={`vertical`}>
                  <small>{name}</small>
                  <small>Barcode: {raw?.product?.barcode}</small>
                  <small>Sku: {raw?.product?.sku}</small>
                </Space>
              </Space>
            }
          },
          {title: 'Kho', dataIndex: 'warehouse_name', key: 'warehouse_name'},
          {title: 'Tồn', dataIndex: 'hand_in_stock', key: 'hand_in_stock'},
          {
            title: 'Khả dụng', dataIndex: 'hand_in_stock', key: 'hand_in_stock', render: (value, raw) => {
              return renderNumberFormat(value - raw.committed);
            }
          },
          {
            title: '', dataIndex: 'id', key: 'action', render: (id, raw) => {
              return <Space>
                <Button loading={syncAcLoad} onClick={() => onDoSync(raw)} danger type={`dashed`} size={`small`}>Sync
                  pancake</Button>
              </Space>
            }
          }
        ]}
      />
    </Spin>
  )
}
export default WarehousePancakeSyncList;

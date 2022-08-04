import React from "react";
import {Drawer, Image, Input, Space, Table} from "antd";
import {dateTimeFromString, defaultImage, getEmpty, renderNumberFormat} from "../../util/Helper";
import {Link} from "react-router-dom";

const DrawerProduct = ({...props}) => {
  const {
    getVariantWarehouse,
    visible, onClose, parent,
    changePageVariant, pVariantList, pVariantPagination
  } = props;

  return (
    <Drawer

      className={`drawer-custom`}
      title={[
        <Space>Tồn kho : <Link to={`/product/${parent.id}`}>{parent && parent.name}</Link>|<small
          className={`text-normal`}>SKU: {parent.sku}</small>
          <Input.Search
            allowClear
            style={{width: "100%"}}
            onSearch={value => getVariantWarehouse({key: value})}
            placeholder={`Tìm tên sản phẩm, SKU....`}/>
        </Space>
      ]}
      onClose={onClose}
      visible={visible}
    >
      {pVariantList ? (
        <Table
          onChange={changePageVariant}
          pagination={pVariantPagination}
          dataSource={pVariantList}
          columns={[
            {
              title: 'Sản phẩm', dataIndex: 'name', key: 'name',
              render: (name, raw) => {
                return (
                  <Space>
                    <Image
                      width={65}
                      height={65}
                      src={raw.image_url}
                      fallback={defaultImage()}
                    />
                    <Space direction={"vertical"} size={1}>
                      <span><Link target={"_blank"} to={`/product/${raw.id}`}>{raw.parent_name}</Link></span>
                      <small>Loại: {getEmpty(raw.name)}</small>
                      <small>Sku: {raw.sku}</small>
                    </Space>
                  </Space>
                )
              }
            },
            {
              title: 'Kho',
              dataIndex: 'warehouse_name',
              key: 'warehouse_name',
              render: (w, r) => <span> {!w ? r.warehouse.name : w}</span>
            },
            {
              title: 'Tồn', dataIndex: 'hand_in_stock', key: 'hand_in_stock', render: (stock, raw) => {
                return renderNumberFormat(stock);
              }
            },
            {
              title: 'Đặt', dataIndex: 'committed', key: 'committed', render: (committed, raw) => {
                return renderNumberFormat(committed);
              }
            },
            {
              title: 'Khả dụng', dataIndex: 'committed', key: 'committed', render: (committed, raw) => {
                return renderNumberFormat(raw.hand_in_stock - committed);
              }
            },
            {
              title: 'K.K.D', dataIndex: 'committed', key: 'committed', render: (committed, raw) => {
                return renderNumberFormat(committed);
              }
            },
            {
              title: 'Cảnh báo tồn', render: raw => {
                return raw.product ? raw.product.inventory_quantity : 0;
              }
            },
            {
              title: 'Chờ nhập', dataIndex: 'waiting_import', key: 'waiting_import', render: (waiting_import, raw) => {
                const {single_trans} = raw;
                if (!waiting_import) {
                  return getEmpty();
                }
                return (
                  <Space direction={`vertical`} size={1}>
                    <span>Số lượng: {getEmpty(waiting_import)}</span>
                    <small>Ngày giao dự kiến: {dateTimeFromString(single_trans.expected_date, 'DD/MM/YYY')}</small>
                  </Space>
                )
              }
            }
          ]}
        />
      ) : null}
    </Drawer>
  )
}
export default DrawerProduct;

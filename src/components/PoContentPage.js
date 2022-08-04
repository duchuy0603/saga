import React, {useEffect} from 'react';
import moment from "moment";
import {dateTimeFromString, getEmpty, renderNumberFormat} from "../util/Helper";
import {Space, Table} from "antd";

const PoContentPage = ({po}) => {
  if (!po) {
    return null;
  }
  const {po_items, brand, wh_from, address_info} = po;
  return (
    <div className={`a5`} style={{height: '100%'}}>
      <div className={`tracking-print`}>
        <div className={`d-flex`}>
          <p>{moment.unix(moment.now() / 1000).format('DD/MM/YYYY')}</p>
          <p className={`text-center w-100`}>Chi tiết đơn hàng - #POUOA-{po.id}</p>
        </div>
        <div className={`d-flex space-between`}>
          <h5>{brand ? getEmpty(brand.name) : 'Ú Òa'}</h5>
          <p>Ngày đặt hàng: {dateTimeFromString(po.order_date)}</p>
        </div>
        <div className={`d-flex space-between`}>
          <Space size={1} direction={"vertical"}>
            <small>Địa chỉ: {brand && brand.address}</small>
            <small>Điện thoại: {brand && brand.phone}</small>
          </Space>
        </div>

        <div className={`d-flex space-between`}>
          <div className={`col-16`}>
            <p>Chi tiết đơn hàng: #029123</p>
            <Table
              size={`small`}
              pagination={false}
              dataSource={po_items ? po_items : []}
              columns={[
                {
                  title: 'Mã sản phẩm', dataIndex: 'sku', key: 'sku', render: (sku, raw) => {
                    if (!raw.product) {
                      return '--';
                    }
                    return raw.product.sku;
                  }
                },
                {
                  title: 'Sản phẩm', dataIndex: 'title', key: 'title', render: (title, raw) => {
                    return (
                      <Space className={`pl-1`} size={1} direction={'vertical'}>
                        <small>{title}</small>
                      </Space>
                    )
                  }
                },
                {title: 'Số lượng', dataIndex: 'quantity', key: 'quantity'},
              ]}
            />
          </div>
          <div className={`col-8 ml-1`}>
            <div className={`box`}>
              <p>Thông tin vận chuyển</p>
              <div className={`box-inner`}>
                <Space size={1} direction={"vertical"}>
                  <small className={`bold`}>Mã vận đơn:</small>
                  <small className={`pd-1`}>
                    <span> {getEmpty(po.tracking_number)}</span>
                  </small>
                  <small className={`bold`}>Mã phiếu GH:</small>
                  <small className={`pd-1`}>
                    <span>#POUOA-{po.id}</span>
                  </small>
                  <small className={`bold`}>Tiền thu hộ:</small>
                  <small className={`pd-1`}>
                    <span>{renderNumberFormat(po.cod, null, '₫')}</span>
                  </small>
                </Space>

              </div>
            </div>
            <div className={`box`}>
              <p>Thông tin người nhận</p>
              <div className={`box-inner`}>
                <Space size={1} direction={"vertical"}>
                  {!address_info ? <small>Chưa có địa chỉ nhận</small> :
                    <>
                      <small className={`bold`}>Người nhận:</small>
                      <small className={`pd-1`}>
                        <span>{wh_from ? wh_from.name : address_info.shipping_name}</span>
                      </small>
                      <small className={`bold`}>Địa chỉ:</small>
                      <small className={`pd-1`}>
                      <span>
                        {address_info.shipping_address1},
                        {address_info.shipping_ward},
                        {address_info.shipping_district},
                        {address_info.shipping_province},
                        {address_info.shipping_country}
                      </span>
                      </small>
                      <small className={`bold`}>Điện thoại:</small>
                      <small className={`pd-1`}>
                        <span>{address_info.shipping_phone}</span>
                      </small>
                    </>
                  }
                </Space>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PoContentPage;

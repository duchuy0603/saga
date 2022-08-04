import React, {useEffect, useState} from 'react'
import {
  Divider,
  Skeleton,
  Col, Row, Table, Button,
  Steps, Descriptions, Space, Popover, Tag
} from 'antd';
import {
  CheckCircleFilled,
  DollarCircleFilled,
  CarFilled,
  SmileOutlined, EnvironmentOutlined, PhoneOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {dateTimeFromString, getEmpty, LinkOriginOrder, renderNumberFormat} from "../../../util/Helper";
import {Link} from "react-router-dom";
import {
  FULFILLMENT_STATUS, HARAVAN_ORDER_FINANCE_STATUS,
} from "../../../constants/constant";
import Modal from "antd/es/modal";
import {APPLY_BRAND_ORDER, GET_ORDER_DETAIL} from "../../../constants/ActionTypes";
import SelectBrand from "../../../components/Input/SelectBrand";

const {Step} = Steps;

const TabDetail = () => {
  const {order, actionLoading} = useSelector(({order}) => order);
  const [brand, setBrand] = useState(null);
  const dispatch = useDispatch();
  const [brandModal, setBrandModal] = useState({
    visible: false,
    loading: false
  });
  if (!order) {
    return <Skeleton loading={true} />
  }

  let paidTitle = 'Unknown';
  let paidStatus = 'wait';
  const idxPaid = HARAVAN_ORDER_FINANCE_STATUS.findIndex(item => item.code === order.finance_status);
  if (idxPaid >= 0) {
    paidTitle = HARAVAN_ORDER_FINANCE_STATUS[idxPaid].name;
    paidStatus = HARAVAN_ORDER_FINANCE_STATUS[idxPaid].stepProcess;
  }

  let fulfillTitle = 'Unknown';
  let fulfillStatus = 'wait';
  const idx = FULFILLMENT_STATUS.findIndex(item => item.code === order.fulfillment_status);
  if (idx >= 0) {
    fulfillTitle = FULFILLMENT_STATUS[idx].name;
    fulfillStatus = FULFILLMENT_STATUS[idx].stepProcess;
  }
  const applyBrand = () => {
    setBrandModal({
      visible: true
    });
  }
  const saveOrderBrand = () => {
    dispatch({
      type: APPLY_BRAND_ORDER,
      payload: {
        brand_id: brand,
        order_id: order.id
      }
    });
    if (!actionLoading) {
      setBrandModal({
        visible: false
      });
      setBrand(null);
      dispatch({
        type: GET_ORDER_DETAIL,
        payload: {
          id: order.id,
        }
      });
    }
  };
  const renderTag = () => {
    const tags = JSON.parse(order.tags);
    if (!Array.isArray(tags)) {
      return "";
    }
    return <Space size={'small'} wrap>
      {tags.map(item => {
        return <Tag key={`tag${order.id}${item.id}`}>{item.name}</Tag>
      })}
    </Space>;
  }
  const renderShipAddress = () => {
    const {shipping_address} = order;
    if (!shipping_address) {
      return 'Unknown';
    }
    return (
      <Space direction={"vertical"} size={'small'}>
          <span>
         <EnvironmentOutlined />
          <Space size={"small"} split={','} wrap>
            <span>{shipping_address.shipping_address1}</span>
            <span>{shipping_address.shipping_ward}</span>
            <span>{shipping_address.shipping_district}</span>
            <span>
              {shipping_address.shipping_province ?
                shipping_address.shipping_province :
                shipping_address.shipping_city
              }
            </span>
          </Space>
        </span>
        <span>
            <PhoneOutlined />
            <a className={'ml-1'}
               href={`tel:${shipping_address.shipping_phone}`}>{getEmpty(shipping_address.shipping_phone)}</a>
          </span>
      </Space>
    )
  }
  const renderShipTo = () => {
    const {shipping_address} = order;
    if (!shipping_address) {
      return 'Unknown';
    }
    return (
      <span>{shipping_address.billing_name}</span>
    )
  }
  const renderBrand = () => {
    const {brand} = order;
    if (!brand) {
      return (
        <Button size={"small"}
          //disabled={isCreatingPO}
                onClick={() => applyBrand()}
                type={"primary"}>Gắn nhẵn</Button>
      );
    }
    return (<Popover content={() => (
      <Space direction={"vertical"} size={'small'}>
          <span>
         <EnvironmentOutlined />
            <span className={`ml-1`}>{brand.address}</span>
        </span>
        <span>
            <PhoneOutlined />
            <a className={'ml-1'}
               href={`tel:${brand.phone}`}>{getEmpty(brand.phone)}</a>
          </span>
      </Space>
    )} title={`Thông tin nhãn`}>
      {brand.name}
    </Popover>);
  }
  return (
    <div>
      <Steps size={'small'} progressDot={false}>
        <Step
          status={order.confirmed_status === "confirmed" ? "finish" : "wait"}
          icon={<CheckCircleFilled />}
          title="Xác nhận" />
        <Step
          status={paidStatus}
          icon={<DollarCircleFilled />}
          title={paidTitle} />
        <Step
          icon={<CarFilled />}
          status={fulfillStatus}
          title={fulfillTitle}
        />
        <Step
          status={order.closed_status === "closed" ? "process" : "wait"}
          title="Hoàn thành"
          icon={<SmileOutlined />}
        />
      </Steps>
      <Divider />
      <Descriptions layout={'vertical'} size={'small'}>
        <Descriptions.Item label={<b>Mã</b>}>
          {`${order.id} - ${order.order_num}`}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Nguồn đơn:</b>}>
          <span className="gx-text-capitalize">{order.platform}</span>
          <a target={'_blank'}
             href={LinkOriginOrder(order.platform_order_id)}
             className={`ml-1`}>Xem đơn
            hàng gốc</a>
        </Descriptions.Item>
        <Descriptions.Item label={<b>Kênh</b>}>
          <span className="gx-text-capitalize">{order.platform_src}</span>
        </Descriptions.Item>
        <Descriptions.Item label={<b>Ngày đặt hàng</b>}>
          {dateTimeFromString(order.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Cổng thanh toán</b>}>
          {order.gateway}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Khách hàng</b>}>
          {renderShipTo()}
        </Descriptions.Item>

        <Descriptions.Item label={<b>Nhãn hàng</b>}>
          {renderBrand()}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Người tạo đơn</b>}>
          {getEmpty()}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Địa chỉ giao hàng</b>}>
          {renderShipAddress()}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Người xác nhận</b>}>
          {order?.user?.name}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Thời gian xác nhận</b>}>
          {dateTimeFromString(order.confirmed_at)}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Page tạo đơn</b>}>
          {renderTag()}
        </Descriptions.Item>
      </Descriptions>
      <Table
        dataSource={order.order_items}
        pagination={false}
        columns={[
          {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
          },
          {
            title: 'Sản phẩm',
            key: 'product_id',
            dataIndex: 'product_id',
            render: (value, row) => {
              return <Space size={1} direction={'vertical'}>
                <Link to={`/product/${value}`}>
                  {row.title}
                </Link>
                <small>Loại: {row.platform_variant_title}</small>
                <small>Barcode: {row.barcode}</small>
                <small>sku: {row.platform_sku}</small>
                <small>Trọng lượng: {row.weight}</small>
              </Space>
            }
          },
          {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (value) => {
              return renderNumberFormat(value);
            }
          },
          {
            title: 'Giá gốc',
            key: 'price_original',
            dataIndex: 'price_original',
            render: (value) => {
              return renderNumberFormat(value, 'gx-text-right');
            }
          },
          {
            title: 'Giá bán',
            key: 'price',
            dataIndex: 'price',
            render: (value) => {
              return renderNumberFormat(value, 'gx-text-right');
            }
          },
          {
            title: 'Giảm giá',
            key: 'discount_total',
            dataIndex: 'total_discount',
            render: (value) => {
              return renderNumberFormat(value, 'gx-text-right');
            }
          },
          {
            title: 'Thành tiền',
            key: 'total_price',
            render: (row) => {
              return renderNumberFormat(row.quantity * row.price, 'gx-text-right');
            }
          },
        ]}
        footer={() => {
          return (
            <Row>
              <Col md={14}>
                {/*<Button danger>*/}
                {/*  <FilePdfOutlined />*/}
                {/*</Button>*/}
                {/*<Button>*/}
                {/*  <PrinterOutlined />*/}
                {/*</Button>*/}
                {/*<Button>*/}
                {/*  <MailOutlined />*/}
                {/*</Button>*/}
              </Col>
              <Col md={10}>
                <Row>
                  <Col xs={12}>
                    <b>Tổng cộng</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.subtotal_price
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Giảm giá</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_discount
                      , 'gx-text-right gx-text-danger'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Phí ship</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_shipping_fee
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Thuế | Phí khác</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_tax
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Thành tiền</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_price
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        }}
      />
      <Modal
        footer={<Space>
          <Button onClick={() => setBrandModal({visible: false})}>Hủy</Button>
          <Button loading={actionLoading} type={`primary`} onClick={saveOrderBrand}>Áp dụng</Button>
        </Space>}
        onCancel={() => setBrandModal({visible: false})}
        title={`Áp dụng nhãn hàng`}
        visible={brandModal.visible}>
        <SelectBrand onSelect={setBrand} style={{width: '100%'}} />
      </Modal>
    </div>
  )
};
export default TabDetail;

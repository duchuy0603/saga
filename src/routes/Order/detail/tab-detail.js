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
                type={"primary"}>G???n nh???n</Button>
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
    )} title={`Th??ng tin nh??n`}>
      {brand.name}
    </Popover>);
  }
  return (
    <div>
      <Steps size={'small'} progressDot={false}>
        <Step
          status={order.confirmed_status === "confirmed" ? "finish" : "wait"}
          icon={<CheckCircleFilled />}
          title="X??c nh???n" />
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
          title="Ho??n th??nh"
          icon={<SmileOutlined />}
        />
      </Steps>
      <Divider />
      <Descriptions layout={'vertical'} size={'small'}>
        <Descriptions.Item label={<b>M??</b>}>
          {`${order.id} - ${order.order_num}`}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Ngu???n ????n:</b>}>
          <span className="gx-text-capitalize">{order.platform}</span>
          <a target={'_blank'}
             href={LinkOriginOrder(order.platform_order_id)}
             className={`ml-1`}>Xem ????n
            h??ng g???c</a>
        </Descriptions.Item>
        <Descriptions.Item label={<b>K??nh</b>}>
          <span className="gx-text-capitalize">{order.platform_src}</span>
        </Descriptions.Item>
        <Descriptions.Item label={<b>Ng??y ?????t h??ng</b>}>
          {dateTimeFromString(order.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label={<b>C???ng thanh to??n</b>}>
          {order.gateway}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Kh??ch h??ng</b>}>
          {renderShipTo()}
        </Descriptions.Item>

        <Descriptions.Item label={<b>Nh??n h??ng</b>}>
          {renderBrand()}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Ng?????i t???o ????n</b>}>
          {getEmpty()}
        </Descriptions.Item>
        <Descriptions.Item label={<b>?????a ch??? giao h??ng</b>}>
          {renderShipAddress()}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Ng?????i x??c nh???n</b>}>
          {order?.user?.name}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Th???i gian x??c nh???n</b>}>
          {dateTimeFromString(order.confirmed_at)}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Page t???o ????n</b>}>
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
            title: 'S???n ph???m',
            key: 'product_id',
            dataIndex: 'product_id',
            render: (value, row) => {
              return <Space size={1} direction={'vertical'}>
                <Link to={`/product/${value}`}>
                  {row.title}
                </Link>
                <small>Lo???i: {row.platform_variant_title}</small>
                <small>Barcode: {row.barcode}</small>
                <small>sku: {row.platform_sku}</small>
                <small>Tr???ng l?????ng: {row.weight}</small>
              </Space>
            }
          },
          {
            title: 'S??? l?????ng',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (value) => {
              return renderNumberFormat(value);
            }
          },
          {
            title: 'Gi?? g???c',
            key: 'price_original',
            dataIndex: 'price_original',
            render: (value) => {
              return renderNumberFormat(value, 'gx-text-right');
            }
          },
          {
            title: 'Gi?? b??n',
            key: 'price',
            dataIndex: 'price',
            render: (value) => {
              return renderNumberFormat(value, 'gx-text-right');
            }
          },
          {
            title: 'Gi???m gi??',
            key: 'discount_total',
            dataIndex: 'total_discount',
            render: (value) => {
              return renderNumberFormat(value, 'gx-text-right');
            }
          },
          {
            title: 'Th??nh ti???n',
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
                    <b>T???ng c???ng</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.subtotal_price
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Gi???m gi??</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_discount
                      , 'gx-text-right gx-text-danger'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Ph?? ship</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_shipping_fee
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Thu??? | Ph?? kh??c</b>
                  </Col>
                  <Col xs={12}>
                    {renderNumberFormat(order.total_tax
                      , 'gx-text-right'
                      , 'VND')}
                  </Col>
                  <Col xs={12}>
                    <b>Th??nh ti???n</b>
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
          <Button onClick={() => setBrandModal({visible: false})}>H???y</Button>
          <Button loading={actionLoading} type={`primary`} onClick={saveOrderBrand}>??p d???ng</Button>
        </Space>}
        onCancel={() => setBrandModal({visible: false})}
        title={`??p d???ng nh??n h??ng`}
        visible={brandModal.visible}>
        <SelectBrand onSelect={setBrand} style={{width: '100%'}} />
      </Modal>
    </div>
  )
};
export default TabDetail;

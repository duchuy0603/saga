import React, {useEffect, useState} from 'react'
import {
  Space,
  Spin,
  Table,
  Button,
  Form,
  Select,
  message,
  Tooltip, Descriptions
} from 'antd'
import {useDispatch, useSelector} from "react-redux";
import {CheckCircleFilled} from "@ant-design/icons";
import {getEmpty, renderPOStatus} from "../../../util/Helper";
import {reqGetPurchaseOrder, reqPoCreateByOrderData} from "../../../appRedux/services/inventory";
import {PO_TYPE_EXPORT} from "../../../constants/constant";
import {Link} from "react-router-dom";
import Modal from "antd/es/modal";
import {APPLY_BRAND_ORDER, GET_BRAND, GET_ORDER_DETAIL} from "../../../constants/ActionTypes";
import OrderMakePO from "./shipment-make-po";

const TabShipment = () => {
  const {order, actionLoading, isListLoading} = useSelector(({order}) => order);
  const {brandList} = useSelector(({brand}) => brand);
  const [purchaseOrders, setPos] = useState([]);
  const [isPoLoading, setIsPoLoading] = useState(false);
  const {carriers} = useSelector(({auth}) => auth);
  // const [whs, setWhs] = useState([]);
  // const [packages, setPackages] = useState([]);
  const [form] = Form.useForm();
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [shipmentModal, setShipmentModal] = useState(false);
  const [brandModal, setBrandModal] = useState({
    visible: false,
    loading: false
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const newList = [];
    dispatch({
      type: GET_BRAND,
      payload: {page: -1}
    });

    onGetPOs(order.id).then(data => {
      setPos(data);
    }).catch(e => {
      message.error(e.message);
    })
  }, [order]);

  const onGetPOs = async (orderId) => {
    console.log("onGetPos");
    try {
      setIsPoLoading(true);
      const res = await reqGetPurchaseOrder({
        order_id: orderId
      });
      return res.data.data;
    } catch (e) {
      throw e;
    } finally {
      setIsPoLoading(false);
    }
  };

  const renderCarrier = (code) => {
    const carrier = carriers.find(item =>
      item.code === code);
    if (!carrier) {
      return '---'
    }
    return carrier.name;
  };

  const onCloseShipmentModel = () => {
    onGetPOs(order.id).then(data => {
      setPos(data);
    }).catch(e => {
      message.error(e.message);
    });
    setShipmentModal(false);
  };


  // const onSearchWarehouse = (data) => {
  //   onGetWarehouse(data);
  // };
  //
  // const onGetWarehouse = async (whSearch) => {
  //   try {
  //     const res = await reqGetWarehouse({
  //       name: whSearch
  //     });
  //     setWhs(res.data.data);
  //   } catch (e) {
  //     message.warn(e.message);
  //   }
  // };

  const onCreatePackages = async (data) => {
    try {
      setIsCreatingPO(true);
      const res = await reqPoCreateByOrderData({
        items: data.packages,
        order_id: order.id,
        customer_name: order.shipping_address.shipping_name,
        customer_id: order.shipping_address.id,
        type: PO_TYPE_EXPORT
      });
      console.log(res);
      setPos(await onGetPOs(order.id));
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsCreatingPO(false);
    }
  };
  const setName = (name, val) => {
    return form.setFieldsValue({
      [name]: val
    })
  };

  const renderBrand = () => {
    const {brand} = order;
    if (!brand) {
      return (
        <div className='gx-text-danger gx-font-italic'>
          Chưa có thông tin nhãn hàng
        </div>
      )
    }
    return (
      <Space direction={"vertical"}>
        <div>
          <strong>Nhãn hàng</strong>: <Tooltip title={brand.code ? brand.code[0] : 'Code empty'}>{brand.name}</Tooltip>
        </div>
        <div>
          <strong>Địa chỉ: </strong> {getEmpty(brand.address)}
        </div>
        <div>
          <strong>Điện thoại: </strong> <a href={`tel:${brand.phone}`}>{getEmpty(brand.phone)}</a>
        </div>
      </Space>
    )
  }
  const renderShipLocation = () => {
    const {shipping_address} = order;
    if (!shipping_address) {
      return (
        <div className='gx-text-danger gx-font-italic'>
          Chưa có thông tin nơi vận chuyển
        </div>
      )
    }
    return (
      <Descriptions column={3}>
        <Descriptions.Item label={<b>Khách hàng</b>}>
          {shipping_address.shipping_name}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Điện thoại</b>}>
          <a href={`tel:${shipping_address.shipping_phone}`}> {shipping_address.shipping_phone}</a>
        </Descriptions.Item>
        <Descriptions.Item label={<b>Loại đơn</b>}>
          {`${order.gateway}`}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Địa chỉ</b>}>
          {`${shipping_address.shipping_address1}, ${shipping_address.shipping_ward}, ${shipping_address.shipping_district}, ${shipping_address.shipping_province}, ${getEmpty(shipping_address.shipping_city, '', '')}`}
        </Descriptions.Item>
        <Descriptions.Item label={<b>Loại</b>}>
          {order.gateway}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const applyBrand = () => {
    setBrandModal({
      visible: true
    });
  }
  const onApplyBrand = brand => {
    dispatch({
      type: APPLY_BRAND_ORDER,
      payload: {
        ...brand,
        order_id: order.id
      }
    });
    if (!actionLoading) {
      setBrandModal({
        visible: false
      });
      dispatch({
        type: GET_ORDER_DETAIL,
        payload: {
          id: order.id,
        }
      });
    }
  };


  return (
    <div>
      <Spin spinning={isListLoading || isPoLoading}>
        <Space direction={'vertical'} style={{width: "100%"}}>
          {renderShipLocation()}
          <Space>
            {/*<Button size={"small"}*/}
            {/*        disabled={isCreatingPO}*/}
            {/*        onClick={() => applyBrand()}*/}
            {/*        type={"primary"}>Gắn nhẵn</Button>*/}
            <Button size={"small"}
                    disabled={isCreatingPO || !order.brand_id}
                    title={'Gắn nhãn trước khi tạo vận chuyển'}
                    onClick={() => setShipmentModal(true)} type={"primary"}>
              Tạo yêu cầu vận chuyển
            </Button>
          </Space>
          {/*<div>*/}
          {/*  <small className='text-mute'>* Hệ thống sẽ tự tạo yêu cầu vận chuyển theo số lượng tồn trong kho gần*/}
          {/*    nhất</small>*/}
          {/*</div>*/}
          <h4><CheckCircleFilled/> Đã xử lý vận chuyển</h4>
          <Table
            dataSource={purchaseOrders}
            columns={[
              {
                title: "Phiếu kho",
                dataIndex: 'id',
                key: 'id',
                render: id => <Link to={`/inventory/po/${id}`}>#PO-UOA{id}</Link>
              },
              {
                title: "Từ", dataIndex: 'wh_from_name', key: 'wh_from_name', render: (w, r) => {
                  return <Link to={`/warehouse/${r.wh_from_id}`}>{w}</Link>;
                }
              },
              {
                title: "Trạng thái", dataIndex: 'status', key: 'status', render: (value) => {
                  return renderPOStatus(value);
                }
              },
              {
                title: "Vận chuyển"
                , dataIndex: 'carrier'
                , key: 'carrier'
                , render: (value, row) => {
                  return <Space>
                    {renderCarrier(value)}
                    <span className="text-mute">{row.tracking_number}</span>
                  </Space>;
                }
              }
            ]}
          />
        </Space>
      </Spin>
      <Modal
        footer={<Space>
          <Button onClick={() => setBrandModal({visible: false})}>Hủy</Button>
          <Button loading={actionLoading} type={`primary`} htmlType={`submit`} form={`brand-form`}>Áp dụng</Button>
        </Space>}
        onCancel={() => setBrandModal({visible: false})}
        title={`Áp dụng nhãn hàng`}
        visible={brandModal.visible}>
        <Form
          id={`brand-form`}
          onFinish={onApplyBrand}
        >
          <Form.Item
            rules={[{required: true, message: 'Chọn nhãn hàng'}]}
            label={`Nhãn hàng`}
            name={`brand_id`}
          >
            <Select>
              {brandList ? brandList.map(brand => <Select.Option value={brand.id}>{brand.name}</Select.Option>) : null}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={null}
        visible={shipmentModal}
        maskClosable={false}
        onCancel={() => setShipmentModal(false)}
        title={'Tạo vận đơn'}
        width={720}
      >
        <OrderMakePO purchaseOrders={purchaseOrders}
                     onCloseModal={onCloseShipmentModel}/>
      </Modal>
    </div>
  )
};
export default TabShipment;

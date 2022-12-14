import React, {useState, useEffect} from 'react';
import {
  Card, Tabs, Button, Row, Col, Popconfirm,
  Space, message, Spin
} from "antd";
import {useParams} from "react-router-dom";
import {
  CheckOutlined, CloseOutlined,
  DollarOutlined,
  LeftOutlined,
  MailOutlined, PrinterOutlined,
  RollbackOutlined
} from "@ant-design/icons";
import TabDetail from './tab-detail';
import TabHistory from './tab-history'
import TabPayment from './tab-payment'
import TabReturn from './tab-return'
import TabShipment from './tab-shipment'
import {GET_ORDER_DETAIL, GET_ORDER_DETAIL_SUCCESS} from "../../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";
import {
  FULFILL_STATUS_END, FULFILL_STATUS_UN_FULFILL,
  HARAVAN_FINANCE_PAID, HARAVAN_FINANCE_PENDING, HARAVAN_FINANCE_REFUNDED,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRM, ORDER_STATUS_DELETED,
  ORDER_STATUS_UNCLOSED
} from "../../../constants/constant";
import {reqOrderChangeStatus} from "../../../appRedux/services/order";
import {reqViewUser} from "../../../appRedux/services/auth";


const {TabPane} = Tabs;
const OrderDetail = (props) => {
  const dispatch = useDispatch();
  const {orderId} = useParams();
  const {order, isListLoading} = useSelector(({order}) => order);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [state, setState] = useState({
    latestOrders: [],
  });

  useEffect(() => {
    if (orderId !== undefined) {
      getOrder(orderId);
    }
  }, [orderId]);

  const getOrder = (orderId) => {
    dispatch({
      type: GET_ORDER_DETAIL,
      payload: {
        id: orderId,
      }
    });
  };

  const onChangeStatus = async (status) => {
    setIsChangingStatus(true);
    try {
      const res = await reqOrderChangeStatus(status, order.id);
      dispatch({
        type: GET_ORDER_DETAIL_SUCCESS,
        payload: res.data
      })
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsChangingStatus(false);
    }
  };

  // const getOrderList = async (orderId) => {
  //   try {
  //     const {data} = await reqGetOrder({
  //       page: 1
  //       , limit: 5
  //       , exceptIds: [orderId]
  //     });
  //     return data;
  //   } catch (e) {
  //     message.error(e.message);
  //   }
  // }

  const renderExtraBtns = () => {
    let confirmOrderBtn = false;
    let confirmPaidBtn = false;
    let cancelOrderBtn = false;
    let closeOrderBtn = false;
    let refundOrderBtn = false;

    if (!order) {
      return <></>;
    }

    if (order.closed_status !== ORDER_STATUS_UNCLOSED
      || order.cancelled_status === ORDER_STATUS_CANCELLED
      || order.delete_status === ORDER_STATUS_DELETED
    ) {
      confirmOrderBtn = false;
      confirmPaidBtn = false;
      cancelOrderBtn = false;
      closeOrderBtn = false;
      refundOrderBtn = false;
    } else if (order.confirmed_status !== ORDER_STATUS_CONFIRM) {
      confirmOrderBtn = true;
    } else {
      if (order.finance_status === HARAVAN_FINANCE_PENDING) {
        confirmPaidBtn = true;
      }
      if (order.fulfillment_status === FULFILL_STATUS_END
        && order.finance_status === HARAVAN_FINANCE_PAID) {
        closeOrderBtn = true;
      }

      if ((order.fulfillment_status !== FULFILL_STATUS_END)
        && (order.finance_status === HARAVAN_FINANCE_PAID
          || order.finance_status === HARAVAN_FINANCE_REFUNDED)) {
        closeOrderBtn = true;
      }

      if (order.fulfillment_status === FULFILL_STATUS_END
        || order.fulfillment_status === FULFILL_STATUS_UN_FULFILL
        && order.finance_status !== HARAVAN_FINANCE_REFUNDED
      ) {
        refundOrderBtn = true;
      }
    }

    return <Space>
      {confirmOrderBtn &&
      <Popconfirm title={"X??c nh???n h??a ????n?"}
                  okText={"?????ng ??"}
                  cancelText={"H???y"}
                  onConfirm={() => onChangeStatus('confirm')}
      >
        <Button disabled={isChangingStatus}
                type={"primary"}
                size={"small"}
                icon={<CheckOutlined/>}
        >
          X??c nh???n
        </Button>
      </Popconfirm>}
      {confirmPaidBtn &&
      <Popconfirm title={"X??c nh???n h??a ????n ???? ???????c thanh to??n to??n b????"}
                  okText={"?????ng ??"}
                  cancelText={"H???y"}
                  onConfirm={() => onChangeStatus('paid')}
      >
        <Button type={"primary"} disabled={isChangingStatus}
                size={"small"}
                icon={<DollarOutlined/>}
        >
          X??c nh???n "???? thanh to??n"
        </Button>
      </Popconfirm>}
      {cancelOrderBtn &&
      <Popconfirm title={"X??c nh???n h???y h??a ????n?"}
                  okText={"?????ng ??"}
                  cancelText={"H???y"}
                  onConfirm={() => onChangeStatus('cancel')}
      >
        <Button disabled={isChangingStatus}
                type={"dashed"}
                danger
                size={"small"}
                icon={<CloseOutlined/>}
        >
          H???y ????n h??ng
        </Button>
      </Popconfirm>}
      {closeOrderBtn &&
      <Popconfirm title={"X??c nh???n h??a ????n ???? ???????c v???n chuy???n, v?? thanh to??n ?????y ????? ????? ????ng?"}
                  okText={"?????ng ??"}
                  cancelText={"H???y"}
                  onConfirm={() => onChangeStatus('close')}
      >
        <Button disabled={isChangingStatus}
                type={'primary'}
                size={"small"}
                icon={<CheckOutlined/>}
        >
          ????ng ????n h??ng
        </Button>
      </Popconfirm>}
      {refundOrderBtn &&
      <Button disabled={isChangingStatus}
              type={"dashed"}
              danger
              size={"small"}
              icon={<RollbackOutlined/>}>
        Ho??n tr???
      </Button>}
    </Space>
  };
  const printOrder = () => {

  }

  return (
    <Spin spinning={isListLoading}>
      <Card title={[
        <Button type={"link"}
                className="m-0"
                key="btn_back"
                onClick={props.history.goBack} icon={<LeftOutlined/>}>
          Quay l???i
        </Button>
      ]}
            extra={[
              <Space>
                {renderExtraBtns()}
                <Button danger size={"small"}><MailOutlined/></Button>
                <Button onClick={printOrder} type={'default'} size={"small"}><PrinterOutlined/> In</Button>
              </Space>
            ]}
      >
        <Row>
          <Col md={24}>
            <Tabs
              className={`custom-tab`}
              centered
              defaultActiveKey={`detail`}
            >
              <TabPane
                tab={`Chi ti???t`}
                key={`detail`}
              >
                <TabDetail/>
              </TabPane>
              <TabPane
                tab={`Thanh to??n`}
                key={`payment`}
              >
                <TabPayment/>
              </TabPane>
              <TabPane
                tab={`V???n chuy???n`}
                key={`shipment`}
              >
                <TabShipment/>
              </TabPane>
              <TabPane
                visible={false}
                tab={`Ho??n tr???`}
                key={`return`}
              >
                <TabReturn/>
              </TabPane>
              <TabPane
                tab={`L???ch s???`}
                key={`history`}
              >
                <TabHistory/>
              </TabPane>
            </Tabs>
          </Col>

          {/*<Col md={3} className={`border-left`}>*/}
          {/*  <List*/}
          {/*    itemLayout="vertical"*/}
          {/*    dataSource={[*/}
          {/*      {po: '#POUA-001', key: 1, status: '??ang x??? l??'},*/}
          {/*      {po: '#POUA-001', key: 2, status: '??ang x??? l??'},*/}
          {/*    ]}*/}
          {/*    renderItem={item => (*/}
          {/*      <List.Item key={item.key}>*/}
          {/*        <p>*/}
          {/*          <a href={`#`}><strong>{item.po}</strong></a>*/}
          {/*        </p>*/}
          {/*        <p className={`text-mute`}>Yoyan | 03/08/2021</p>*/}
          {/*        <p className={`text-mute`}>??ang x??? l??</p>*/}
          {/*      </List.Item>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</Col>*/}
        </Row>
      </Card>
    </Spin>
  )
}

export default OrderDetail;

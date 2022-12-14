import React, {useEffect, useRef, useState} from "react";
import {
  Card,
  Tabs,
  Button,
  Row,
  Col,
  Space,
  message,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  Spin,
  DatePicker,
  Popconfirm, Image, Tag
} from "antd";
import {useParams} from "react-router-dom";
import {
  CloseCircleFilled,
  CreditCardOutlined, DeleteOutlined, DollarCircleFilled,
  LeftOutlined,
  PrinterOutlined, SettingOutlined
} from "@ant-design/icons";
import TabPoDetail from "./po/tab-detail";
import TabPoHistory from "./po/tab-history";
import {
  formWrap,
  MANUAL_CARRIER_LIST,
  PO_PACKING,
  PO_PACKING_DONE,
  PO_STT_DELIVERED,
  PO_STT_DELIVERING,
  PO_STT_WAIT_CONFIRM,
  PO_STT_WAIT_FULFILLMENT,
  PO_STT_WAIT_PICKUP,
  PO_STT_WAIT_TRACKING,
  PO_UN_PACKED, PO_ST_C_DONE, PO_TYPE_EXPORT, PO_TYPE_IMPORT, PO_STT_SUCCESS,
} from "../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {
  GET_PO_DETAIL, PO_CHECK_STOCK_COMPLETE, PO_CONFIRM_DELIVERED,
  PO_CONFIRM_DELIVERING, PO_CONFIRM_STATUS, PO_SET_CANCEL,
  PO_SET_COMPLETED, PO_UPDATE_CARRIER,
  PO_UPDATE_PACKING, PO_UPDATE_SHIPPING_ADDRESS, PO_UPDATE_TRACKING_NUMBER
} from "../../constants/ActionTypes";
import {checkStt, renderNumberFormat} from "../../util/Helper";
import moment from "moment";
import {useReactToPrint} from "react-to-print";
import PoStampPrintContent from "../../components/PoStampPrintContent";
import ProvinceGroup from "../../components/ProvinceGroup";
import StockCheckForm from "./modals/stock-check-form";
import TabStockCheck from "./po/tab-stock-check";
import ModalReturnImport from "./modals/ModalReturnImport";
import ModalReturnExport from "./modals/ModalReturnExport";
import SelectProductWarehouse from "../../components/Input/SelectProductWarehouse";
import SelectWarehouse from "../../components/Input/SelectWarehouse";

const {TabPane} = Tabs;
const PoDetail = (props) => {
  const {poId} = useParams();
  const [state, setState] = useState({
    stampInfo: '',
    shipModal: false,
    codShowing: false,
    carrier: null,
    loading: false,
    stampModal: false,
    trackingModal: false,
    shippingAddress: false,
    bardCodeRows: []
  });
  const [shippingFee, setShippingFee] = useState('');
  const [packages, setPackages] = useState([]);
  const {poDetail, isDetailLoading} = useSelector(({inventory}) => inventory);
  const {carriers} = useSelector(({auth}) => auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [trackingForm] = Form.useForm();
  const [printForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [isVisibleStockCheck, setVisibleStockCheck] = useState(false);
  const [returnVisible, setReturnVisible] = useState(false);
  const stampRef = useRef();
  const getDetail = () => {
    try {
      dispatch({
        type: GET_PO_DETAIL,
        payload: {
          poId
        }
      });
    } catch (e) {
      message.error(e.message);
    }
  }

  const visibleShipModal = () => {
    setState({
      ...state,
      shipModal: true
    })
  };

  const closeShipModal = () => {
    setState({
      ...state,
      shipModal: false
    });
    form.resetFields();
  };

  const showStockCheckModal = (isShow) => {
    setVisibleStockCheck(isShow);
  };

  const onChangeShippingFee = value => {
    setShippingFee(renderNumberFormat(value, '', 'VND'));
  };

  // const setBankMethod = val => {
  //   setState({
  //     ...state,
  //     codShowing: val === PAYMENT_COD
  //   })
  // };

  const setCarrier = val => {
    console.log(val);
    setState({
      ...state,
      carrier: val
    })
  };

  const finishUpdateShipment = (formData) => {
    try {
      dispatch({
        type: PO_UPDATE_CARRIER,
        payload: {
          ...formData,
          poId
        }
      });
      setState({
        ...state,
        shipModal: false
      })
    } catch (e) {
      message.error(e.message);
    }
  };

  const visibleUpdateTrackingModal = () => {
    setState({
      ...state,
      trackingModal: true
    });

    trackingForm.setFieldsValue({
      tracking_number: poDetail.tracking_number
    });
  };

  const submitCarrier = () => {
    try {
      dispatch({
        type: PO_UPDATE_TRACKING_NUMBER,
        payload: {
          poId: poDetail.id
        }
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  const updateTrackingNumberFinish = (formData) => {
    try {
      dispatch({
        type: PO_UPDATE_TRACKING_NUMBER,
        payload: {
          ...formData,
          poId: poDetail.id
        }
      });
      setState({
        ...state,
        trackingModal: false
      });
      form.resetFields();
    } catch (e) {
      message.error(e.message);
    }
  };

  const setCompletedPo = () => {
    dispatch({
      type: PO_SET_COMPLETED,
      payload: {
        poId
      }
    });
  };

  const setPackingStatus = (status) => {
    try {
      dispatch({
        type: PO_UPDATE_PACKING,
        payload: {
          ...{
            packing_status: status
          },
          poId
        }
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  const confirmPo = () => {
    dispatch({
      type: PO_CONFIRM_STATUS,
      payload: {
        poId
      }
    });
  };

  const setStockCheckComplete = () => {
    dispatch({
      type: PO_CHECK_STOCK_COMPLETE,
      payload: {
        poId
      }
    });
  };


  const setDelivered = () => {
    dispatch({
      type: PO_CONFIRM_DELIVERED,
      payload: {
        poId
      }
    });
  };

  const setDelivering = () => {
    try {
      dispatch({
        type: PO_CONFIRM_DELIVERING,
        payload: {
          poId
        }
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  const onPrintStamp = () => {
    let newList = [];
    poDetail.po_items.map(item => {
      newList.push({
        type: item.name,
        id: item.id,
        name: item.title,
        barcode: item.barcode,
        lot_number: item.lot_number,
        quantity: item.quantity
      });
    });
    setPackages(newList);
    printForm.setFieldsValue({packages: newList});
    setState({
      ...state,
      stampModal: true,
      stampInfo: newList
    });
  };

  const onCancelStamp = () => {
    setState({
      ...state,
      stampModal: false
    })
  };

  const renderBarcode = () => {
    const packs = state.stampInfo;
    if (packs.length > 0) {
      const rows = [];
      packs.map((item, index) => {
        for (let i = 0; i < item.quantity; i++) {
          rows.push(
            <PoStampPrintContent id={item.id}
                                 barcode={item.barcode}
                                 number={item.lot_number}
                                 key={`${index}_${i}`}/>
          );
        }
      });
      return rows;
    }
    return null;
  };

  const onChangePrintInput = (qty, key) => {
    const packs = printForm.getFieldValue('packages');
    const obj = packs.find((pack, index) => index === key);
    packs[key].quantity = qty;
    packs[key] = obj;
    printForm.setFieldsValue({packages: packs});
    setState({
      ...state,
      stampInfo: packs
    })
  };

  const onPrintSubmit = useReactToPrint({
    content: () => stampRef.current,
    // pageStyle: `@page {size: 25mm 15mm}`
  });

  const onUpdateAddress = () => {
    addressForm.setFieldsValue(poDetail.address_info);
    setState({
      ...state,
      shippingAddress: true
    });
  };

  const saveAddressInfo = data => {
    dispatch({
      type: PO_UPDATE_SHIPPING_ADDRESS,
      payload: {
        poId: poId,
        shippingAddress: data
      }
    });
    setState({
      ...state,
      shippingAddress: false
    });
  };
  const onPoCancel = () => {
    dispatch({
      type: PO_SET_CANCEL,
      payload: {
        poId: poId
      }
    });
  }
  const onPoReturn = () => {
    setReturnVisible(true)
  }
  useEffect(() => {
    getDetail();

  }, []);

  const renderStatusBtns = () => {
      //TODO t???m th???i b??? ph???n auto carrier
      // const isManualCarrier = MANUAL_CARRIER_LIST.indexOf(poDetail.carrier) >= 0;
      const isManualCarrier = true;

      const isCompleteShow = (poDetail.po_type === PO_TYPE_EXPORT
        || poDetail.stock_check_status === PO_ST_C_DONE)
        && poDetail.status === PO_STT_DELIVERED;

      return <Space>
        {poDetail.status === PO_STT_WAIT_CONFIRM &&
        <Popconfirm title={"?????ng ?? cho ph??p kho x??? l?? v???n ????n"}
                    onConfirm={() => confirmPo()}
        >
          <Button type={`primary`} size={"small"}>
            X??c nh???n ????n h??ng
          </Button>
        </Popconfirm>
        }
        {poDetail.status === PO_STT_WAIT_FULFILLMENT &&
        <Button onClick={visibleShipModal} type={`primary`} size={"small"}>
          C???p nh???p ????n v??? v???n chuy???n
        </Button>
        }
        {poDetail.po_type === PO_TYPE_EXPORT &&
        [PO_STT_WAIT_CONFIRM,
          PO_STT_WAIT_TRACKING,
          PO_STT_WAIT_PICKUP,
          PO_STT_DELIVERING,
          PO_STT_WAIT_FULFILLMENT].includes(poDetail.status)
        &&
        <Popconfirm onConfirm={onPoCancel} title={`Hu??? phi???u xu???t?`}>
          <Button type={`dashed`} danger size={"small"}>
            H???y phi???u
          </Button></Popconfirm>}
        {(poDetail.status === PO_STT_WAIT_TRACKING || poDetail.status === PO_STT_WAIT_PICKUP)
        && poDetail.packing_status === PO_PACKING_DONE &&
        <Button onClick={visibleUpdateTrackingModal} type={`primary`} size={"small"}>
          C???p nh???p v???n ????n
        </Button>}
        {!isManualCarrier &&
        poDetail.status === PO_STT_WAIT_TRACKING
        && poDetail.packing_status === PO_PACKING_DONE &&
        <Popconfirm onConfirm={() => submitCarrier()} title={"X??c nh???n t???o v???n ????n v???i ????n v??? v???n chuy???n"}>
          <Button type={`primary`} size={"small"}>
            X??c nh???n v???i ??VVC
          </Button>
        </Popconfirm>
        }

        {poDetail.status === PO_STT_WAIT_PICKUP &&
        poDetail.packing_status === PO_PACKING_DONE &&
        <Popconfirm onConfirm={setDelivering} title={"X??c nh???n ???? g???i v???n chuy???n"}>
          <Button type={`primary`} size={"small"}>
            ???? g???i v???n chuy???n
          </Button>
        </Popconfirm>
        }
        {poDetail.status === PO_STT_DELIVERING &&
        <Popconfirm onConfirm={setDelivered} title={"X??c nh???n ???? ho??n th??nh v???n chuy???n"}>
          <Button type={`primary`} size={"small"}>
            Ho??n th??nh v???n chuy???n
          </Button>
        </Popconfirm>
        }
        {poDetail.po_type !== PO_TYPE_EXPORT &&
        poDetail.status === PO_STT_DELIVERED &&
        <Button type={"dashed"} size={"small"}
                disabled={poDetail.stock_check_status === PO_ST_C_DONE}
                title={poDetail.stock_check_status === PO_ST_C_DONE ? "V???n ????n ???? ???????c ki???m" : "Ti???n h??nh ki???m s??? l?????ng"}
                onClick={() => showStockCheckModal(true)}>
          Th??m phi???u ki???m
        </Button>}
        {poDetail.po_type !== PO_TYPE_EXPORT &&
        poDetail.status === PO_STT_DELIVERED &&
        poDetail.stock_check_status !== PO_ST_C_DONE &&
        <Popconfirm onConfirm={setStockCheckComplete}
                    title={"X??c nh???n l???i phi???u ki???m tr?????c khi ho??n th??nh!!"}>
          <Button type={"primary"} size={"small"}
                  title={"X??c nh???n ho??n th??nh ki???m h??ng"}>
            Ho??n th??nh ki???m h??ng
          </Button>
        </Popconfirm>
        }
        {checkStt(poDetail.status, [PO_STT_DELIVERED, PO_STT_SUCCESS]) &&
        <Button onClick={() => setReturnVisible(true)} type={`dashed`} danger size={`small`}>Y??u c???u ?????i tr???</Button>
        }
        {poDetail.status === PO_STT_DELIVERED &&
        <Popconfirm disabled={!isCompleteShow} onConfirm={setCompletedPo}
                    title={"Ho??n t???t c???p nh???p s??? li???u v??o kho"}>
          <Button type={"primary"} size={"small"}
                  disabled={!isCompleteShow}
                  title={isCompleteShow ? "C???p nh???p s??? li???u v??o h??? th???ng kho"
                    : "X??c nh???n phi???u ki???m tr?????c khi ho??n th??nh"}>
            Ho??n th??nh
          </Button>
        </Popconfirm>
        }
      </Space>
    }
  ;

  const renderOtherBtns = () => {
      if (poDetail.status === PO_STT_WAIT_CONFIRM) {
        return;
      }

      return <Space>
        {poDetail.packing_status === PO_UN_PACKED &&
        <Popconfirm title={"X??c nh???n ??ang x??? l?? ????ng g??i"}
                    onConfirm={() => setPackingStatus(PO_PACKING)}
        >
          <Button type={`primary`} size={"small"}>
            X??? l?? ????ng g??i
          </Button>
        </Popconfirm>
        }
        {poDetail.packing_status === PO_PACKING &&
        <Popconfirm title={"X??c nh???n ho??n th??nh ????ng g??i"}
                    onConfirm={() => setPackingStatus(PO_PACKING_DONE)}
        >
          <Button type={`primary`} size={"small"}>
            Ho??n th??nh ????ng g??i
          </Button>
        </Popconfirm>}
        {poDetail.status === PO_STT_WAIT_FULFILLMENT && poDetail.po_type === PO_TYPE_EXPORT &&
        <Button onClick={onUpdateAddress} size={"small"} type={`dashed`}>
          C???p nh???t ?????a ch??? nh???n
        </Button>
        }
        {poDetail.po_type === PO_TYPE_IMPORT &&
        <Button onClick={onPrintStamp} type={`dashed`} size={"small"}><PrinterOutlined/> In Tem</Button>
        }
      </Space>
    }
  ;

  const renderStampInput = () => {
      return (
        <>
          <Form form={printForm}>
            <Form.List name={`packages`}>
              {(fields, {add, remove}) => {
                return (
                  <>
                    {fields.map((field, index) => {
                      const packs = printForm.getFieldValue('packages');
                      return (
                        <Row key={`p_${field.key}`}>
                          <Form.Item
                            hidden
                            name={[field.name, 'id']}>
                            <Input/>
                          </Form.Item>
                          <Col md={16}>
                            <Form.Item>
                              <Space direction={"vertical"}>
                                <span>{packs[index].name}</span>
                              </Space>
                            </Form.Item>
                          </Col>
                          <Col md={8} className={`mx-0`}>
                            <Form.Item
                              rules={[{required: true, message: 'S??? l?????ng nh???p b???t bu???c!'}]}
                              label={"SL"}
                              name={[field.name, 'quantity']}>
                              <InputNumber onChange={value => onChangePrintInput(value, index)} style={{width: `100%`}}/>
                            </Form.Item>
                          </Col>
                        </Row>
                      )
                    })}
                  </>
                )
              }}
            </Form.List>
          </Form>
          <div style={{display: "none"}}>
            <div ref={stampRef}>
              {renderBarcode()}
            </div>
          </div>
        </>
      )
    }
  ;

  return (
    <div>
      <Card
        size={'small'}
        title={<Button type={"link"}
                       className="m-0"
                       key="btn_back"
                       onClick={props.history.goBack} icon={<LeftOutlined/>}>
          Quay l???i
        </Button>}
        extra={<Space>
          {renderOtherBtns()}
          {renderStatusBtns()}
        </Space>}
      >
        <Spin spinning={isDetailLoading}>
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
                  <TabPoDetail
                    isLoading={isDetailLoading}
                    getDetail={getDetail}
                    po={poDetail}/>
                </TabPane>
                <TabPane
                  tab={`Phi???u ki???m`}
                  key={`stock_check`}
                >
                  <TabStockCheck
                    po={poDetail}/>
                </TabPane>
                <TabPane
                  tab={`L???ch s???`}
                  key={`history`}
                >
                  <TabPoHistory/>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Spin>
      </Card>
      <Modal
        visible={state.shipModal}
        onCancel={closeShipModal}
        footer={<Space>
          <small className={`text-note danger`}>* Th??ng tin b???t bu???c</small>
          <Button onClick={closeShipModal}>H???y</Button>
          <Button form={`form-shipment`} htmlType={`submit`} type={`primary`}>L??u</Button>
        </Space>}
        title={`Th??m nh?? v???n chuy???n`}>
        <Form
          form={form}
          onFinish={finishUpdateShipment}
          id={`form-shipment`}
          {...{
            ...formWrap,
            labelCol: {
              sm: {span: 8},
            }
          }}
        >
          <Row>
            <Col md={24}>
              <Form.Item
                name={`carrier`}
                rules={[{required: true, message: 'Ch???n nh?? v???n chuy???n'}]}
                label={`Nh?? v???n chuy???n`}
              >
                <Select onChange={setCarrier}>
                  {carriers.map(item =>
                    <Select.Option key={`op_carrier_${item.code}`}
                                   value={item.code}>
                      {item.name} - {renderNumberFormat(item.default_price, '', ' VND')}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item
                name={`shipping_fee`}
                initialValue={0}
                label={`Ph?? v???n chuy???n`}
              >
                <Space direction={"vertical"} size={'small'} style={{width: '100%'}}>
                  <InputNumber defaultValue={0} style={{width: '100%'}} onChange={onChangeShippingFee}/>
                  <small className="text-muted">{shippingFee}</small>
                </Space>
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item
                initialValue={moment(new Date(), 'DD/MM/YYYY')}
                name={`expected_date`}
                label={`Ng??y d??? ki???n ?????n`}
              >
                <DatePicker style={{width: '100%'}}
                            format={'DD/MM/YYYY'}
                            defaultValue={moment(new Date(), 'DD/MM/YYYY')}/>
              </Form.Item>
            </Col>
            {MANUAL_CARRIER_LIST.indexOf(state.carrier) >= 0 && <Col md={24}>
              <Form.Item
                name={`tracking_number`}
                label={`M?? v???n ????n`}
              >
                <Input/>
              </Form.Item>
            </Col>}
            <Col md={24}>
              <Form.Item
                name={`carrier_note`}
                label={`Ghi ch?? giao h??ng`}
              >
                <Input.TextArea/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        footer={<Space>
          <small className={`text-note danger`}>* th??ng tin b???t bu???c</small>
          <Button onClick={onCancelStamp}>????ng</Button>
          <Button onClick={onPrintSubmit}>In</Button>
        </Space>}
        onCancel={onCancelStamp}
        visible={state.stampModal}
        title={`In Tem`}
      >
        {renderStampInput()}

      </Modal>
      <Modal
        onCancel={() => setState({...state, shippingAddress: false})}
        title={`C???p nh???t ?????a ch??? nh???n h??ng `}
        visible={state.shippingAddress}
        footer={<Space>
          <small className={`text-note danger`}>* Th??ng tin b???t bu???c</small>
          <Button onClick={() => setState({...state, shippingAddress: false})}>H???y</Button>
          <Button loading={isDetailLoading} form={`address-form`} htmlType={`submit`} type={`primary`}>L??u</Button>
        </Space>}
      >
        <Form
          onFinish={saveAddressInfo}
          {...formWrap}
          id={`address-form`}
          form={addressForm}>
          <Form.Item
            name={`shipping_name`}
            label={`Ng?????i nh???n`}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={`shipping_phone`}
            label={`??i???n tho???i`}
          >
            <Input/>
          </Form.Item>
          <ProvinceGroup
            wardCode={`shipping_ward_code`}
            wardName={`shipping_ward`}
            districtCode={`shipping_district_code`}
            districtName={`shipping_district`}
            cityName={`shipping_province`}
            cityCode={`shipping_province_code`}
            form={addressForm}
          />
          <Form.Item
            name={`shipping_address1`}
            label={`?????a ch???`}
          >
            <Input.TextArea/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={
          <Space>
            <Button onClick={() => setState({...state, modalVisible: false})}>H???y</Button>
            <Button form={`tracking-form`} htmlType={`submit`}
                    type={`primary`}>L??u</Button>
          </Space>
        }
        visible={state.trackingModal}
        onCancel={() => setState({...state, trackingModal: false})}
        title={`C???p nh???t m?? v???n ????n`}>
        <Form
          id={`tracking-form`}
          onFinish={updateTrackingNumberFinish}
          form={trackingForm}
          {...formWrap}
        >
          <Form.Item
            name={`tracking_number`}
            label={`M?? v???n ????n`}>
            <Input placeholder={`M?? v???n ????n...`}/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        forceRender
        footer={false}
        visible={isVisibleStockCheck}
        onCancel={() => setVisibleStockCheck(false)}
        title={`T???o phi???u ki???m h??ng`}>
        <StockCheckForm po={poDetail} showModal={showStockCheckModal}/>
      </Modal>
      <Modal
        maskClosable={false}
        width={`100%`}
        onCancel={() => setReturnVisible(false)}
        visible={returnVisible}
        footer={[
          <Button type={`default`} onClick={() => setReturnVisible(false)}>H???y</Button>,
          <Button htmlType={`submit`} form={`form-refund-import`} type={`primary`}>T???o phi???u</Button>,
        ]}
        title={`Y??u c???u ?????i tr???`}>
        {poDetail.po_type === PO_TYPE_IMPORT ? <ModalReturnImport
          setVisible={setReturnVisible}
          po={poDetail}
        /> : <ModalReturnExport
          setVisible={setReturnVisible}
          po={poDetail}
        />}
      </Modal>
    </div>
  )
}
export default PoDetail;

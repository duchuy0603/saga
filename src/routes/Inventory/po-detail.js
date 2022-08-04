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
      //TODO tạm thời bỏ phần auto carrier
      // const isManualCarrier = MANUAL_CARRIER_LIST.indexOf(poDetail.carrier) >= 0;
      const isManualCarrier = true;

      const isCompleteShow = (poDetail.po_type === PO_TYPE_EXPORT
        || poDetail.stock_check_status === PO_ST_C_DONE)
        && poDetail.status === PO_STT_DELIVERED;

      return <Space>
        {poDetail.status === PO_STT_WAIT_CONFIRM &&
        <Popconfirm title={"Đồng ý cho phép kho xử lý vận đơn"}
                    onConfirm={() => confirmPo()}
        >
          <Button type={`primary`} size={"small"}>
            Xác nhận đơn hàng
          </Button>
        </Popconfirm>
        }
        {poDetail.status === PO_STT_WAIT_FULFILLMENT &&
        <Button onClick={visibleShipModal} type={`primary`} size={"small"}>
          Cập nhập Đơn vị vận chuyển
        </Button>
        }
        {poDetail.po_type === PO_TYPE_EXPORT &&
        [PO_STT_WAIT_CONFIRM,
          PO_STT_WAIT_TRACKING,
          PO_STT_WAIT_PICKUP,
          PO_STT_DELIVERING,
          PO_STT_WAIT_FULFILLMENT].includes(poDetail.status)
        &&
        <Popconfirm onConfirm={onPoCancel} title={`Huỷ phiếu xuất?`}>
          <Button type={`dashed`} danger size={"small"}>
            Hủy phiếu
          </Button></Popconfirm>}
        {(poDetail.status === PO_STT_WAIT_TRACKING || poDetail.status === PO_STT_WAIT_PICKUP)
        && poDetail.packing_status === PO_PACKING_DONE &&
        <Button onClick={visibleUpdateTrackingModal} type={`primary`} size={"small"}>
          Cập nhập vận đơn
        </Button>}
        {!isManualCarrier &&
        poDetail.status === PO_STT_WAIT_TRACKING
        && poDetail.packing_status === PO_PACKING_DONE &&
        <Popconfirm onConfirm={() => submitCarrier()} title={"Xác nhận tạo vận đơn với đơn vị vận chuyển"}>
          <Button type={`primary`} size={"small"}>
            Xác nhận với ĐVVC
          </Button>
        </Popconfirm>
        }

        {poDetail.status === PO_STT_WAIT_PICKUP &&
        poDetail.packing_status === PO_PACKING_DONE &&
        <Popconfirm onConfirm={setDelivering} title={"Xác nhận đã gửi vận chuyển"}>
          <Button type={`primary`} size={"small"}>
            Đã gửi vận chuyển
          </Button>
        </Popconfirm>
        }
        {poDetail.status === PO_STT_DELIVERING &&
        <Popconfirm onConfirm={setDelivered} title={"Xác nhận đã hoàn thành vận chuyển"}>
          <Button type={`primary`} size={"small"}>
            Hoàn thành vận chuyển
          </Button>
        </Popconfirm>
        }
        {poDetail.po_type !== PO_TYPE_EXPORT &&
        poDetail.status === PO_STT_DELIVERED &&
        <Button type={"dashed"} size={"small"}
                disabled={poDetail.stock_check_status === PO_ST_C_DONE}
                title={poDetail.stock_check_status === PO_ST_C_DONE ? "Vận đơn đã được kiểm" : "Tiến hành kiểm số lượng"}
                onClick={() => showStockCheckModal(true)}>
          Thêm phiếu kiểm
        </Button>}
        {poDetail.po_type !== PO_TYPE_EXPORT &&
        poDetail.status === PO_STT_DELIVERED &&
        poDetail.stock_check_status !== PO_ST_C_DONE &&
        <Popconfirm onConfirm={setStockCheckComplete}
                    title={"Xác nhận lại phiếu kiểm trước khi hoàn thành!!"}>
          <Button type={"primary"} size={"small"}
                  title={"Xác nhận hoàn thành kiểm hàng"}>
            Hoàn thành kiểm hàng
          </Button>
        </Popconfirm>
        }
        {checkStt(poDetail.status, [PO_STT_DELIVERED, PO_STT_SUCCESS]) &&
        <Button onClick={() => setReturnVisible(true)} type={`dashed`} danger size={`small`}>Yêu cầu đổi trả</Button>
        }
        {poDetail.status === PO_STT_DELIVERED &&
        <Popconfirm disabled={!isCompleteShow} onConfirm={setCompletedPo}
                    title={"Hoàn tất cập nhập số liệu vào kho"}>
          <Button type={"primary"} size={"small"}
                  disabled={!isCompleteShow}
                  title={isCompleteShow ? "Cập nhập số liệu vào hệ thống kho"
                    : "Xác nhận phiếu kiểm trước khi hoàn thành"}>
            Hoàn thành
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
        <Popconfirm title={"Xác nhận đang xử lý đóng gói"}
                    onConfirm={() => setPackingStatus(PO_PACKING)}
        >
          <Button type={`primary`} size={"small"}>
            Xử lý đóng gói
          </Button>
        </Popconfirm>
        }
        {poDetail.packing_status === PO_PACKING &&
        <Popconfirm title={"Xác nhận hoàn thành đóng gói"}
                    onConfirm={() => setPackingStatus(PO_PACKING_DONE)}
        >
          <Button type={`primary`} size={"small"}>
            Hoàn thành Đóng gói
          </Button>
        </Popconfirm>}
        {poDetail.status === PO_STT_WAIT_FULFILLMENT && poDetail.po_type === PO_TYPE_EXPORT &&
        <Button onClick={onUpdateAddress} size={"small"} type={`dashed`}>
          Cập nhật địa chỉ nhận
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
                              rules={[{required: true, message: 'Số lượng nhập bắt buộc!'}]}
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
          Quay lại
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
                  tab={`Chi tiết`}
                  key={`detail`}
                >
                  <TabPoDetail
                    isLoading={isDetailLoading}
                    getDetail={getDetail}
                    po={poDetail}/>
                </TabPane>
                <TabPane
                  tab={`Phiếu kiểm`}
                  key={`stock_check`}
                >
                  <TabStockCheck
                    po={poDetail}/>
                </TabPane>
                <TabPane
                  tab={`Lịch sử`}
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
          <small className={`text-note danger`}>* Thông tin bắt buộc</small>
          <Button onClick={closeShipModal}>Hủy</Button>
          <Button form={`form-shipment`} htmlType={`submit`} type={`primary`}>Lưu</Button>
        </Space>}
        title={`Thêm nhà vận chuyển`}>
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
                rules={[{required: true, message: 'Chọn nhà vận chuyển'}]}
                label={`Nhà vận chuyển`}
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
                label={`Phí vận chuyển`}
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
                label={`Ngày dự kiến đến`}
              >
                <DatePicker style={{width: '100%'}}
                            format={'DD/MM/YYYY'}
                            defaultValue={moment(new Date(), 'DD/MM/YYYY')}/>
              </Form.Item>
            </Col>
            {MANUAL_CARRIER_LIST.indexOf(state.carrier) >= 0 && <Col md={24}>
              <Form.Item
                name={`tracking_number`}
                label={`Mã vận đơn`}
              >
                <Input/>
              </Form.Item>
            </Col>}
            <Col md={24}>
              <Form.Item
                name={`carrier_note`}
                label={`Ghi chú giao hàng`}
              >
                <Input.TextArea/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        footer={<Space>
          <small className={`text-note danger`}>* thông tin bắt buộc</small>
          <Button onClick={onCancelStamp}>Đóng</Button>
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
        title={`Cập nhật địa chỉ nhận hàng `}
        visible={state.shippingAddress}
        footer={<Space>
          <small className={`text-note danger`}>* Thông tin bắt buộc</small>
          <Button onClick={() => setState({...state, shippingAddress: false})}>Hủy</Button>
          <Button loading={isDetailLoading} form={`address-form`} htmlType={`submit`} type={`primary`}>Lưu</Button>
        </Space>}
      >
        <Form
          onFinish={saveAddressInfo}
          {...formWrap}
          id={`address-form`}
          form={addressForm}>
          <Form.Item
            name={`shipping_name`}
            label={`Người nhận`}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={`shipping_phone`}
            label={`Điện thoại`}
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
            label={`Địa chỉ`}
          >
            <Input.TextArea/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={
          <Space>
            <Button onClick={() => setState({...state, modalVisible: false})}>Hủy</Button>
            <Button form={`tracking-form`} htmlType={`submit`}
                    type={`primary`}>Lưu</Button>
          </Space>
        }
        visible={state.trackingModal}
        onCancel={() => setState({...state, trackingModal: false})}
        title={`Cập nhật mã vận đơn`}>
        <Form
          id={`tracking-form`}
          onFinish={updateTrackingNumberFinish}
          form={trackingForm}
          {...formWrap}
        >
          <Form.Item
            name={`tracking_number`}
            label={`Mã vận đơn`}>
            <Input placeholder={`Mã vận đơn...`}/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        forceRender
        footer={false}
        visible={isVisibleStockCheck}
        onCancel={() => setVisibleStockCheck(false)}
        title={`Tạo phiếu kiểm hàng`}>
        <StockCheckForm po={poDetail} showModal={showStockCheckModal}/>
      </Modal>
      <Modal
        maskClosable={false}
        width={`100%`}
        onCancel={() => setReturnVisible(false)}
        visible={returnVisible}
        footer={[
          <Button type={`default`} onClick={() => setReturnVisible(false)}>Hủy</Button>,
          <Button htmlType={`submit`} form={`form-refund-import`} type={`primary`}>Tạo phiếu</Button>,
        ]}
        title={`Yêu cầu đổi trả`}>
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

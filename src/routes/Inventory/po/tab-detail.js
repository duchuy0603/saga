import React, {useEffect, useRef, useState} from "react";
import {
  Divider, Space, Modal,
  Row, Col, Table, Steps,
  Button, Descriptions, Image, Form, Typography, Popconfirm
} from 'antd';
import {
  FilePdfOutlined,
  PrinterOutlined,
  MailOutlined, TagOutlined, EnvironmentOutlined,
  CarOutlined, PhoneOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {
  dateTimeFromString,
  defaultImage,
  getEmpty,
  renderNumberFormat, renderPoPackingStatus,
  renderPOStatus, renderPOStockCheck, renderPOType, toInt,
  toPrice
} from "../../../util/Helper";
import {
  findTexExport, findTextImport,
  PO_STT_WAIT_TRACKING, PO_TYPE_EXPORT,
  PO_TYPE_IMPORT, stepExport, stepImport
} from "../../../constants/constant";
import {useDispatch, useSelector} from "react-redux";
import {
  PO_APPLY_BRAND,
} from "../../../constants/ActionTypes";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import PoTrackingPrintContent from "../../../components/PoTrackingPrintContent";
import SelectBrand from "../../../components/Input/SelectBrand";
import {reqSavePrintCount} from "../../../appRedux/services/inventory";
import {onCountPrint} from "../../../appRedux/actions";

const {Step} = Steps;

const TabPoDetail = ({...props}) => {
  const {po, isLoading} = props;
  const {carriers} = useSelector(({auth}) => auth);
  const [brandSelected, setBrandSelected] = useState(null);
  const [state, setState] = useState({
    modalVisible: false,
    modalCheckStock: false,
    modalBrand: false
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const refPoPrintContent = useRef();
  const handlePrint = useReactToPrint({
    onBeforePrint: () => onCountPrint([po]),
    content: () => refPoPrintContent.current
  });
  useEffect(() => {
    form.setFieldsValue({
      tracking_number: po.tracking_number
    });
  }, [props]);

  const renderShipTo = () => {
    const {address_info} = po;
    if (!address_info) {
      return <span>Không tồn tại địa chỉ nhận</span>
    }
    return (
      <Space direction={"vertical"} size={'small'}>
        <span>
         <EnvironmentOutlined />
          <Space size={"small"} split={','} wrap>
            <span>{address_info.shipping_address1}</span>
            <span>{address_info.shipping_ward}</span>
            <span>{address_info.shipping_district}</span>
            <span>
              {address_info.shipping_province ?
                address_info.shipping_province :
                address_info.shipping_city
              }
            </span>
          </Space>
        </span>
        <span>
            <PhoneOutlined />
            <a href={`tel:${address_info.shipping_phone}`}>{getEmpty(address_info.shipping_phone)}</a>
          </span>
      </Space>
    );
  };

  const renderCarrier = () => {
    const carrier = carriers.find(item =>
      item.code === po.carrier);
    if (!carrier) {
      return '---'
    }
    return carrier.name;
  };

  const renderShipToName = () => {
    if (!po.address_info) {
      return <span>Không tồn tại người nhận</span>
    }
    if (po.po_type === PO_TYPE_IMPORT) {
      return po.wh_to_name;
    }
    return po.address_info.shipping_name;
  };

  const updateBrand = () => {
    setState({
      ...state,
      modalBrand: true
    });
  };

  const savePoBrand = () => {
    if (brandSelected) {
      dispatch({
        type: PO_APPLY_BRAND,
        payload: {
          brand_id: brandSelected,
          poId: po.id
        }
      });

      if (!isLoading) {
        setState({
          ...state,
          modalBrand: false
        });
      }
    }
  };

  const renderImportStep = () => {
    return (
      <Steps size={`small`} className={`step-line`}>
        {stepImport.map((step, index) => {
          return <Step
            key={index}
            description={findTextImport(po[step.stt], step.description)}
            icon={step.icon(toInt(po[step.stt]))}
            title={step.title} />
        })}
      </Steps>
    )
  };
  const renderExportStep = () => {
    return (
      <Steps size={`small`} className={`step-line`}>
        {stepExport.map((step, index) => {
          return <Step
            key={index}
            description={findTexExport(po[step.stt], step.description)}
            icon={step.icon(toInt(po[step.stt]))}
            title={step.title} />
        })}
      </Steps>
    )
  };

  return (
    <div>
      <div style={{display: "none"}}>
        <PoTrackingPrintContent
          po={po}
          ref={refPoPrintContent} />
      </div>

      {po.po_type === PO_TYPE_IMPORT ? renderImportStep() : renderExportStep()}
      <Typography.Title level={5}><IdcardOutlined /> Thông đơn chung</Typography.Title>
      <div className={`d-flex`}>
        <Descriptions column={2}>
          <Descriptions.Item label={<b>Phiếu</b>}>
            <span className="mr-1">#PO-UOA{po.id}</span>
            {renderPOType(po.po_type)}
          </Descriptions.Item>
          <Descriptions.Item label={<b>Trạng thái</b>}>
            <span>{renderPOStatus(po.status)}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<b>Đóng gói:</b>}>
            {renderPoPackingStatus(po.packing_status)}
          </Descriptions.Item>
          <Descriptions.Item label={<b>Ngày hoàn thành đóng gói:</b>}>
            <span>{po.ready_to_pick_date}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<b>Kiểm:</b>}>
            {renderPOStockCheck(po.po_type, po.stock_check_status)}
          </Descriptions.Item>
          <Descriptions.Item label={<b>Ngày hoàn thành kiểm:</b>}>
            <span>{po.stock_check_time}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<b>Nơi gửi</b>}>
            <span>{po.wh_from_name}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<b>Ngày đặt hàng</b>}>
            {dateTimeFromString(po.order_date)}
          </Descriptions.Item>
          <Descriptions.Item label={<b>Nơi nhận</b>}>
            {renderShipToName()}
          </Descriptions.Item>
          <Descriptions.Item label={<b>Địa chỉ nhận</b>}>
            {renderShipTo()}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Divider />

      {po.po_type === PO_TYPE_EXPORT ?
        <div>
          <Typography.Title level={5}>
            <TagOutlined /> Thông tin nhãn hàng
            <Button onClick={updateBrand} className={`ml-1`} color={`primary`} danger size={`small`} type={`dashed`}>Cập
              nhận nhãn</Button>
          </Typography.Title>
          {po.brand &&
          <div>
            <Descriptions column={4}>
              <Descriptions.Item label={<b>Nhãn hàng</b>}>{getEmpty(po.brand.name)}</Descriptions.Item>
              <Descriptions.Item label={<b>Code</b>}>{getEmpty(po.brand.code[0])}</Descriptions.Item>
              <Descriptions.Item label={<b>Địa chỉ</b>}>{getEmpty(po.brand.address)}</Descriptions.Item>
              <Descriptions.Item label={<b>Điện thoại</b>}><a
                href={`tel:${po.brand.phone}`}>{po.brand.phone}</a></Descriptions.Item>
            </Descriptions>
          </div>
          }
          <Divider />
          <Typography.Title level={5}><CarOutlined /> Thông tin giao hàng</Typography.Title>
          <Descriptions column={3}>
            <Descriptions.Item label={<b>Kho lấy hàng</b>}>{po.wh_from_name}</Descriptions.Item>
            <Descriptions.Item label={<b>Đơn vị vận chuyển</b>}>
              <span>{renderCarrier()}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<b>Mã vận đơn</b>}>{getEmpty(po.tracking_number)}</Descriptions.Item>
            <Descriptions.Item label={<b>Trạng thái vận chuyển</b>}>
              <span>{po.carrier_status ? po.carrier_status : "---"}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<b>Phí vận chuyển</b>}>
              <span>{renderNumberFormat(po.shipping_fee, null, 'đ')}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<b>Tiền thu hộ</b>}>
              {renderNumberFormat(po.cod, '', 'đ')}
            </Descriptions.Item>
            <Descriptions.Item label={<b>Ngày giao</b>}>
              <span>{dateTimeFromString(po.delivering_date)}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<b>Ngày nhận</b>}>
              <span>{dateTimeFromString(po.delivered_date)}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<b>Ghi chú giao hàng</b>}>
              <span>{getEmpty(po.carrier_note)}</span>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions column={2}>
            <Descriptions.Item>
              {po.status === PO_STT_WAIT_TRACKING
              && <Button danger type={`dashed`} size={"small"}><PrinterOutlined /> Hủy giao hàng</Button>}
            </Descriptions.Item>
            <Descriptions.Item className={`flex-end`}>
              <Popconfirm onConfirm={handlePrint} title={`In vận đơn?`}>
                <Button type={`dashed`}
                        size={"small"}>
                  <PrinterOutlined /> In vận đơn</Button>
              </Popconfirm>
            </Descriptions.Item>
          </Descriptions>
        </div>
        : null}
      <Table
        dataSource={po.po_items}
        rowKey={'id'}
        columns={[
          {title: 'ID', dataIndex: 'id', key: 'id', render: id => `#${id}`},
          {
            title: 'Sản phẩm', dataIndex: 'title', key: 'title',
            render: (title, raw) => {
              return (
                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                  <Image
                    width={50}
                    height={50}
                    src="error"
                    fallback={defaultImage()}
                  />
                  <Space className={`pl-1`} size={1} direction={'vertical'}>
                    <Link to={`/product/${raw.product_id}`}>
                      {title}
                    </Link>
                    <small>Barcode: {raw.barcode}</small>
                    <small>Trọng lượng: {raw.weight}</small>
                  </Space>
                </div>
              )
            }
          },
          {title: 'Số lượng yêu cầu', dataIndex: 'quantity', key: 'quantity'},
          {
            title: 'Đã nhận', render: raw => {
              return renderNumberFormat(raw.stock_quantity);
            }
          },
          {title: 'Giá nhập', dataIndex: 'price_original', key: 'price_original', render: p => renderNumberFormat(p)},
          {
            title: 'Thành tiền', render: raw => {
              return renderNumberFormat(raw.price_original * raw.quantity);
            }
          },
        ]}
        footer={() => {
          return (
            <Row>
              <Col md={12}>
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
              <Col md={12}>
                <Row>
                  <Col md={12}><b>Tổng cộng :</b></Col>
                  <Col className={`text-right`} md={12}>{toPrice(po.total_line_items_price)}</Col>
                  <Col md={12}><b>Giảm giá :</b></Col>
                  <Col className={`text-right`} md={12}>{toPrice(po.total_discount)}</Col>
                  <Col md={12}><b>Thành tiền :</b></Col>
                  <Col className={`text-right`} md={12}>{toPrice(po.total_price)}</Col>
                </Row>
              </Col>
            </Row>
          )
        }}
      />
      <Modal
        onCancel={() => setState({...state, modalBrand: false})}
        visible={state.modalBrand}
        title={`Nhãn hàng`}
        footer={<Space>
          <small>* thông tin bắt buộc</small>
          <Button onClick={() => setState({...state, modalBrand: false})}>Hủy</Button>
          <Button loading={isLoading} type={`primary`} onClick={savePoBrand}>Lưu</Button>
        </Space>}
      >
        <SelectBrand onSelect={setBrandSelected} style={{width: '100%'}} />
      </Modal>
    </div>
  )
};

export default TabPoDetail;

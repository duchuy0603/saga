import React, {useEffect, useRef, useState} from "react";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber, Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table
} from "antd";
import {ADJ_CANCEL, ADJ_CONFIRM, ADJ_CREATE, GET_PO, PO_TRANSFER_CREATE} from "../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";
import {ADJUSTMENT_CANCEL, ADJUSTMENT_CONFIRM, formWrap, PO_TYPE_TRANSFER} from "../../constants/constant";
import FilterTransfer from "./filter/filter-transfer";
import {Link} from "react-router-dom";
import {
  dateTimeFromString,
  defaultFormatDateTime, defaultImage,
  renderCarrier,
  renderPoPackingStatus,
  renderPOStatus, renderPOStockCheck, renderPOType
} from "../../util/Helper";
import {MinusOutlined, PrinterOutlined} from "@ant-design/icons";
import {useReactToPrint} from "react-to-print";
import {onCountPrint} from "../../appRedux/actions";
import PoTrackingPrintContent from "../../components/PoTrackingPrintContent";
import SelectWarehouse from "../../components/Input/SelectWarehouse";
import SelectProduct from "../../components/Input/SelectProduct";

const TabTransfer = ({...props}) => {
  const {purchaseOrders, listLoading, pagination} = useSelector(({inventory}) => inventory);
  const {carriers} = useSelector(({auth}) => auth);
  const [searchForm] = Form.useForm();
  const dispatch = useDispatch();
  const refPoPrintContent = useRef();
  //transfer state
  const [modalVisible, setModalVisible] = useState(false);
  const [packages, setPackages] = useState([]);
  const [transferForm] = Form.useForm()
  const [current, setCurrent] = useState(null);
  const [whFromId, setWhFromId] = useState([]);
  //end

  const handlePrint = useReactToPrint({
    onAfterPrint: () => onCountPrint(purchaseOrders),
    content: () => refPoPrintContent.current
  });

  useEffect(() => {
    getPurchaseOrders();
  }, []);

  const getPurchaseOrders = (params = {}) => {
    const fValues = searchForm.getFieldsValue();
    const getParams = {
      ...params,
      ...fValues,
      po_type: PO_TYPE_TRANSFER
    };

    dispatch({
      type: GET_PO,
      payload: getParams
    });
  };

  const onChangePage = ({current, pageSize}) => {
    getPurchaseOrders({page: current});
  };
  const removeItemPackage = item => {
    let packages = transferForm.getFieldValue('items');
    packages = packages.filter(index => index.product_id !== item.product_id);
    transferForm.setFieldsValue({
      'items': packages
    });
    setPackages(packages);
  }

  const onSelectProduct = (value, products) => {
    const index = products.findIndex(item => item.id === value);
    const variants = products[index].childrens;
    let packs = [];
    if (variants.length > 0) {
      variants.map(item => {
        packs.push({
          product_id: item.id,
          name: item.name,
          quantity: 1,
          product_parent_id: item.parent_id,
          warehouse_id: transferForm.getFieldValue('warehouse_id')
        })
      })
    }
    setCurrent(products[index]);
    transferForm.setFieldsValue({
      'items': packs
    });
    setPackages(packages);
  }

  const renderExpandedRow = row => {
    return <div>
      <p>Lý do điều chỉnh: {row.reason}</p>
      <Table
        size={`small`}
        pagination={false}
        dataSource={row.adjust_items ?? []}
        columns={[
          {
            title: 'Sản phẩm', dataIndex: 'product_id', key: 'product_id', render: (pId, raw) => {
              return <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                <Image
                  width={50}
                  height={50}
                  src={raw.image_url}
                  fallback={defaultImage()}
                />
                <Space className={`pl-1`} size={1} direction={`vertical`}>
                  <Link to={`/product/${raw.id}`}>
                    <small>#{raw.id}.{raw.name}</small>
                  </Link>
                  <small>Barcode: {raw.barcode}</small>
                  <small>Trọng lượng: {raw.weight}</small>
                </Space>
              </div>
            }
          },

          {title: 'Số lượng', dataIndex: 'product_id', key: 'product_id'},
        ]}
      />
    </div>
  }
  const onSubmitTransfer = data => {
    dispatch({
      type: PO_TRANSFER_CREATE,
      payload: data
    });
    transferForm.resetFields();
    setModalVisible(false);
  }

  return (
    <>
      <Spin spinning={listLoading}>
        <FilterTransfer form={searchForm} onFinishForm={getPurchaseOrders}/>
        <div style={{display: "none"}}>
          <PoTrackingPrintContent
            multiple
            ref={refPoPrintContent}
            po={purchaseOrders}/>
        </div>

        <Space align={`center`}>
          <Popconfirm onConfirm={handlePrint} title={`In toàn bộ phiếu hiển thị?`}>
            <Button className={`m-0`} type={`dashed`} size={`small`}>
              <PrinterOutlined/> In vận đơn
            </Button>
          </Popconfirm>
          {/*<Checkbox onChange={e => getPurchaseOrders({print_count: e.target.checked ? 0 : null})} className={'ml-1'}>*/}
          {/*  Phiếu chưa in</Checkbox>*/}

          <Button className={`m-0`} type={`primary`} size={`small`} onClick={() => setModalVisible(true)}>
            Tạo phiếu điều chuyển
          </Button>
        </Space>

        <Table
          onChange={onChangePage}
          dataSource={purchaseOrders}
          pagination={pagination}
          columns={[
            {
              title: "Phiếu xuất",
              dataIndex: 'id',
              key: 'id',
              render: (id, r) => {
                return <Space size={"small"} direction={"vertical"}>
                  <Link to={`/inventory/po/${id}`}>#PO-UOA{id}</Link>
                  <small className='text-mute'>Loại: {renderPOType(r.po_type)}</small>
                </Space>
              }
            },
            {
              title: "Kho",
              dataIndex: 'wh_from_name',
              key: 'wh_from_name',
              render: (w, r) => {
                let to = "---";
                if (!r.address_info) {
                  to = r.address_info?.shipping_name;
                }
                return <Space size={"small"} direction={"vertical"}>
                  <small>Từ: {w}</small>
                  <small>Đến: {r.wh_to_name}</small>
                </Space>;
              }
            },
            {
              title: "Trạng thái", dataIndex: 'status', key: 'status', render: (status) => {
                return renderPOStatus(status);
              }
            },
            {
              title: "ĐVVC",
              dataIndex: 'carrier',
              key: 'carrier',
              render: (key, raw) => {
                return <Space size={"small"} direction={"vertical"}>
                  <span>{renderCarrier(key, carriers)}</span>
                  <small>Mã vận đơn: {raw.tracking_number}</small>
                </Space>
              }
            },
            {
              title: "Đóng gói",
              dataIndex: 'packing_status',
              key: 'packing_status',
              render: (key, raw) =>
                renderPoPackingStatus(raw.packing_status)
            },
            {
              title: "Kiểm hàng",
              dataIndex: 'stock_check_status',
              key: 'stock_check_status',
              render: (key, raw) =>
                renderPOStockCheck(raw.po_type, key)
            },
            {
              title: "Ngày tạo",
              dataIndex: 'created_at',
              key: 'created_at',
              render: value => dateTimeFromString(value
                , defaultFormatDateTime
                , ""
                , {
                  'fontSize': "12px"
                }
              )
            },
          ]}
        />
      </Spin>
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={<Space>
          <Button onClick={() => setModalVisible(false)} type={`default`}>Hủy</Button>
          <Button form={`warehouse-transfer-form`} htmlType={`submit`} type={`primary`}>Lưu</Button>
        </Space>}
        title={`Tạo phiếu điều chuyển kho`}>
        <Form onFinish={onSubmitTransfer} {...formWrap} form={transferForm} id={`warehouse-transfer-form`}>
          <Form.Item rules={[{required: true}]} label={`Kho đi`} name={`warehouse_from`}>
            <SelectWarehouse onChange={val => {
              setWhFromId(val);
              transferForm.resetFields(['warehouse_to'])
            }} showAll={false}/>
          </Form.Item>
          <Form.Item rules={[{required: true}]} label={`Kho đến`} name={`warehouse_to`}>
            <SelectWarehouse
              excludes={[whFromId]}
              showAll={false}
            />
          </Form.Item>
          <Form.Item rules={[{required: true}]} label={`Ghi chú`} name={`take_note`}>
            <Input.TextArea rows={4} placeholder={`Ghi chú...`}/>
          </Form.Item>
          <Form.Item label={`Sản phẩm chuyển kho`}>
            <SelectProduct onSelect={onSelectProduct}/>
          </Form.Item>
          <div className={`d-flex align-center`}><Image width={40} height={40}
                                                        src={current?.image_url}/><b>{current?.name}</b></div>
          <Form.List name={'items'}>
            {(fields, {add, remove}) => {
              return (
                <>
                  <Divider/>
                  {fields.map((field, index) => {
                    const packs = transferForm.getFieldValue('items');
                    return (
                      <Row key={`p_${field.key}`}>
                        <Form.Item
                          hidden
                          name={[field.name, 'product_id']}>
                          <Input/>
                        </Form.Item>
                        <Col md={12}>
                          <Form.Item>
                            {packs[index].name}
                          </Form.Item>
                        </Col>
                        <Col md={8} className={`mx-0`}>
                          <Form.Item
                            rules={[{required: true, message: 'Số lượng nhập bắt buộc!'}]}
                            label={"SL"}
                            initialValue={``}
                            name={[field.name, 'quantity']}>
                            <InputNumber min={1} style={{width: `100%`}}/>
                          </Form.Item>
                        </Col>

                        <Col md={2} className={`mx-0`}>
                          <Form.Item>
                            <Space>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  remove(field.name);
                                  removeItemPackage(packs[index]);
                                }}
                                icon={<MinusOutlined/>}
                              />
                            </Space>
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
      </Modal>
    </>

  )
};
export default TabTransfer;

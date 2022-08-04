import {Button, Col, Form, Input, InputNumber, message, Row, Modal, Space, Table, Steps, Select} from "antd";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {CarFilled, CheckOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {reqGetWarehouseProduct, reqPoCreateByOrderData} from "../../../appRedux/services/inventory";
import {renderNumberFormat} from "../../../util/Helper";

const OrderMakePO = (props) => {
  const {purchaseOrders} = useParams();
  const [form] = Form.useForm();
  const {order, actionLoading, isListLoading} = useSelector(({order}) => order);
  const {carriers} = useSelector(({auth}) => auth);
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [isSelectWhVisible, setIsSelectWhVisible] = useState(false);
  const [whs, setWhs] = useState([]);
  const [selectWhs, setSelectWhs] = useState([]);
  const [crIndex, setCrIndex] = useState(null);
  const [packages, setPackages] = useState([]);
  const [poStep, setPoStep] = React.useState(0);
  const [finalPackages, setFinalPackages] = useState([]);

  const toSelectCarrier = () => {
    const fPackages = [];
    packages.map(item => {
      let addNew = true;
      fPackages.map(item2 => {
        if (item.warehouse_id === item2.warehouse_id) {
          addNew = false;
          let addItemNew = true;
          item2.itemList.map((item3, idx) => {
            if (item3.product_id === item.product_id) {
              addItemNew = false;
              item2.itemList[idx].quantity = item2.itemList[idx].quantity + item.quantity;
            }
          });
          if (addItemNew) {
            item2.itemList.push({
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity
            })
          }
        }
      });
      if (addNew) {
        fPackages.push({
          warehouse_id: item.warehouse_id,
          warehouse_name: item.warehouse_name,
          carrier_id: null,
          shipping_fee: 0,
          itemList: [
            {
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity
            }
          ]
        })
      }
    });
    setFinalPackages(fPackages);
    setPoStep(poStep + 1);
  };

  const prev = () => {
    setPoStep(poStep - 1);
  };

  const setDefaultPackages = () => {
    const newList = [];
    const productIds = [];
    order && order.order_items.map(orderItem => {
      productIds.push(orderItem.product_id);
      newList.push({
        product_id: orderItem.product_id,
        product_name: orderItem.name,
        quantity: orderItem.quantity,
        warehouse_id: null,
        warehouse_name: null
      });
    });
    doSetPackages(newList);
    //Get warehouse item
    onGetWarehouse(productIds);
  }

  useEffect(() => {
    // const newList = [];
    // const productIds = [];
    // order && order.order_items.map(orderItem => {
    //   productIds.push(orderItem.product_id);
    //   newList.push({
    //     product_id: orderItem.product_id,
    //     product_name: orderItem.name,
    //     quantity: orderItem.quantity,
    //     warehouse_id: null,
    //     warehouse_name: null
    //   });
    // });
    // doSetPackages(newList);
    //Get warehouse item
    //onGetWarehouse(productIds);
    setDefaultPackages();

  }, [purchaseOrders]);

  const doSetPackages = (list) => {
    form.setFieldsValue({
      'packages': list
    });
    setPackages(list);
  };

  const onGetWarehouse = async (productIds) => {
    try {
      const res = await reqGetWarehouseProduct({
        productIds: productIds.join()
      });
      console.log(res.data.data);
      setWhs(res.data.data);
    } catch (e) {
      message.warn(e.message);
    }
  };

  const onCreatePackages = async () => {
    try {
      setIsCreatingPO(true);
      await reqPoCreateByOrderData({
        items: finalPackages,
        order_id: order.id
      });
      message.success("Tạo vận đơn thành công");
      if (props.onCloseModal) {
        props.onCloseModal();
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsCreatingPO(false);
    }
  };

  const onSelectCarrier = (value, idx) => {
    console.log(value, idx);
    const newList = finalPackages.slice();
    newList[idx].carrier_id = value;
    setFinalPackages(newList);
  };

  const onChangeShipMoney = (evt, idx) => {
    console.log(evt.target.value, idx);
    const newList = finalPackages.slice();
    newList[idx].shipping_fee = evt.target.value;
    setFinalPackages(newList);
  };

  const renderPackageList = () => {
    const {shipping_address} = order;
    if (!shipping_address) {
      return (
        <></>
      )
    }

    return <>
      <h4><CarFilled/> Chờ xử lý vận chuyển</h4>
      <Form
        // onFinish={onCreatePackages}
        layout={'horizontal'}
        form={form} autoComplete="off"
        initialValues={
          {
            packages: packages
          }
        }
      >
        <Space direction={"vertical"} size={"small"}>
          <Steps size={"small"} current={poStep}>
            <Steps.Step key={'choose_wh'} title={"Chọn kho"}/>
            <Steps.Step key={'choose_fulfillment'} title={"Giao vận"}/>
          </Steps>
          <div className={`steps-content ${poStep === 0 ? "" : "gx-d-none"}`}>
            <Form.List name={'packages'}>
              {(fields, {add, remove}) => {
                return (
                  <>
                    {fields.map((field, index) => {
                      const packs = form.getFieldValue('packages');
                      return (
                        <Row key={`p_${field.key}`} style={{marginLeft: 0, marginRight: 0}}>
                          <Form.Item
                            name={[field.name, 'product_id']}
                            style={{marginLeft: 0, marginRight: 0, display: "none"}}>
                            <Input/>
                          </Form.Item>
                          <Col xs={8} style={{marginLeft: 0, marginRight: 0}}>
                            <Form.Item
                              style={{marginLeft: 0, marginRight: 0}}>
                              {packs[index].product_name}
                            </Form.Item>
                          </Col>
                          <Col xs={8} style={{marginLeft: 0, marginRight: 0}}>
                            <Form.Item
                              label={"Số lượng"}
                              name={[field.name, 'quantity']}
                              style={{marginLeft: 0, marginRight: 0}}>
                              <InputNumber/>
                            </Form.Item>
                          </Col>
                          <Col xs={4} style={{marginLeft: 0, marginRight: 0}}>
                            <Form.Item
                              label={"Kho"}
                              name={`warehouse_name`}>
                              {!packs[index].warehouse_id ?
                                <Button onClick={() => onShowSelectWarehouse(index, packs[index].product_id)}
                                        size={'small'}
                                        type={'dashed'}>
                                  Chọn kho
                                </Button>
                                : <Button size={'small'}
                                          type={'link'}
                                          onClick={() => onShowSelectWarehouse(index, packs[index].product_id)}
                                >
                                  {packs[index].warehouse_name}
                                </Button>
                              }
                            </Form.Item>
                            <Form.Item
                              hidden
                              label={false}
                              name={[field.name, 'warehouse_id']}
                              style={{marginLeft: 0, marginRight: 0}}
                            >
                              <Input/>
                            </Form.Item>
                          </Col>
                          <Col xs={3} style={{marginLeft: 0, marginRight: 0}}>
                            <Form.Item
                              style={{marginLeft: 0, marginRight: 0}}>
                              <Space>
                                <Button
                                  type="dashed"
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                  icon={<MinusOutlined/>}
                                />
                                <Button
                                  type="dashed"
                                  onClick={() => {
                                    add(packs[index]);
                                  }}
                                  icon={<PlusOutlined/>}
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
          </div>
          <div className={`steps-content ${poStep === 1 ? "" : "gx-d-none"}`}>
            {finalPackages.map((pack, idx) => {
              if (pack.warehouse_id === null) {
                return <></>
              }
              return <>
                <div className="gx-mb-3">
                  <Space>
                    <strong>{pack.warehouse_name}</strong>
                    <span>|</span>
                    <Select style={{minWidth: "200px"}} onSelect={value => onSelectCarrier(value, idx)}>
                      {carriers.map(value => {
                        return <Select.Option value={value.code} key={`carrier_${value.code}`}>
                          {value.name} - {value.default_price}
                        </Select.Option>
                      })}
                    </Select>
                    <span>|</span>
                    <Input type={"number"} min={0} placeholder={"Nhập tiền vận chuyển"}
                           onChange={evt => onChangeShipMoney(evt, idx)}/>
                  </Space>
                </div>
                <Space direction={"vertical"}>
                  {pack.itemList.map(item => {
                    return <Space>
                      <span>{item.product_name}</span>
                      |
                      <span>Số lượng: {renderNumberFormat(item.quantity)}</span>
                    </Space>
                  })}
                </Space>
              </>
            })}
          </div>
        </Space>
      </Form>
      <div className="steps-action gx-mt-4">
        {poStep < 1 && (
          <Button disabled={isCreatingPO} type="primary" onClick={() => toSelectCarrier()}>
            Tiếp tục
          </Button>
        )}
        {poStep === 1 && (
          <Button loading={isCreatingPO} type="primary" onClick={() => onCreatePackages()}>
            Gửi yêu cầu
          </Button>
        )}
        {poStep > 0 && (
          <Button disabled={isCreatingPO} onClick={() => prev()}>
            Quay lại
          </Button>
        )}
      </div>
    </>
  };

  const onShowSelectWarehouse = (index, productId) => {
    console.log(index, productId);
    let newList = [];
    whs.map(item => {
      if (item.product_id === productId) {
        newList.push(item);
      }
    });
    setSelectWhs(newList);
    setCrIndex(index);
    setIsSelectWhVisible(true);
  };

  const onSelectWarehouse = (warehouseId, warehouseName) => {
    let newPakages = packages.slice();
    newPakages[crIndex].warehouse_id = warehouseId;
    newPakages[crIndex].warehouse_name = warehouseName;
    doSetPackages(newPakages);
    setIsSelectWhVisible(false);
  };

  const renderWarehouseModels = () => {
    return <Modal visible={isSelectWhVisible}
                  footer={false}
                  onCancel={() => setIsSelectWhVisible(false)}>
      <Table
        pagination={false}
        columns={[
          {
            title: 'Kho', key: 'id', dataIndex: 'id',
            render: (value, row) => {
              return <span>{row.warehouse_name}</span>
            }
          },
          {
            title: 'Tồn kho', key: 'stock',
            render: (value, row) => {
              return renderNumberFormat(row.committed + row.hand_in_stock)
            }
          },
          {
            title: 'Khả dụng', key: 'his', dataIndex: 'hand_in_stock',
            render: (value, row) => {
              return renderNumberFormat(value)
            }
          },
          {
            title: 'Chờ nhập kho', key: 'waiting_imported', dataIndex: 'waiting_import',
            render: (value, row) => {
              return renderNumberFormat(value)
            }
          },
          {
            title: '', key: 'wh_action',
            render: (value, row) => {
              return <Button type={"dashed"}
                             onClick={() => onSelectWarehouse(row.warehouse_id, row.warehouse_name)}
                             icon={<CheckOutlined/>}>
                Chọn
              </Button>
            }
          }
        ]}
        dataSource={selectWhs}
      />
    </Modal>
  };

  return <>
    {renderPackageList()}
    {renderWarehouseModels()}
  </>;
};
export default OrderMakePO;

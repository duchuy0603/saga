import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table
} from "antd";
import {dateTimeFromString, defaultImage, renderAdjustStt} from "../../util/Helper";
import SelectWarehouse from "../../components/Input/SelectWarehouse";
import {ADJUSTMENT_CANCEL, ADJUSTMENT_CONFIRM, ADJUSTMENT_DRAFT, formWrap} from "../../constants/constant";
import {MinusOutlined} from "@ant-design/icons";
import SelectProduct from "../../components/Input/SelectProduct";
import {ADJ_CANCEL, ADJ_CONFIRM, ADJ_CREATE, ADJ_GET_LIST} from "../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import FilterAdjustment from "./filter/filter-adjustment";

const Adjustment = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [packages, setPackages] = useState([]);
  const [current, setCurrent] = useState(null);
  const {adjList, adjPaginate, acLoad, loading} = useSelector(({adjustment}) => adjustment);
  const removeItemPackage = item => {
    let packages = form.getFieldValue('items');
    packages = packages.filter(index => index.product_id !== item.product_id);
    form.setFieldsValue({
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
          warehouse_id: form.getFieldValue('warehouse_id')
        })
      })
    }
    setCurrent(products[index]);
    form.setFieldsValue({
      'items': packs
    });
    setPackages(packages);
  }

  const renderExpandedRow = row => {
    return <div>
      <p>L?? do ??i???u ch???nh: {row.reason}</p>
      <Table
        size={`small`}
        pagination={false}
        dataSource={row.adjust_items ?? []}
        columns={[
          {
            title: 'S???n ph???m', dataIndex: 'product_id', key: 'product_id', render: (pId, raw) => {
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
                  <small>Tr???ng l?????ng: {raw.weight}</small>
                </Space>
              </div>
            }
          },

          {title: 'S??? l?????ng', dataIndex: 'product_id', key: 'product_id'},
        ]}
      />
    </div>
  }
  const onSubmitAdjust = data => {
    dispatch({
      type: ADJ_CREATE,
      payload: data
    })
  }
  const getAdjustList = (params = {}) => {

    const formSearchValue = formSearch.getFieldsValue();
    dispatch({
      type: ADJ_GET_LIST,
      payload: {
        page: 1,
        ...params,
        ...formSearchValue
      }
    })
  }
  const onAdjustConfirm = id => {
    dispatch({
      type: ADJ_CONFIRM,
      payload: {
        id,
        status: ADJUSTMENT_CONFIRM
      }
    })
  }
  const onAdjustCancel = id => {
    dispatch({
      type: ADJ_CANCEL,
      payload: {
        id,
        status: ADJUSTMENT_CANCEL
      }
    })
  }
  useEffect(() => {
    getAdjustList();
  }, [])
  return (
    <div>
      <Card title={`??i???u ch???nh kho`}
            extra={<Space>
              <Button onClick={() => setModalVisible(true)} size={`small`} type={`default`}>T???o phi???u</Button>
            </Space>}
      >
        <Spin spinning={loading}>

          <FilterAdjustment form={formSearch} onFinish={getAdjustList}/>

          <Table
            pagination={adjPaginate}
            dataSource={adjList}
            expandable={{
              expandedRowRender: row => renderExpandedRow(row)
            }}
            columns={[
              {title: 'M?? phi???u', dataIndex: 'id', key: 'id', render: id => `#${id}`},
              {
                title: 'Ng??y t???o phi???u',
                dataIndex: 'created_at',
                key: 'created_at',
                render: time => dateTimeFromString(time)
              },
              {title: 'Tr???ng th??i', dataIndex: 'status', key: 'status', render: status => renderAdjustStt(status)},
              {
                title: '', key: 'action', render: raw => {
                  return (
                    <Space>
                      {raw.status !== ADJUSTMENT_CONFIRM &&
                      <Popconfirm onConfirm={() => onAdjustConfirm(raw.id)} title={`X??c nh???n phi???u ??i???u ch???nh n??y?`}>
                        <Button loading={acLoad} size={`small`} type={`primary`}>X??c
                          nh???n</Button>
                      </Popconfirm>}
                      {raw.status !== ADJUSTMENT_CANCEL &&
                      <Popconfirm onConfirm={() => onAdjustCancel(raw.id)} title={`H???y phi???u ??i???u ch???nh n??y?`}>
                        <Button loading={acLoad} size={`small`} danger
                                type={`dashed`}>H???y</Button>
                      </Popconfirm>}

                    </Space>
                  )
                }
              }
            ]}
          />
        </Spin>
      </Card>
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={<Space>
          <Button onClick={() => setModalVisible(false)} type={`default`}>H???y</Button>
          <Button form={`adjustment-form`} htmlType={`submit`} type={`primary`}>L??u</Button>
        </Space>}
        title={`T???o phi???u ??i???u ch???nh kho`}>
        <Form onFinish={onSubmitAdjust} {...formWrap} form={form} id={`adjustment-form`}>
          <Form.Item rules={[{required: true}]} label={`Kho`} name={`warehouse_id`}>
            <SelectWarehouse showAll={false}/>
          </Form.Item>
          <Form.Item rules={[{required: true}]} label={`L?? do ??i???u ch???nh`} name={`reason`}>
            <Input.TextArea rows={4} placeholder={`L?? do ??i???u ch???nh kho...`}/>
          </Form.Item>
          <Form.Item label={`S???n ph???m`}>
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
                    const packs = form.getFieldValue('items');
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
                            rules={[{required: true, message: 'S??? l?????ng nh???p b???t bu???c!'}]}
                            label={"SL"}
                            initialValue={``}
                            name={[field.name, 'quantity']}>
                            <InputNumber style={{width: `100%`}}/>
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
    </div>
  )
}
export default Adjustment;

import React, {useEffect, useState} from "react";
import {
  Card, Row, Col, Divider, Button,
  Descriptions,
  Image, Space, Table, Spin, message, Form, Tooltip, Modal
} from "antd";
import {Link, useParams} from 'react-router-dom';
import {EditOutlined, PartitionOutlined} from "@ant-design/icons/lib/icons";
import {
  dateTimeFromString,
  defaultImage,
  getEmpty, getPaginate,
  renderNumberFormat,
  toPrice
} from "../../util/Helper";
import {DownloadOutlined, LeftOutlined, TagOutlined} from "@ant-design/icons";
import NotFoundPage from "../NotFoundPage";
import {
  PO_TRANS_TYPES, PO_TYPE_IMPORT,
  PRODUCT_GROUP_PARENT,
  PRODUCT_GROUP_SINGLE, TRANSACTION_IMPORT,
} from "../../constants/constant";
import {reqCreatePoViaProduct, reqGetWarehouseProduct, reqPoTransactionList} from "../../appRedux/services/inventory";
import {reqGetProduct, reqProductDetail} from "../../appRedux/services/product";
import FilterInventory from "./filter/FilterInventory";
import FilterTrans from "./filter/FilterTrans";
import ImportWarehouse from "./modal/ImportWarehouse";

const ProductDetail = (props) => {
  const {productId} = useParams();
  const [detail, setDetail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [modalWh, setModalWh] = useState({
    visible: false,
    loading: false
  });
  const [formImportWh] = Form.useForm();
  const [whForm] = Form.useForm();
  const [otForm] = Form.useForm();
  const [transList, setTransList] = useState({
    list: [],
    pagination: {}
  });
  const [isLoadingTransList, setLoadingTransList] = useState(false);
  const [variantList, setVariantList] = useState({
    list: [],
    pagination: {}
  });
  const [isLoadingVariantList, setLoadingVariantList] = useState(false);
  const onGetDetail = async () => {
    try {
      setLoading(true);
      const response = await reqProductDetail(productId);
      setDetail(response.data);
      await getVariantList({page: 1}, response.data.group);
      await getTransList({page: 1}, response.data.group);
      console.log("Detail")
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    (async () => {
      await onGetDetail();
    })();
  }, []);

  const changeTranListPage = async (page) => {
    await getTransList({page}, detail.group);
  };

  const getTransList = async (params, group = PRODUCT_GROUP_PARENT) => {
    let searchParams = null;
    let otFormData = otForm.getFieldsValue();
    // if (detail) {
    if (group === PRODUCT_GROUP_PARENT) {
      searchParams = {
        ...params,
        ...otFormData,
        parent_id: productId,
        fieldWith: "warehouse,product"
      }
    } else if (group === PRODUCT_GROUP_SINGLE) {
      searchParams = {
        ...params,
        ...otFormData,
        product_id: productId,
        fieldWith: "warehouse,product"
      }
    }
    try {
      setLoadingTransList(true);
      const res = await reqPoTransactionList(searchParams);
      let list = res.data.data;
      let pagination = getPaginate(res.data);
      setTransList({
        list,
        pagination
      });
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoadingTransList(false);
    }
    //}
  };

  const changeVariantListPage = async (page) => {
    await getVariantList({page}, detail.group);
  };
  const getVariantList = async (params, group = PRODUCT_GROUP_PARENT) => {
    let searchParams = null;
    let whFormData = whForm.getFieldsValue();
    if (group === PRODUCT_GROUP_PARENT) {
      searchParams = {
        ...params,
        ...whFormData,
        parentIds: productId
        // fieldWith: "warehouse,product"
      }
    } else if (group === PRODUCT_GROUP_SINGLE) {
      searchParams = {
        ...params,
        ...whFormData,
        productIds: productId,
        // fieldWith: "warehouse,product"
      }
    }
    console.log("searchParams: ", searchParams);
    try {
      setLoadingVariantList(true);
      const res = await reqGetWarehouseProduct(searchParams);
      let list = res.data.data;
      let pagination = getPaginate(res.data);
      setVariantList({
        list,
        pagination
      });
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoadingVariantList(false);
    }
    // }
  };
  const saveSingleWarehouse = async (data) => {
    if (data.packages.length <= 0) {
      message.error('H??y ch???n s???n ph???m nh???p kho!');
      return;
    }
    setModalWh({...modalWh, loading: false});

    try {
      let po = {
        ...data,
        wh_to_name: data.warehouse_name,
        wh_from_name: data.wh_from_name,
        po_type: PO_TYPE_IMPORT,
        transaction_type: TRANSACTION_IMPORT,
        items: data.packages,
      };
      await reqCreatePoViaProduct(po);
      message.success('???? t???o phi???u nh???p kho th??nh c??ng, xin vui l??ng chuy???n ?????n m???c v???n chuy???n ????? theo d??i!', 3);
      setModalWh({visible: false, loading: false});
      formImportWh.resetFields();
    } catch (e) {
      message.error(e.message);
      setModalWh({...modalWh, loading: false});
    }
  };

  return (
    <Spin spinning={isLoading}>
      {detail === null ? <NotFoundPage/> : <Row gutter={[8, 8]}>
        <Col xs={24} md={18}>
          <Card size={'small'}
                title={
                  <Space split={"|"}>
                    <Button className={'m-0'} type={"link"} onClick={() => props.history.goBack()}>
                      <LeftOutlined/> Danh s??ch
                    </Button>
                    <span>{detail.name}</span>
                  </Space>
                } extra={
            <Space>
              <Button onClick={() => setModalWh({...modalWh, visible: true})}
                      size={'small'} type='dashed'
                      icon={<DownloadOutlined/>}>Y??u c???u nh???p kho</Button>

              <Link to={`/product/update/${productId}`}>
                <Button size={'small'} type='primary' icon={<EditOutlined/>}>S???a</Button>
              </Link>
            </Space>
          }>
            <Descriptions column={2}>
              <Descriptions.Item label={<b>Nh?? cung c???p</b>}>
                <Link to={`/manufacture/update/${detail.manufacture_id}`}>
                  {getEmpty(detail.manufacture_name)}
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label={<b>Tr???ng th??i</b>}>
                {detail.status}
              </Descriptions.Item>
              <Descriptions.Item label={<b>Gi?? hi???n t???i</b>}>
                {toPrice(detail.price)}??
              </Descriptions.Item>
              <Descriptions.Item label={<b>SKU</b>}>
                {getEmpty(detail.sku)}
              </Descriptions.Item>
              <Descriptions.Item label={<b>????n v???</b>}>
                {getEmpty(detail.unit)}
              </Descriptions.Item>
              <Descriptions.Item label={<b>C???nh b??o t???n kho m???c ?????nh:</b>}>
                {renderNumberFormat(detail.stock_warn, '', '????n v???')}
              </Descriptions.Item>
            </Descriptions>
            <Divider/>
            <h4><TagOutlined/> Danh s??ch l??u kho</h4>
            <FilterInventory form={whForm} onFinish={data => getVariantList(data, detail.group)}/>
            <Spin spinning={isLoadingVariantList}>

              <Table
                size={"small"}
                rowKey={'id'}
                onChange={changeVariantListPage}
                pagination={variantList.pagination}
                dataSource={variantList.list}
                columns={[
                  {
                    title: 'S???n ph???m', dataIndex: 'product_name', key: 'product_name',
                    render: (value, raw) => {
                      return (
                        <Link to={`/product/${raw.product_id}`}>
                          {value}
                        </Link>
                      )
                    }
                  },
                  {
                    title: 'Kho', dataIndex: 'warehouse_name', key: 'warehouse_name', render: (v, r) => {
                      return (
                        <small>{v}</small>
                      )
                    }
                  },
                  {
                    title: 'T???n kho', dataIndex: 'hand_in_stock', key: 'hand_in_stock', render: (stock, raw) => {
                      return renderNumberFormat(stock);
                    }
                  },
                  {
                    title: '???? ?????t', dataIndex: 'committed', key: 'committed', render: (committed, raw) => {
                      return renderNumberFormat(committed);
                    }
                  },
                  {
                    title: <Tooltip title={`Kh??? dung`}>KKD</Tooltip>,
                    dataIndex: 'committed',
                    key: 'committed',
                    render: (committed, raw) => {
                      return renderNumberFormat(raw.hand_in_stock - committed);
                    }
                  },
                  {
                    title: <Tooltip title={`Kh??ng kh??? dung`}>KKD</Tooltip>,
                    dataIndex: 'committed',
                    key: 'committed',
                    render: (committed, raw) => {
                      return renderNumberFormat(committed);
                    }
                  },
                  {
                    title: 'Ch??? nh???p', dataIndex: 'waiting_import', key: 'waiting_import', render: waiting_import => {
                      return getEmpty(waiting_import);
                    }
                  },
                ]}
              />
            </Spin>
            <Divider/>
            <h4><TagOutlined/> Ho???t ?????ng kho</h4>
            <FilterTrans form={otForm} onFinish={data => getTransList(data, detail.group)}/>

            <Spin spinning={isLoadingTransList}>
              <Table
                size={"small"}
                rowKey={'id'}
                onChange={changeTranListPage}
                dataSource={transList.list}
                pagination={transList.pagination}
                columns={[
                  {
                    title: '#ID', dataIndex: 'id', key: 'id', render: value => {
                      return `#${value}`
                    }
                  },
                  {
                    title: 'S???n ph???m', dataIndex: 'product_id', key: 'product_id', render: (value, raw) => {
                      return <Link to={`/product/${value}`}>{raw.product ? raw.product.name : "Unknown"}</Link>
                    }
                  },
                  {
                    title: 'Lo???i',
                    dataIndex: 'transaction_type',
                    key: 'transaction_type',
                    render: transaction_type => {
                      const _type = PO_TRANS_TYPES.find(item => item.code === transaction_type);
                      return getEmpty(_type.name);
                    }
                  },
                  {
                    title: 'Kho', dataIndex: 'warehouse', key: 'warehouse', render: (value, raw) => {
                      return value.name;
                    }
                  },
                  {
                    title: 'Phi???u li??n quan', dataIndex: 'po_id', key: 'po_id', render: (value) => {
                      if (!value) {
                        return '---';
                      }
                      return <Link to={`/inventory/po/${value}`}>#PO-UOA{value}</Link>;
                    }
                  },
                  {
                    title: 'S??? l?????ng', dataIndex: 'quantity', key: 'quantity', render: (value, raw) => {
                      return renderNumberFormat(value);
                    }
                  },
                  {
                    title: 'Ng??y t???o', dataIndex: 'created_at', key: 'created_at', render: created_at => {
                      return dateTimeFromString(created_at);
                    }
                  },
                ]}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className={`d-flex space-center`}>
              <Image
                width={120}
                height={120}
                src={detail.image_url}
                fallback={defaultImage()}
              />
            </div>
            {/*<table className={`table table-borderless`}>*/}
            {/*  <tr>*/}
            {/*    <td colSpan={2}>*/}
            {/*      <h4>T??nh theo h??a ????n</h4>*/}
            {/*    </td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>T???n :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>Gi??? :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>Kh??? d???ng :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*</table>*/}

            {/*<table className={`table table-borderless`}>*/}
            {/*  <tr>*/}
            {/*    <td colSpan={2}>*/}
            {/*      <h4>T??nh theo v???n ????n</h4>*/}
            {/*    </td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>T???n :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>Gi??? :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>Kh??? d???ng :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*</table>*/}
            <Divider/>
            {/*<table className={`table table-borderless`}>*/}
            {/*  <tr>*/}
            {/*    <td>??ang v???n chuy???n :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>Ch??a v???n chuy???n :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>Ch??a c?? h??a ????n :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*</table>*/}
            <Divider/>
            {/*<table className={`table table-borderless`}>*/}
            {/*  <tr>*/}
            {/*    <td colSpan={2}>*/}
            {/*      <h4>C???nh b??o t???n kho</h4>*/}
            {/*    </td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>T???ng kho :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*  <tr>*/}
            {/*    <td>T???ng kho :</td>*/}
            {/*    <td>--</td>*/}
            {/*  </tr>*/}
            {/*</table>*/}
          </Card>
        </Col>
        <Modal
          width={720}
          footer={<Space>
            <small className={`text-note danger`}>* Th??ng tin b???t bu???c</small>
            <Button onClick={() => setModalWh({...modalWh, visible: false, loading: false})}>H???y</Button>
            <Button loading={modalWh.loading} type={`primary`} htmlType={`submit`}
                    form={`pWarehouseForm`}>L??u</Button>
          </Space>}
          onCancel={() => setModalWh({...modalWh, visible: false, loading: false})}
          visible={modalWh.visible} title={`Nh???p kho s???n ph???m`}>
          <ImportWarehouse
            form={formImportWh}
            onSaveWarehouse={saveSingleWarehouse}
            childrens={detail.childrens}
            packages={packages}
            setPackages={setPackages}/>
        </Modal>
      </Row>}

    </Spin>
  )
};
export default ProductDetail;

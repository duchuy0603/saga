import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, Divider, Form, Input, Modal, Popconfirm, Row, Space, Spin, Table, Tag} from "antd";
import {formWrap, PRO_CAT_TYPE_STYLE, PRO_CAT_TYPE_VARIANT} from "../../../constants/constant";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {
  PRODUCT_CAT_CREATE,
  PRODUCT_CAT_DEL,
  PRODUCT_CAT_GET_LIST,
  PRODUCT_CAT_UPDATE
} from "../../../constants/ActionTypes";
import {dateTimeFromString} from "../../../util/Helper";
import ModalImport from "./ModalImport";

const ProductVariant = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState();
  const [importVisible, setImportVisible] = useState();
  const dispatch = useDispatch();
  const [variants, setVariants] = useState({
    name: '',
    code: '',
    values: ''
  });
  const viewTags = () => {
    setVariants(form.getFieldsValue());
  }
  const onFinish = async (data) => {
    dispatch({
      type: data.id ? PRODUCT_CAT_UPDATE : PRODUCT_CAT_CREATE,
      payload: {
        ...data,
        type: PRO_CAT_TYPE_VARIANT
      }
    });
    setVisible(false);
    form.resetFields();
  }
  const {catList, acLoad} = useSelector(({product}) => product);
  const getArchive = async (params = {}) => {
    dispatch({
      type: PRODUCT_CAT_GET_LIST,
      payload: {
        ...params,
        type: PRO_CAT_TYPE_VARIANT,
      }
    })
  }
  useEffect(() => {
    getArchive()
  }, [])
  return (
    <Card
      extra={[
        <Button onClick={() => setVisible(true)}>Thêm mới</Button>,
        <Button onClick={() => setImportVisible(true)}>Nhập Excel</Button>
      ]}
      title={`Mẫu biến thể`}>
      <Spin spinning={acLoad}>
        <Table
          columns={[
            {title: 'ID', dataIndex: 'id', key: 'id', render: id => `#${id}`},
            {title: 'Tên', dataIndex: 'name', key: 'name'},
            {
              title: 'Các giá trị', dataIndex: 'variants', key: 'variants', render: (variants, raw) => {
                console.log("Variants: ", variants)
                if (!variants || raw.type !== 'variant') {
                  return '';
                }
                return variants?.map(variant => {
                  return <Tag color="green">{variant.name}-{variant.code}</Tag>
                })
              }
            },
            {
              title: 'Ngày cập nhật',
              dataIndex: 'updated_at',
              key: 'updated_at',
              render: time => dateTimeFromString(time)
            },
            {
              title: '', key: 'action', render: raw => {
                return (<Space>
                  <Popconfirm onConfirm={() => {
                    dispatch({
                      type: PRODUCT_CAT_DEL,
                      payload: {
                        catId: raw.id
                      }
                    })
                  }} title={`Xóa dữ liệu này?`}>
                    <Button size={`small`} type={`dashed`} danger>
                      <i className={`icon icon-trash`}/>
                    </Button>
                  </Popconfirm>
                  <Button onClick={() => {
                    form.setFieldsValue(raw);
                    setVisible(true);
                  }} size={`small`} type={`primary`}>
                    <i className={`icon icon-edit`}/>
                  </Button>
                </Space>)
              }
            }
          ]}
          dataSource={catList}
        />
      </Spin>
      <Modal
        onCancel={() => setVisible(false)}
        visible={visible}
        title={`Thêm biến thể`}
        footer={[
          <span className={`text-danger mr-1`}>* Các trường bắt buộc!</span>,
          <Button type={`default`} onClick={() => setVisible(false)}>Hủy</Button>,
          <Button htmlType={`submit`} form={`brand-form`} type={`primary`}>Lưu</Button>
        ]}
      >
        <Form
          onFinish={onFinish}
          {...formWrap} id={`brand-form`}
          form={form}>
          <Form.Item hidden name={`id`}><Input/></Form.Item>
          <Form.Item hidden name={`type`} initialValue={PRO_CAT_TYPE_VARIANT}><Input/></Form.Item>
          <Form.Item
            rules={[{required: true, message: 'Tên biến thể!'}]}
            name={`name`}
            label={`Tên biến thể`}>
            <Input onChange={viewTags}/>
          </Form.Item>
          <Form.Item
            rules={[{required: true, message: 'Mã code biến thể!'}]}
            name={`code`}
            label={`Mã code`}>
            <Input/>
          </Form.Item>
          <Row>
            <Col sm={6}><b>{variants.name}</b></Col>
            <Col sm={18}>
              <Checkbox.Group className={`custom-checkbox default`}>
                {variants.values && variants.values.map(variant => {
                  return (
                    <>
                      {variant ? <Checkbox value={variant?.code}>{variant?.name} - {variant?.code}</Checkbox> : ''}
                    </>
                  )
                })}
              </Checkbox.Group>
            </Col>
          </Row>
          <Divider/>
          <Form.List
            rules={[{required: true, message: 'Nhập giá trị biến thể'}]}
            name={`variants`}>
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, fieldKey, ...restField}) => (
                  <Space key={key} style={{display: 'flex', justifyContent: 'space-between'}} align="center">
                    <Form.Item
                      label={`Tên`}
                      {...restField}
                      name={[name, 'name']}
                      fieldKey={[fieldKey, 'name']}
                      rules={[{required: true, message: 'Nhập tên'}]}
                    >
                      <Input onChange={viewTags} style={{width: '100%'}} placeholder="Tên giá trị"/>
                    </Form.Item>
                    <Form.Item
                      label={`Key`}
                      {...restField}
                      name={[name, 'code']}
                      fieldKey={[fieldKey, 'code']}
                      rules={[{required: true, message: 'Nhập code'}]}
                    >
                      <Input onChange={viewTags} style={{width: '100%'}} placeholder="Mã code"/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => {
                      remove(name);
                      viewTags();
                    }}/>
                  </Space>
                ))}
                <Button style={{width: '100%'}} type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                  Thêm giá trị
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      <ModalImport
        callback={getArchive}
        importType={`variant`}
        visible={importVisible}
        setVisible={setImportVisible}
      />
    </Card>
  )
}
export default ProductVariant;

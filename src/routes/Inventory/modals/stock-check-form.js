import React, {useEffect} from "react";
import {Button, Col, Divider, Form, Image, Input, InputNumber, message, Modal, Row, Space, Spin} from "antd";
import {defaultImage} from "../../../util/Helper";
import {useDispatch} from "react-redux";
import {PO_CHECK_STOCK} from "../../../constants/ActionTypes";

const StockCheckForm = ({...props}) => {
  const {showModal, po} = props;
  const [formCheckStock] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    formCheckStock.setFieldsValue({
      packages: po.po_items ? po.po_items : []
    })
  }, [po]);

  const onFinish = (formData) => {
    callReq(formData, true)
  };

  const saveDraft = () => {
    callReq(formCheckStock.getFieldsValue(), undefined);
  };

  const callReq = (formData, setDone) => {
    try {
      console.log(po.id);
      dispatch({
        type: PO_CHECK_STOCK,
        payload: {
          ...formData,
          setDone,
          poId: po.id
        }
      });
      if (showModal) {
        showModal(false);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  return (
    <Form
      id={`check-stock-form`}
      onFinish={onFinish}
      form={formCheckStock}
    >
      <Form.List key={`id`} name={'packages'}>
        {(fields, {add, remove}) => {
          return (
            <>
              {fields.map((field, index) => {
                const packs = formCheckStock.getFieldValue('packages');
                return (
                  <Row key={`p_${field.key}`}>
                    <Form.Item
                      hidden
                      name={[field.name, 'product_id']}>
                      <Input />
                    </Form.Item>
                    <Col md={12}>
                      <Form.Item>
                        <div className={`d-flex`}>
                          <Image
                            width={40}
                            height={40}
                            src={'error'}
                            fallback={defaultImage()}
                          />
                          <Space className={`pl-1`} size={1} direction={'vertical'}>
                            <small>{packs[index].title}</small>
                            <small>Loại: {packs[index].name}</small>
                          </Space>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        rules={[{required: true, message: 'Số lượng nhập bắt buộc!'}]}
                        label={"Thực kiểm"}
                        name={[field.name, 'quantity']}>
                        <InputNumber style={{width: `100%`}} />
                      </Form.Item>
                    </Col>
                  </Row>
                )
              })}
            </>
          )
        }}
      </Form.List>
      <Form.Item name={"note"}>
        <Input.TextArea />
      </Form.Item>
      <Divider />
      <Space style={{display: "flex", flexWarp: "wrap", flexDirection: "row-reverse"}}>
        <Button form={`check-stock-form`} htmlType={`submit`}
                type={`primary`}>Xác nhận</Button>
        <Button form={`tracking-form`} onClick={saveDraft}
                type={'ghost'}>Lưu nháp</Button>
        <Button onClick={() => showModal(false)}>Hủy</Button>
      </Space>
      {/*<Form.Item*/}
      {/*  name={`setDone`}*/}
      {/*  label={``}*/}
      {/*>*/}
      {/*  <Checkbox onChange={e => form.setFieldsValue({packing_status: e.target.checked})}*/}
      {/*            className={`text-danger`}>Xác nhận hoàn thành lần kiểm</Checkbox>*/}
      {/*</Form.Item>*/}
    </Form>
  );
};

export default StockCheckForm;

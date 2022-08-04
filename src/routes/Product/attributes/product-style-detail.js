import React, {useEffect, useRef, useState} from "react";
import {
  Button, Card,
  Col, Divider, Form, Checkbox,
  Input, Row, Select, Popconfirm
} from "antd";
import {formWrap, PRO_CAT_TYPE_STYLE, PRO_CAT_TYPE_VARIANT} from "../../../constants/constant";
import SelectProductCat from "../../../components/Input/SelectProductCat";
import {useDispatch, useSelector} from "react-redux";
import {PRODUCT_CAT_CREATE, PRODUCT_CAT_GET_LIST, PRODUCT_CAT_UPDATE} from "../../../constants/ActionTypes";
import {useParams} from "react-router-dom";
import {reqProductDetailCategory} from "../../../appRedux/services/product";

const ProductStyleDetail = () => {
  const {id} = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {catList} = useSelector(({product}) => product);
  const [variantSelected, setVariantSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);
  const [defaultChecked, setDefaultChecked] = useState([]);
  const getArchive = async (params = {}) => {
    dispatch({
      type: PRODUCT_CAT_GET_LIST,
      payload: {
        ...params,
        type: PRO_CAT_TYPE_VARIANT,
      }
    });
  }
  useEffect(() => {
    getArchive()
  }, []);
  useEffect(() => {
    if (id) {
      (async () => {
        const response = await reqProductDetailCategory(id);
        const {data} = response;
        const {selected, option} = data.variants;
        setDefaultSelected(selected);
        setDefaultChecked(option.map(item => item.checked));

        form.setFieldsValue({
          id: data.id,
          name: data.name,
          code: data.code,
          selected
        })
      })();
    }

  }, [id]);

  const onFinish = (data) => {

    const dataSet = {
      id: data.id,
      name: data.name,
      code: data.code,
      variants: {
        selected: data.selected,
        option: data.variants
      }
    }
    dispatch({
      type: data.id ? PRODUCT_CAT_UPDATE : PRODUCT_CAT_CREATE,
      payload: {
        ...dataSet,
        type: PRO_CAT_TYPE_STYLE
      }
    })
  }


  useEffect(() => {
    form.setFieldsValue({
      variants: variantSelected
    })
  }, [variantSelected])
  useEffect(() => {
    const newSetList = catList.filter(item => defaultSelected.includes(item.code));
    setVariantSelected(newSetList);
    form.setFieldsValue({
      variants: {
        ...newSetList,
        checked: defaultChecked
      }
    });
    console.log("newSetList", newSetList)
  }, [defaultSelected, defaultChecked])
  return (
    <Card
      title={`Loại sản phẩm 1`}>
      <Form onFinish={onFinish} form={form} {...formWrap}>
        <Form.Item
          name={`name`}
          rules={[{required: true, message: 'Nhập tên loại sản phẩm!'}]}
          label={`Tên loại`}>
          <Input/>
        </Form.Item>
        <Form.Item
          name={`code`}
          label={`Mã code`}>
          <Input placeholder={`Hệ thống tự động điền nếu để trống!`}/>
        </Form.Item>
        <Form.Item
          name={`id`}
          hidden>
          <Input/>
        </Form.Item>
        <Divider/>
        <Row>
          <Col sm={6}>
            <b>Biến thể</b>
          </Col>
          <Col sm={14}>
            <Form.Item
              noStyle
              name={`selected`}>
              <Select
                mode={`multiple`}
                onSelect={e => {
                  const variants = catList.find(item => item.code === e);
                  setVariantSelected([
                    ...variantSelected,
                    variants
                  ]);
                }}
                onDeselect={e => {
                  setVariantSelected(variantSelected.filter(v => v.code !== e));
                }}
                style={{width: '100%'}} placeholder={`Chọn mẫu biến thể có sẵn`}>
                {catList && catList.map(item => (<Select.Option
                  key={item.id}
                  variants={item.variants}
                  value={item.code}>
                  {item.name}
                </Select.Option>))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className={`mt-2`}>
          <Col sm={6}>
            <b>Tên</b>
          </Col>
          <Col sm={18}>
            <b>Giá trị</b>
          </Col>
          <Divider/>
          <Col sm={24}>
            <Form.List name={`variants`}>
              {(fields, {add, remove}) => (
                <>
                  {fields.map(({key, name, fieldKey, ...restField}) => (
                    <Row key={key}>
                      <Col sm={6}>
                        <Form.Item
                          noStyle
                          {...restField}
                          name={[name, 'name']}>
                          <Input disabled/>
                        </Form.Item>
                      </Col>
                      <Col sm={14}>
                        <Form.Item
                          {...restField}
                          initialValue={defaultChecked[name]}
                          name={[name, 'checked']}>
                          <Checkbox.Group className={`custom-checkbox`}>
                            {variantSelected[name]?.variants.map(value => {
                              return (
                                <Checkbox
                                  value={value.code}>{value.name} - {value.code}</Checkbox>
                              )
                            })}
                          </Checkbox.Group>
                        </Form.Item>
                      </Col>
                      <Col sm={4}>
                        <Button size={`small`} onClick={() => {
                          remove(name);
                        }}>Xóa</Button>
                        <Popconfirm title={`Sau khi cập nhật bạn cần chọn lại biến thể!`}>
                          <Button size={`small`}>
                            Cập nhật
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </Col>
          <Col sm={24}>
            <Button htmlType={`submit`} type={`primary`}>Lưu</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
export default ProductStyleDetail;


import React, {useEffect, useState} from "react";
import {
  Button,
  Card, Checkbox,
  Col, Divider,
  Form,
  Input, message,
  Row,
  Space, Switch,
  Typography
} from "antd";
import {
  formWrap, PRO_CAT_TYPE_ARCHIVE, PRO_CAT_TYPE_BRAND, PRO_CAT_TYPE_GROUP, PRO_CAT_TYPE_STYLE, PRODUCT_STT_ACTIVE,
} from "../../constants/constant";
import SelectProductCat from "../../components/Input/SelectProductCat";
import {useDispatch} from "react-redux";
import {CREATE_PRODUCT, UPDATE_PRODUCT} from "../../constants/ActionTypes";
import {useParams} from "react-router-dom";
import {reqProductDetail} from "../../appRedux/services/product";

const ProductUpdate = () => {
    const {productId} = useParams();
    const [form] = Form.useForm();
    const [styleSelected, setStyleSelected] = useState([]);
    const [displaySku, setDisplaySku] = useState('');
    const [defaultSelected, setDefaultSelected] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    const [parentSku, setParentSku] = useState({
      name: '', brand: '', group: '', category: '', style: ''
    });
    const dispatch = useDispatch();
    const setFormField = (obj, name) => {
      form.setFieldsValue({
        [name]: obj.mapName
      });
      setParentSku({...parentSku, [name]: obj.value})
    }
    useEffect(() => {

    }, [parentSku]);

    const mapTree = (arr = []) => {
      let finalProduct = [];
      arr.map((variant) => {
        const tempSp = [];
        variant.map((v) => {
          if (finalProduct.length === 0) {
            tempSp.push(v);
          } else {
            finalProduct.map((p) => {
              tempSp.push({
                name: `${p.name}-${v.name}`,
                value: `${p.value}${v.value}`
              });
            });
          }
        });
        finalProduct = tempSp;
      });
      return finalProduct;
    }

    const createProductChildren = () => {
      const formValues = form.getFieldsValue();
      let childrens = formValues.selected?.map(item => item.values);
      // childrens = childrens.flat(1);
      let variants = styleSelected?.map(item => {
        return {
          ...item,
          values: item.values.filter(v => childrens.includes(v.value))
        }
      });
      variants = variants.filter(item => item.values.length > 0)
      childrens = mapTree(variants.map(item => item.values));
      childrens = childrens.map((item, index) => {
        return {
          name: `${formValues.name}-${item.name}`,
          sku: `${displaySku}-${item.value}`,
          price: 0,
          status: true
        }
      })
      form.setFieldsValue({
        items: childrens
      })
    }
    const onFinish = (data) => {

      const formData = {
        id: productId,
        name: data.name,
        sku: displaySku,
        variants: {
          brand: {
            name: data.brand,
            code: data.brand_code,
          },
          group: {
            name: data.group,
            code: data.group_code
          },
          category: {
            name: data.category,
            code: data.category_code
          },
          style: {
            name: data.style,
            code: data.style_code,
            values: styleSelected
          },
          selected: data.selected
        },
        items: data.items.map(item => {
          return {
            ...item,
            status: item.status === false ? 'draft' : 'active'
          }
        })
      }
      dispatch({
        type: UPDATE_PRODUCT,
        payload: {
          product: formData,
          productId
        }
      })
    }
    useEffect(() => {
      (async () => {
        try {
          const response = await reqProductDetail(productId);
          const data = response.data;
          setDisplaySku(data.sku);
          const {brand, group, style, category, selected} = data.variants ? data.variants : [];
          form.setFieldsValue({
            name: data.name,
            brand: brand?.name,
            brand_code: brand?.code,
            group: group?.name,
            group_code: group?.code,
            category: category?.name,
            category_code: category?.code,
            style: style?.name,
            style_code: style?.code,
            selected: style?.values.map(item => {
              return {
                ...item,
                values: selected?.find(select => select.code === item.code).values
              }
            }),
            items: data.childrens?.map(item => {
              return {...item, status: item.status === PRODUCT_STT_ACTIVE}
            })
          });

          const checked = selected?.map(item => item.values);
          setDefaultSelected(checked);
          setStyleSelected(style.values);
          setItemCount(data.childrens.length);
        } catch (e) {
          message.error(e.message)
        }
      })()
    }, [])

    return (
      <Card title={`S???n ph???m`}>
        <Form
          onFinish={onFinish}
          {...formWrap}
          form={form}>
          <Form.Item
            style={{width: '100%', marginBottom: 10}}
            label={`T??n s???n ph???m`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  name="name"
                  rules={[{required: true}]}
                >
                  <Input disabled placeholder="T??n s???n ph???m"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Space direction={`vertical`} size={`small`}>
                  <b>SKU: {displaySku}</b>
                  <small className={`text-danger`}>#SKU:[Th????ng hi???u][Nh??m][Danh m???c][Lo???i]</small>
                </Space>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Th????ng hi???u`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  name="brand"
                  rules={[{required: true}]}
                >
                  <Input disabled
                         placeholder="Th????ng hi???u s???n ph???m"/>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Nh??m s???n ph???m`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  name="group"
                  rules={[{required: true}]}
                >
                  <Input disabled
                         placeholder="Nh??m s???n ph???m"/>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Danh m???c s???n ph???m`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  name="category"
                  rules={[{required: true}]}
                >
                  <Input disabled placeholder="Danh m???c"/>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Lo???i s???n ph???m`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  name="style"
                  rules={[{required: true}]}
                >
                  <Input disabled
                         placeholder="Lo???i s???n ph???m"/>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/*<Typography.Text italic>Nh???n ch???n c??c gi?? tr??? bi???n th??? ph?? h???p v???i s???n ph???m</Typography.Text>*/}
          {/*<Row className={`mt-2`}>*/}
          {/*  <Col sm={6}>*/}
          {/*    <b>Bi???n th???</b>*/}
          {/*  </Col>*/}
          {/*  <Col sm={16}>*/}
          {/*    <b>Gi?? tr???</b>*/}
          {/*  </Col>*/}
          {/*</Row>*/}
          {/*<Divider/>*/}
          {/*<Form.List*/}
          {/*  name={`selected`} style={{marginTop: 10, width: `100%`}}>*/}
          {/*  {(fields, {add, remove}) => (*/}
          {/*    <>*/}
          {/*      {fields.map(({key, name, fieldKey, ...restField}) => (*/}
          {/*        <div key={name}>*/}
          {/*          <Form.Item>*/}
          {/*            <Row>*/}
          {/*              <Col sm={8}>*/}
          {/*                <Form.Item*/}
          {/*                  {...restField}*/}
          {/*                  noStyle*/}
          {/*                  name={[name, 'name']}>*/}
          {/*                  <Input disabled/>*/}
          {/*                </Form.Item>*/}
          {/*              </Col>*/}
          {/*              <Col sm={16}>*/}
          {/*                <Form.Item*/}
          {/*                  {...restField}*/}
          {/*                  noStyle*/}
          {/*                  initialValue={defaultSelected}*/}
          {/*                  name={[name, 'values']}>*/}
          {/*                  <Checkbox.Group*/}
          {/*                    disabled*/}
          {/*                    defaultValue={defaultSelected}*/}
          {/*                    options={styleSelected[name]?.values}*/}
          {/*                  />*/}
          {/*                </Form.Item>*/}
          {/*              </Col>*/}
          {/*            </Row>*/}
          {/*          </Form.Item>*/}
          {/*        </div>*/}
          {/*      ))}*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</Form.List>*/}
          {/*<Form.Item className={`mt-2`}>*/}
          {/*  <Button disabled onClick={createProductChildren} size={`small`} danger type={`dashed`}>T???o s???n ph???m t??? c??c*/}
          {/*    bi???n*/}
          {/*    th???</Button>*/}
          {/*</Form.Item>*/}
          <Row style={{textAlign: 'left', marginBottom: 10}}>
            <Col sm={6}>
              <Typography.Text strong>T??n s???n ph???m</Typography.Text>
            </Col>
            <Col sm={6}>
              <Typography.Text strong>M?? s???n ph???m</Typography.Text>
            </Col>
            <Col sm={6}>
              <Typography.Text strong>Gi??</Typography.Text>
            </Col>
          </Row>
          <Form.List name={`items`}>
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, fieldKey, ...restField}) => (
                  <div key={name}>
                    <Form.Item>
                      <Row>
                        <Col sm={8}>
                          <Form.Item
                            noStyle
                            {...restField}
                            name={[name, 'name']}>
                            <Input/>
                          </Form.Item>
                        </Col>
                        <Col sm={8}>
                          <Form.Item
                            noStyle
                            {...restField}
                            name={[name, 'sku']}>
                            <Input disabled={name < itemCount}/>
                          </Form.Item>
                        </Col>
                        <Col sm={4}>
                          <Form.Item
                            {...restField}
                            noStyle
                            name={[name, 'price']}>
                            <Input/>
                          </Form.Item>
                        </Col>
                        <Col sm={2}>
                          <Form.Item
                            {...restField}
                            noStyle
                            valuePropName="checked"
                            name={[name, 'status']}>
                            <Switch unCheckedChildren={`draft`} checkedChildren={`active`}/>
                          </Form.Item>
                        </Col>
                        <Col sm={2}>
                          {name >= itemCount &&
                          <Button onClick={() => remove(name)} size={`small`} danger type={`dashed`}>X??a</Button>}
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>
                ))}
                <Button onClick={() => add()}>Th??m m???i</Button>
              </>
            )}
          </Form.List>
          <div style={{textAlign: 'right'}}>
            <Button htmlType={`submit`} type={`primary`}>L??u</Button>
          </div>
        </Form>
      </Card>
    )
  }
;
export default ProductUpdate;

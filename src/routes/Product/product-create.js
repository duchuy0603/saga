import React, {useEffect, useState} from "react";
import {
  Button,
  Card, Checkbox,
  Col, Divider,
  Form,
  Input, message,
  Row,
  Space, Switch, Tooltip,
  Typography
} from "antd";
import {
  formWrap, PRO_CAT_TYPE_ARCHIVE, PRO_CAT_TYPE_BRAND, PRO_CAT_TYPE_GROUP, PRO_CAT_TYPE_STYLE,
} from "../../constants/constant";
import SelectProductCat from "../../components/Input/SelectProductCat";
import {useDispatch} from "react-redux";
import {CREATE_PRODUCT} from "../../constants/ActionTypes";
import {slugify} from "../../util/Helper";

const ProductCreate = () => {
    const [form] = Form.useForm();
    const [styleSelected, setStyleSelected] = useState([]);
    const [displaySku, setDisplaySku] = useState('');
    const [parentSku, setParentSku] = useState({
      name: '', brand: '', group: '', category: '', style: ''
    });
    const dispatch = useDispatch();
    const setFormField = (obj, name) => {
      form.setFieldsValue({
        [name]: obj.mapName,
        [`${name}_code`]: obj.value
      });
      setParentSku({...parentSku, [name]: obj.value})
    }
    useEffect(() => {
      const sku = Object.values(parentSku).map((item, index) => {
        if (index == 0) {
          return '';
        }
        return item.toLowerCase().charAt(0).toUpperCase() + item.toLowerCase().slice(1);
      }).join('');
      if (sku.length > 50) {
        message.error("Chú ý SKU không quá 50 ký tự!");
      }
      setDisplaySku(sku);
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
                name: `${p.name}${v.name}`,
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
      //childrens = childrens?.flat(1);
      let variants = styleSelected.map((item, index) => {
        return {
          ...item,
          values: item.values.filter(v => childrens[index].includes(v.value))
        }
      });

      variants = variants.filter(item => item.values.length > 0)
      childrens = mapTree(variants.map(item => item.values));
      childrens = childrens.map((item, index) => {
        const brandName = formValues.brand?.split('-')[0];
        return {
          name: `${brandName} - ${formValues.name} - ${item.name}`,
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
        items: data.items
      }
      dispatch({
        type: CREATE_PRODUCT,
        payload: {
          product: formData
        }
      })
    }

    return (
      <Card title={`Sản phẩm`}>
        <Form
          onFinish={onFinish}
          {...formWrap}
          form={form}>
          <Form.Item
            style={{width: '100%', marginBottom: 10}}
            label={`Tên sản phẩm`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  noStyle
                  name="name"
                  rules={[{required: true}]}
                >
                  <Input onChange={e => {
                    const {value} = e.target;
                    setFormField({mapName: value, value: `${slugify(value)}-`}, 'name');
                  }} placeholder="Tên sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Space direction={`vertical`} size={`small`}>
                  <b>SKU: {displaySku}</b>
                  <small className={`text-danger`}>#SKU: Tên sản phẩm - [Thương hiệu][Nhóm][Danh mục][Loại]</small>
                </Space>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Thương hiệu`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  noStyle
                  name="brand"
                  rules={[{required: true}]}
                >
                  <Input placeholder="Thương hiệu sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`brand_code`}>
                  <SelectProductCat
                    onSelect={(e, obj) =>
                      setFormField(obj, 'brand')}
                    type={PRO_CAT_TYPE_BRAND}
                    style={{width: '200px'}}
                    placeholder={`Chọn thương hiệu`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Nhóm sản phẩm`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  noStyle
                  name="group"
                  rules={[{required: true}]}
                >
                  <Input placeholder="Nhóm sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`group_code`}>
                  <SelectProductCat
                    onSelect={(e, obj) => setFormField(obj, 'group')}
                    type={PRO_CAT_TYPE_GROUP}
                    style={{width: '200px'}}
                    placeholder={`Chọn nhóm`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Danh mục sản phẩm`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  noStyle
                  name="category"
                  rules={[{required: true}]}
                >
                  <Input placeholder="Danh mục"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`category_code`}>
                  <SelectProductCat
                    onSelect={(e, obj) => setFormField(obj, 'category')}
                    type={PRO_CAT_TYPE_ARCHIVE}
                    style={{width: '200px'}}
                    placeholder={`Chọn danh mục`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            style={{width: '100%', marginBottom: 0}}
            label={`Loại sản phẩm`}>
            <Row>
              <Col sm={12}>
                <Form.Item
                  noStyle
                  name="style"
                  rules={[{required: true}]}
                >
                  <Input placeholder="Loại sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`style_code`}>
                  <SelectProductCat
                    type={PRO_CAT_TYPE_STYLE}
                    style={{width: '200px'}}
                    placeholder={`Chọn loại sản phẩm`}
                    onSelect={(e, obj) => {
                      setFormField(obj, 'style');
                      const selectedRow = obj.object.variants.option.map(variant => {
                        return {
                          name: variant.name,
                          code: variant.code,
                          values: variant.variants.map(value => {
                            return {name: value.name, value: value.code, label: `${value.name}-${value.code}`}
                          })
                        }
                      });
                      setStyleSelected(selectedRow);
                      form.setFieldsValue({
                        selected: selectedRow
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Typography.Text italic>Nhấn chọn các giá trị biến thể phù hợp với sản phẩm</Typography.Text>
          <Row className={`mt-2`}>
            <Col sm={6}>
              <b>Biến thể</b>
            </Col>
            <Col sm={16}>
              <b>Giá trị</b>
            </Col>
          </Row>
          <Divider/>
          <Form.List name={`selected`} style={{marginTop: 10, width: `100%`}}>
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, fieldKey, ...restField}) => (
                  <div key={name}>
                    <Form.Item>
                      <Row>
                        <Col sm={8}>
                          <Form.Item
                            {...restField}
                            noStyle
                            name={[name, 'name']}>
                            <Input disabled/>
                          </Form.Item>
                        </Col>
                        <Col sm={16}>
                          <Form.Item
                            {...restField}
                            noStyle
                            name={[name, 'values']}>
                            <Checkbox.Group
                              options={styleSelected[name]?.values}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          <Form.Item className={`mt-2`}>
            <Button onClick={createProductChildren} size={`small`} danger type={`dashed`}>Tạo sản phẩm từ các biến
              thể</Button>
          </Form.Item>
          <Row style={{textAlign: 'left', marginBottom: 10}}>
            <Col sm={6}>
              <Typography.Text strong>Tên sản phẩm</Typography.Text>
            </Col>
            <Col sm={6}>
              <Typography.Text strong>Mã sản phẩm</Typography.Text>
            </Col>
            <Col sm={6}>
              <Typography.Text strong>Giá</Typography.Text>
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
                            name={[name, 'name']}>
                            <Input/>
                          </Form.Item>
                        </Col>
                        <Col sm={8}>
                          <Form.Item
                            noStyle
                            name={[name, 'sku']}>
                            <Input/>

                          </Form.Item>
                        </Col>
                        <Col sm={6}>
                          <Form.Item
                            noStyle
                            name={[name, 'price']}>
                            <Input/>
                          </Form.Item>
                        </Col>
                        <Col sm={2}>
                          <Form.Item
                            noStyle
                            name={[name, 'status']}>
                            <Switch defaultChecked={[name, 'status']}/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          <div style={{textAlign: 'right'}}>
            <Button htmlType={`submit`} type={`primary`}>Lưu</Button>
          </div>
        </Form>
      </Card>
    )
  }
;
export default ProductCreate;

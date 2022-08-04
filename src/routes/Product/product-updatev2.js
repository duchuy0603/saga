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
      childrens = childrens.flat(1);
      let variants = styleSelected.map(item => {
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
            items: data.childrens.map(item => {
              return {...item, status: item.status === PRODUCT_STT_ACTIVE}
            })
          });
          setParentSku({
            name: `${data.name}-`,
            brand: brand.code,
            group: group.code,
            category: category.code,
            style: style.code
          })
          const checked = selected.map(item => item.values);
          setDefaultSelected(checked.flat(1));
          setStyleSelected(style.values);
          setItemCount(data.childrens.length);
          console.log("DATA: ", data.childrens)
        } catch (e) {
          message.error(e.message)
        }
      })()
    }, [])

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
                  <Input disabled placeholder="Tên sản phẩm"/>
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
                  <Input disabled
                         placeholder="Thương hiệu sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`brand_code`}>
                  <SelectProductCat
                    disabled
                    onSelect={(e, obj) => setFormField(obj, 'brand')}
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
                  <Input disabled
                         placeholder="Nhóm sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`group_code`}>
                  <SelectProductCat
                    disabled
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
                  <Input disabled placeholder="Danh mục"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`category_code`}>
                  <SelectProductCat
                    disabled
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
                  <Input disabled
                         placeholder="Loại sản phẩm"/>
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item name={`style_code`}>
                  <SelectProductCat
                    disabled
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
          <Form.List
            name={`selected`} style={{marginTop: 10, width: `100%`}}>
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
                            initialValue={defaultSelected}
                            name={[name, 'values']}>
                            <Checkbox.Group
                              disabled
                              defaultValue={defaultSelected}
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
            <Button disabled onClick={createProductChildren} size={`small`} danger type={`dashed`}>Tạo sản phẩm từ các
              biến
              thể</Button>
          </Form.Item>

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
                          <Button onClick={() => remove(name)} size={`small`} danger type={`dashed`}>Xóa</Button>}
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>
                ))}
                <Button onClick={() => add()}>Thêm mới</Button>
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
export default ProductUpdate;

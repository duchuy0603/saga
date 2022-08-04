import React, {useState} from "react";
import {Form, Select, Row, Col, Input} from "antd";
import {getDistrictsData, getWardData} from "../util/Helper";
import {useSelector} from "react-redux";

const ProvinceGroup = ({...props}) => {
  const {
    horizontal, columns, label,
    form, districtName, cityName, wardName,
    districtCode, cityCode, wardCode, emptyName,
    rules
  } = props;
  const {cities} = useSelector(({common}) => common);
  const [state, setState] = useState({
    district: [],
    loadingDistrict: false,
    ward: [],
    loadingWard: false
  });
  const setName = (name, value) => {
    form.setFieldsValue({
      [name]: value
    });
  }
  const selectCity = (val, evt) => {
    form.resetFields([districtCode ? districtCode : 'district_code']);
    form.resetFields([wardCode ? wardCode : 'ward_code']);
    setName(cityName, evt.children);
    onGetDistrict(val);
  }

  const selectDistrict = (val, evt) => {
    form.resetFields([wardCode ? wardCode : 'ward_code']);
    setName(districtName, evt.children);
    onGetWard(val);
  }
  const onGetDistrict = (cityKey) => {
    setState({
      ...state,
      ...{loadingDistrict: true}
    });
    getDistrictsData(cityKey, (districts) => {
      setState({
        ...state,
        district: districts,
        loadingDistrict: false,
      });
    });
  }
  const onGetWard = districtKey => {
    setState({
      ...state,
      loadingWard: true,
    });
    getWardData(districtKey, (wards) => {
      setState({
        ...state,
        ward: wards,
        loadingWard: false
      });
    });
  }

  return (
    <Row>
      <Col md={horizontal ? 8 : 24}>
        <Form.Item name={wardName ? wardName : 'ward_name'} hidden><Input /></Form.Item>
        <Form.Item name={cityName ? cityName : 'city_name'} hidden><Input /></Form.Item>
        <Form.Item name={districtName ? districtName : 'district_name'} hidden><Input /></Form.Item>
        <Form.Item
          name={cityCode ? cityCode : 'city_code'}
          rules={rules && rules.city}
          label={`Tỉnh/Thành phố`}
        >
          <Select
            optionFilterProp="children"
            onChange={selectCity}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            placeholder={`Chọn Tỉnh/Thành phố`}>

            {cities ? cities.map((item, index) => {
              return (<Select.Option data-code={item.code} key={index} value={item.code}>
                {item.name}
              </Select.Option>)
            }) : null}
          </Select>
        </Form.Item>
      </Col>
      <Col md={horizontal ? 8 : 24}>
        <Form.Item
          name={districtCode ? districtCode : `district_code`}
          label={`Quận/Huyện`}
          rules={rules && rules.district}
        >
          <Select
            className="gx-mr-3"
            showSearch
            disabled={state.loadingDistrict}
            onChange={selectDistrict}
            placeholder={`Chọn quận/Huyện`}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {state.district.map((item, index) => {
              return (
                <Select.Option key={index} value={item.code}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Col>
      <Col md={horizontal ? 8 : 24}>
        <Form.Item
          name={wardCode ? wardCode : `ward_code`}
          label={`Phường xã`}
          rules={rules && rules.ward}
        >
          <Select
            className="gx-mr-3"
            showSearch
            disabled={state.loadingWard}
            onChange={(val, evt) => setName(wardName, evt.children)}
            placeholder={`Chọn phường/xã`}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {state.ward.map((item, index) => {
              return (
                <Select.Option key={index} value={item.code}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  )
}
export default ProvinceGroup;

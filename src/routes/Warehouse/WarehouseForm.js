import React, {useState} from "react";
import {Form, Input, Select} from "antd";
import {formWrap} from "../../constants/constant";
import {CREATE_WAREHOUSE, UPDATE_WAREHOUSE} from "../../constants/ActionTypes";
import {useDispatch} from "react-redux";
import ProvinceGroup from "../../components/ProvinceGroup";

const WarehouseForm = ({...props}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    district: [],
    ward: [],
    loadingWard: false,
    loadingDistrict: false
  });

  const submitForm = data => {
    if (data.id) {
      dispatch({
        type: UPDATE_WAREHOUSE,
        payload: data
      });
    } else {
      dispatch({
        type: CREATE_WAREHOUSE,
        payload: {...data}
      });
      props.form.resetFields();
    }
    props.hideModal();
  }
  return (
    <Form autoComplete="new-password" form={props.form} {...formWrap} id="warehouseForm"
          onFinish={submitForm}>
      <Form.Item hidden name={`city_name`}><Input/></Form.Item>
      <Form.Item hidden name={`district_name`}><Input/></Form.Item>
      <Form.Item hidden name={`ward_name`}><Input/></Form.Item>
      <Form.Item hidden name={`id`}><Input/></Form.Item>

      <Form.Item
        name={`name`}
        rules={[{required: true, message: `Tên kho bắt buộc!`}]}
        label={`Tên kho`}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name={`type`}
        label={`Loại`}
      >
        <Select>
          <Select.Option value={`pos`}>Pos</Select.Option>
          <Select.Option value={`online`}>Online</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={`status`}
        label={`Trạng thái`}
      >
        <Select>
          <Select.Option value={`active`}>Hoạt động</Select.Option>
          <Select.Option value={`de-active`}>Tạm ngưng</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={`address`}
        label={`Địa chỉ`}
      >
        <Input/>
      </Form.Item>
      <ProvinceGroup
        districtName={`district_name`}
        wardName={`ward_name`}
        cityName={`city_name`}
        form={props.form}/>

      <Form.Item
        name={`platform`}
        label={`Platform`}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name={`platform_id`}
        label={`platform ID`}
      >
        <Input/>
      </Form.Item>
    </Form>
  )
}
export default WarehouseForm;

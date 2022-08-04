import React, {useState} from "react";
import {Button, Card, Form, Input, message, Select, Space} from "antd";
import SelectCustomer from "../../components/Input/SelectCustomer";
import WarehouseProduct from "./WarehouseProduct";
import {formWrap, PO_TYPE_IMPORT, TRANSACTION_IMPORT} from "../../constants/constant";
import {reqCreatePoViaProduct} from "../../appRedux/services/inventory";
import SelectWarehouse from "../../components/Input/SelectWarehouse";


const ImportWarehouse = () => {
  const [form] = Form.useForm();
  const [packages, setPackages] = useState([]);

  const setName = (name, val) => {
    form.setFieldsValue({
      [name]: val
    })
  };
  const onSaveWarehouse = async (data) => {
    if (data.packages.length <= 0) {
      message.error('Hãy chọn sản phẩm nhập kho!');
      return;
    }

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
      message.success('Đã tạo phiếu nhập kho thành công, xin vui lòng chuyển đến mục vận chuyển để theo dõi!', 3);
      form.resetFields();
    } catch (e) {
      message.error(e.message);
    } finally {

    }
  };

  return (
    <Card title={`Tạo phiếu nhập kho`}>
      <Form {...formWrap} onFinish={onSaveWarehouse} form={form}>
        <Form.Item name={`wh_from_name`} hidden><Input/></Form.Item>
        <Form.Item
          label={`Nhà cung cấp`}
          name={`wh_from_id`}
          rules={[{required: true, message: 'Chọn nhà cung cấp!'}]}
        >
          <SelectCustomer
            form={form}
            keyName={`wh_from_id`}
            placeholder={`Nhập tên nhà cung cấp...`}
            type={`vendor`}/>
        </Form.Item>
        <Form.Item name={`warehouse_name`} hidden><Input/></Form.Item>
        <Form.Item
          label={`Kho`}
          rules={[{required: true, message: 'Chọn kho lưu sản phẩm!'}]}
          name={`wh_to_id`}
        >
          <SelectWarehouse/>
        </Form.Item>
        <WarehouseProduct
          form={form}
          packages={packages}
          setPackages={setPackages}/>

       <Space>
         <small className={`text-note`}>* Các trường bắt buộc</small>
         <Button type={`default`}>Hủy</Button>
         <Button type={`primary`} htmlType={`submit`}>Tạo phiếu</Button>
       </Space>
      </Form>
    </Card>
  )
}
export default ImportWarehouse;

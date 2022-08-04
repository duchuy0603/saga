import React, {useState} from "react";
import SaveFilter from "../Inventory/filter/save-filter";
import {Button, Collapse, DatePicker, Form, Input, Select} from "antd";
import {
  FULFILLMENT_STATUS,
  GATE_WAYCODE,
  HARAVAN_ORDER_FINANCE_STATUS, ORDER_SOURCE_STATUS,
} from "../../constants/constant";
import {ClearOutlined, SaveOutlined} from "@ant-design/icons";
import SelectBrand from "../../components/Input/SelectBrand";
import SelectCustomer from "../../components/Input/SelectCustomer";
import SelectAccount from "../../components/Input/SelectAccount";

const {Panel} = Collapse;

const OrderFilter = (props) => {
  const {form, onFinishForm} = props;
  const [visibleSaveFilter, setVisibleSaveFilter] = useState(false);

  return (
    <>
      <SaveFilter saveFilterName={'OrderFilter'}
                  searchForm={form}
                  visibleSaveFilter={visibleSaveFilter}
                  setVisibleSaveFilter={setVisibleSaveFilter} />
      <Collapse defaultActiveKey={"filter"} ghost expandIconPosition={'right'}>
        <Panel key={"filter"} header={"Tìm kiếm nâng cao"}>
          <Form form={form}
                onFinish={onFinishForm}
                size={"small"}
                layout={"inline"}
          >
            <Form.Item
              name={`id`}>
              <Input placeholder={`ID`} />
            </Form.Item>
            <Form.Item
              name={`order_num`}>
              <Input placeholder={`Mã đơn`} />
            </Form.Item>
            <Form.Item
              name={`confirm_user`}>
              <SelectAccount platformValue={true} />
            </Form.Item>
            <Form.Item
              name={`brand_id`}>
              <SelectBrand />
            </Form.Item>
            <Form.Item
              name={`customer_id`}>
              <SelectCustomer />
            </Form.Item>
            <Form.Item
              name={`confirmed_status`}>
              <Select placeholder={`Trạng thái xác nhận`}>
                <Select.Option key="c_s" value={undefined}>Tất cả</Select.Option>
                <Select.Option key="c_s_uc" value={"uncomfirmed"}>Chưa xác nhận</Select.Option>
                <Select.Option key="c_s_c" value={"confirmed"}>Đã xác nhận</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={`created_at`}>
              <DatePicker style={{width: `100%`}} placeholder={`Ngày`} />
            </Form.Item>
            <Form.Item
              name={`fulfillment_status`}>
              <Select placeholder={`Giao hàng`}>
                <Select.Option key="fs_0" value={undefined}>Tất cả</Select.Option>
                {FULFILLMENT_STATUS.map(item => {
                  return <Select.Option key={`fs_${item.code}`} value={item.code}>{item.name}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={`finance_status`}>
              <Select placeholder={`Thanh toán`}>
                <Select.Option value={undefined}>Tất cả</Select.Option>
                {HARAVAN_ORDER_FINANCE_STATUS.map(item => {
                  return <Select.Option
                    key={`finance_${item.code}`}
                    value={item.code}
                  >
                    {item.name}
                  </Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={`gateway_code`}>
              <Select placeholder={`Cổng thanh toán`}>
                <Select.Option value={undefined}>Tất cả</Select.Option>
                {GATE_WAYCODE.map(item => {
                  return <Select.Option
                    key={`gwc_${item.code}`}
                    value={item.code}>
                    {item.name}
                  </Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={`platform_src`}>
              <Select placeholder={`Kênh`}>
                <Select.Option value={undefined}>Tất cả</Select.Option>
                {ORDER_SOURCE_STATUS.map(item => {
                  return <Select.Option
                    key={`p_s_${item.code}`}
                    value={item.code}
                  >
                    {item.name}
                  </Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button htmlType={`submit`} type={`primary`}>Tìm kiếm</Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  form.resetFields();
                  form.submit();
                }}
                icon={<ClearOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={() => setVisibleSaveFilter(true)}
                      icon={<SaveOutlined />}
                      title={"Lưu bộ lọc"} />
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  )
};
export default OrderFilter;

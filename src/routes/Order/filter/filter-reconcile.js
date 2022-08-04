import React, {useState} from "react";
import {Button, Collapse, DatePicker, Form, Input, Select} from "antd";
import SaveFilter from "../../Inventory/filter/save-filter";
import {ORDER_TRANS_TYPE} from "../../../constants/constant";
import {SaveOutlined} from "@ant-design/icons";
import SelectAccount from "../../../components/Input/SelectAccount";

const {Panel} = Collapse;

const FilterReconcile = (props) => {
  const {form, onFinishForm} = props;
  const [visibleSaveFilter, setVisibleSaveFilter] = useState(false);
  return (
    <>
      <SaveFilter saveFilterName={'FilterReconcile'}
                  searchForm={form}
                  visibleSaveFilter={visibleSaveFilter}
                  setVisibleSaveFilter={setVisibleSaveFilter}/>
      <Collapse defaultActiveKey={"filter"} ghost expandIconPosition={'right'}>
        <Panel key={"filter"} header={"Tìm kiếm nâng cao"}>
          <Form
            id={""}
            form={form}
            size={"small"}
            onFinish={onFinishForm}
            layout={"inline"}
          >
            <Form.Item
              label={``}
              name={`order_platform_id`}
            >
              <Input placeholder={`Mã đơn hàng gốc`}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`order_id`}
            >
              <Input placeholder={`Mã đơn hàng hệ thống`}/>
            </Form.Item>

            <Form.Item
              label={``}
              name={`user_id`}
            >
              <SelectAccount minWidth={100} form={form}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`trans_type`}
            >
              <Select style={{minWidth: '100px'}} allowClear placeholder={`Loại đối soát`}>
                {ORDER_TRANS_TYPE && ORDER_TRANS_TYPE.map((type, key) => (
                  <Select.Option key={key} value={type.code}>{type.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={``}
              name={`created_at`}
            >
              <DatePicker placeholder={`Ngày tạo`}
                          style={{width: '100%'}} format={`YYYY/MM/DD`}/>
            </Form.Item>

            <Form.Item>
              <Button htmlType={`submit`}>Tìm kiếm</Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => setVisibleSaveFilter(true)}
                      icon={<SaveOutlined/>}
                      title={"Lưu bộ lọc"}/>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  )
}

export default FilterReconcile;

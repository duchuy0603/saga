import React, {useState} from "react";
import {Button, DatePicker, Form, Input, Select, Collapse} from "antd";
import {useSelector} from "react-redux";
import {PO_ST_C_STATUS, PO_STATUS} from "../../../constants/constant";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import SaveFilter from "./save-filter";
import {SaveOutlined} from "@ant-design/icons";

const {Panel} = Collapse;

const FilterImport = (props) => {
  const {form, onFinishForm} = props;
  const [visibleSaveFilter, setVisibleSaveFilter] = useState(false);
  const {carriers} = useSelector(({auth}) => auth);
  return (
    <>
      <SaveFilter saveFilterName={'FilterImport'}
                  searchForm={form}
                  visibleSaveFilter={visibleSaveFilter}
                  setVisibleSaveFilter={setVisibleSaveFilter}/>
      <Collapse defaultActiveKey={"filter"} ghost expandIconPosition={'right'}>
        <Panel key={"filter"} header={"Tìm kiếm nâng cao"}>
          <Form form={form}
                onFinish={onFinishForm}
                size={"small"}
                layout={"inline"}
          >
            <Form.Item
              label={``}
              name={`sku`}
            >
              <Input placeholder={`Mã vận đơn`}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`status`}
            >
              <Select placeholder={`Trạng thái`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {PO_STATUS.map(item => <Select.Option
                  key={`pos_${item.code}`}
                  value={item.code}
                >
                  {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`stock_check_status`}
            >
              <Select placeholder={`Kiểm đơn`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {PO_ST_C_STATUS.map(item => <Select.Option
                  key={`po_s_t_${item.code}`}
                  value={item.code}
                >
                  {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`created_at`}
            >
              <DatePicker placeholder={`Ngày tạo`}
                          style={{width: '100%'}} format={`YYYY/MM/DD`}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`wh_to_id`}
            >
              <SelectWarehouse placehHolder={"Kho đến"}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`carrier`}
            >
              <Select placeholder={`ĐVVC`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {carriers.map(item => <Select.Option value={item.code}>{item.name}</Select.Option>)}
              </Select>
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
};
export default FilterImport;

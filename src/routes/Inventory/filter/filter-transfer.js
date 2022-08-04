import React, {useState} from "react";
import {Button, Checkbox, Collapse, DatePicker, Form, Input, Select} from "antd";
import {useSelector} from "react-redux";
import {PO_PACKING_STATUS, PO_ST_C_STATUS, PO_STATUS} from "../../../constants/constant";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import SaveFilter from "./save-filter";
import {SaveOutlined} from "@ant-design/icons";
import SelectBrand from "../../../components/Input/SelectBrand";

const {Panel} = Collapse;

const FilterTransfer = ({...props}) => {
  const {form, onFinishForm, saveFilterName = 'FilterTransfer'} = props;
  const [visibleSaveFilter, setVisibleSaveFilter] = useState(false);
  const {carriers} = useSelector(({auth}) => auth);
  return (
    <>
      <SaveFilter saveFilterName={saveFilterName}
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
                  key={`po_s_${item.code}`}
                  value={item.code}
                >
                  {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`packing_status`}
            >
              <Select placeholder={`Đóng gói`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {PO_PACKING_STATUS.map(item => <Select.Option
                  key={`po_p_s_${item.code}`}
                  value={item.code}
                >
                  {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`brand_id`}
            >
              <SelectBrand keyName={`brand_id`} form={form}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`stock_check_status`}
            >
              <Select placeholder={`Kiểm đơn`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {PO_ST_C_STATUS.map(item => <Select.Option
                  key={`po_st_c_${item.code}`}
                  value={item.code}
                >
                  {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`wh_to_id`}
            >
              <SelectWarehouse keyName={`wh_to`} placeholder={"Kho đi"}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`wh_from_id`}
            >
              <SelectWarehouse keyName={`wh_from`} placeholder={"Kho đến"}/>
            </Form.Item>
            <Form.Item
              label={``}
              name={`carrier`}
            >
              <Select placeholder={`ĐVVC`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {carriers.map(item => <Select.Option
                  key={`c_${item.code}`}
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
              name={`print_count`}
            >
              {/*<Select placeholder={`Trạng thái in`}>*/}
              {/*  <Select.Option value={``}>Tất cả</Select.Option>*/}
              {/*  <Select.Option value={0}>Phiếu chưa in</Select.Option>*/}
              {/*  <Select.Option value={1}>Phiếu đã in</Select.Option>*/}
              {/*</Select>*/}
              <Checkbox onChange={e => form.setFieldsValue({print_count: e.target.checked ? 0 : null})}
                        className={'ml-1'}>
                Phiếu chưa in</Checkbox>
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
export default FilterTransfer;

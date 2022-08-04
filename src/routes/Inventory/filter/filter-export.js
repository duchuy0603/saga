import React, {useState} from "react";
import {Button, Checkbox, Collapse, DatePicker, Form, Input, Select} from "antd";
import {PO_PACKING_STATUS, PO_STATUS} from "../../../constants/constant";
import {useSelector} from "react-redux";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import {SaveOutlined} from "@ant-design/icons";
import SaveFilter from "./save-filter";
import SelectBrand from "../../../components/Input/SelectBrand";

const {Panel} = Collapse;

const FilterExport = (props) => {
  const {form, onFinishForm} = props;
  const {carriers} = useSelector(({auth}) => auth);
  const [visibleSaveFilter, setVisibleSaveFilter] = useState(false);

  return (
    <>
      <SaveFilter saveFilterName={'FilterExport'}
                  searchForm={form}
                  visibleSaveFilter={visibleSaveFilter}
                  setVisibleSaveFilter={setVisibleSaveFilter} />
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
              name={`sku`}
            >
              <Input placeholder={`Mã vận đơn`} />
            </Form.Item>
            <Form.Item
              label={``}
              name={`status`}
            >
              <Select placeholder={`Trạng thái`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {PO_STATUS.map(item => <Select.Option key={`s_${item.code}`}
                                                      value={item.code}>{item.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`packing_status`}
            >
              <Select placeholder={`Đóng gói`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {PO_PACKING_STATUS.map(item => <Select.Option key={`p_${item.code}`}
                                                              value={item.code}>{item.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={``}
              name={`brand_id`}
            >
              <SelectBrand />
            </Form.Item>
            <Form.Item
              label={``}
              name={`created_at`}
            >
              <DatePicker placeholder={`Ngày tạo`}
                          style={{width: '100%'}} format={`YYYY/MM/DD`} />
            </Form.Item>
            <Form.Item
              label={``}
              name={`wh_from_id`}
            >
              <SelectWarehouse placeholder={"Kho đi"} />
            </Form.Item>
            <Form.Item
              label={``}
              name={`carrier`}
            >
              <Select placeholder={`ĐVVC`}>
                <Select.Option value={``}>Tất cả</Select.Option>
                {carriers.map(item => <Select.Option key={`c_${item.code}`}
                                                     value={item.code}>
                  {item.name}
                </Select.Option>)}
              </Select>
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
                      icon={<SaveOutlined />}
                      title={"Lưu bộ lọc"} />
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  )
};
export default FilterExport;

import React from "react";
import {Button, Form, Input, Select} from "antd";
import ClearOutlined from "@ant-design/icons/lib/icons/ClearOutlined";
import SelectWarehouse from "../../../components/Input/SelectWarehouse";
import SaveFilter from "./save-filter";
import {SaveOutlined} from "@ant-design/icons";

const FilterProduct = ({...props}) => {
  const {form, onFinishForm, visibleSaveFilter, setVisibleSaveFilter,} = props;


  const onClearSearch = () => {
    if (onFinishForm) {
      onFinishForm();
    }
  };

  return (
    <>
      <SaveFilter saveFilterName={'tab_po'}
                  searchForm={form}
                  visibleSaveFilter={visibleSaveFilter}
                  setVisibleSaveFilter={setVisibleSaveFilter}/>
      <Form form={form}
            onFinish={onFinishForm}
            size={"small"}
            layout={"inline"}
      >
        <Form.Item
          label={``}
          name={`sku`}
        >
          <Input placeholder={`SKU`}/>
        </Form.Item>
        <Form.Item
          label={``}
          name={`wh_from_id`}
        >
          <SelectWarehouse/>
        </Form.Item>
        <Form.Item
          label={``}
          name={`status`}
        >
          <Select allowClear placeholder={`Cảnh báo tồn kho`}>
            <Select.Option value={'compare'}>Tồn kho dưới mức cảnh báo</Select.Option>
            <Select.Option value={'diff'}>Cảnh báo tồn kho khác 0</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type={`primary`} htmlType={`submit`}>Tìm kiếm</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onClearSearch}><ClearOutlined/></Button>
        </Form.Item>
        <Button onClick={() => setVisibleSaveFilter(true)}
                icon={<SaveOutlined/>}
                title={"Lưu bộ lọc"}/>
      </Form>
    </>

  )
};
export default FilterProduct;

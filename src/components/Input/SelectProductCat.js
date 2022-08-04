import React, {useEffect, useState} from "react";
import {Select} from "antd";
import {reqGetProductCategory} from "../../appRedux/services/product";
import {PRO_CAT_TYPE_ARCHIVE, PRO_CAT_TYPE_BRAND} from "../../constants/constant";

const SelectProductCat = ({
                            onSelect,
                            type = PRO_CAT_TYPE_ARCHIVE,
                            placeholder = 'Chọn danh mục sản phẩm',
                            keyName = 'archive',
                            style,
                            disabled,
                            value,

                          }) => {

  const [archives, setArchive] = useState([]);
  const onSearch = async (value) => {
    try {
      const res = await reqGetProductCategory({
        name: value,
        type: type,
        per_page: 5
      });
      setArchive(res.data.data);
    } catch (e) {
      setArchive([]);
    }
  }
  return (
    <Select
      disabled={disabled}
      showSearch
      placeholder={placeholder ? placeholder : "Chọn danh mục sản phẩm"}
      filterOption={false}
      optionFilterProp="children"
      style={{minWidth: "100px", ...style}}
      value={value}
      onChange={onSearch}
      onSearch={onSearch}
      onSelect={(value, obj) => {
        if (typeof onSelect === 'function') {
          onSelect(value, obj)
        }
      }}
    >
      {archives && archives.map(item => (<Select.Option
        key={`${keyName}${item.code}`}
        mapName={`${item.name}-${item.code}`}
        object={item}
        value={item.code}>
        {item.name}
      </Select.Option>))}
    </Select>
  )
}
export default SelectProductCat

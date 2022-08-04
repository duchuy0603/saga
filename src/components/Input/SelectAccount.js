import React, {useEffect, useState} from "react";
import {Select, Space} from "antd";
import {reqGetAccount} from "../../appRedux/services/auth";

const SelectAccount = (props, defaultValue = null) => {
  const {
    placeholder = 'Nhập bí danh, id user, ...',
    onChange,
    value,
    style,
    onSelect,
    keyName = 'user',
    platformValue = false
  } = props;

  const [list, setList] = useState([]);

  const onSearch = async (value = '') => {
    if (value.length > 3 || value.length === 0) {
      try {
        const {data} = await reqGetAccount({
          search: value,
          per_page: 5
        });
        setList(data.data);
      } catch (e) {
        setList([]);
      }
    }
  };
  useEffect(() => {
    if (defaultValue) {
      (async () => await onSearch(defaultValue))();
    }
  }, []);
  return (
    <Select
      showSearch
      allowClear
      placeholder={placeholder}
      filterOption={false}
      onChange={onChange}
      value={value}
      style={{minWidth: "100px", ...style}}
      onSelect={onSelect}
      onFocus={() => onSearch()}
      onSearch={onSearch}
    >
      {list.map(item => (<Select.Option
        key={`${keyName}${item.id}`}
        value={platformValue ? item.open_platform_id : item.id}>
        <Space size={0.5} direction={'vertical'}>
          <span>{item.name} <small className='gx-text-muted'>Alias: {item?.alias}</small></span>
          <small className='gx-text-muted'>Nguồn: {item?.src_platform}</small>
        </Space>
      </Select.Option>))}
    </Select>);
};

export default SelectAccount;

import React, {useState} from "react";
import {Select} from "antd";
import {reqGetCustomer} from "../../appRedux/services/customer";

const SelectUser = (props) => {
  const {
    placeholder = 'Nhập bí danh, id user, ...',
    onChange,
    value,
    style,
    onSelect,
    keyName = 'user'
  } = props;

  const [list, setList] = useState([]);

  const onSearch = async (value = '') => {
    if (value.length > 3 || value.length === 0) {
      try {
        const {data} = await reqGetCustomer({
          search: value,
          per_page: 5
        });
        setList(data.data);
      } catch (e) {
        setList([]);
      }
    }
  };

  return (
    <Select
      showSearch
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
        value={item.id}>
        {item.name}
      </Select.Option>))}
    </Select>);
};

export default SelectUser;

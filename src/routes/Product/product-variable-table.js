import React, {useState} from "react";
import {Button, Popconfirm, Switch, Table, Tag} from 'antd';
import {ProductVariableRow, ProductVariableCell} from "./product-variable-row";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const ProductVariableTable = (props) => {
  const {data = []} = props;
  const [dataSource, setDataSource] = useState(data);

  const colDefined = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'Sku',
      dataIndex: 'sku',
      editable: true,
      render: (sku, row) => {
        return sku;
      }
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      width: '30%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      width: '5%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Switch
            checkedChildren={<CheckOutlined/>}
            unCheckedChildren={<CloseOutlined/>}
            defaultChecked
          />
        ) : null,
    },
  ];

  const handleDelete = (key) => {
    const newData = [...dataSource];
    setDataSource(newData.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
      key: dataSource.length,
      type: ``,
      value: '',
    };
    setDataSource([...dataSource, newData])
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {...item, ...row});
    setDataSource(newData);
  };

  const columns = colDefined.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return <>
    <Table
      size={`small`}
      components={{
        body: {
          row: ProductVariableRow,
          cell: ProductVariableCell
        },
      }}
      pagination={false}
      columns={columns}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
    />
  </>
};
export default ProductVariableTable;

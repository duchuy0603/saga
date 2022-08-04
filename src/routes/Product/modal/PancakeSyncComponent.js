import React, {useEffect, useState} from "react";
import {
  Button,
  Table,
  message,
  Image,
  Form, Spin, Input, Space,
} from "antd";

import {defaultImage} from "../../../util/Helper";
import {
  SearchOutlined,
} from "@ant-design/icons";
import {reqHaravanSyncUpdateProduct} from "../../../appRedux/services/HaranvanSync";
import {reqPancakeProConnectVariants, reqPancakeSyncProVariantsList} from "../../../appRedux/services/PancakeSync";


const PancakeSyncComponent = (props) => {
  const {current} = props;
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 20
  });
  const [isLoading, setIsLoading] = useState(true);

  const getList = async (showPage) => {
    try {
      setIsLoading(true);
      const params = {
        page: showPage,
        ...form.getFieldsValue()
      };
      const res = await reqPancakeSyncProVariantsList(params);
      const {data} = res;
      const {page_number, page_size, total_entries, total_pages} = data;
      setPagination({
        page: page_number,
        total: total_entries,
        pageSize: page_size,
        simple: true
      })
      setList(data);
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePage = ({current}) => {
    console.log(current);
    getList(current);
  };

  //Sync single product
  const onSync = async (pId, currentId) => {
    try {
      setIsLoading(true);
      await reqPancakeProConnectVariants(pId, currentId);
      message.success('Cập nhật thành công!');
    } catch (e) {
      message.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getList(1);
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Form form={form} layout="inline" onFinish={() => getList(1)}>
        <Form.Item name={`ids`}>
          <Input placeholder={`Nhập id cách nhau dấu ,`}/>
        </Form.Item>
        <Form.Item name={`collection_id`}>
          <Input placeholder={`Nhập id collection`}/>
        </Form.Item>
        <Form.Item>
          <Button htmlType={`submit`} type={`primary`} icon={<SearchOutlined/>}>Tìm kiếm</Button>
        </Form.Item>
      </Form>
      <Table
        className={'hide-paginate'}
        rowKey={`id`}
        dataSource={list}
        pagination={pagination}
        onChange={onChangePage}
        columns={[
          {
            title: 'ID - Name', dataIndex: 'id', key: 'id',
            render: (id, raw) => {
              return (
                <Space direction={`horizontal`} size={`small`}>
                  <Image
                    width={40}
                    height={40}
                    src={raw?.images[0] ?? 'error'}
                    fallback={defaultImage()}
                  />
                  <Space size={`small`} direction={`vertical`}>
                    <span className={`pl-1`}>{raw?.product?.name}</span>
                    <small className={`pl-1`}>{raw?.product_id}</small>
                  </Space>
                </Space>
              )
            }
          },
          {
            title: 'Thuộc tính',
            dataIndex: 'fields',
            key: 'fields',
            render: (fields, raw) => {
              return (
                <Space direction={`vertical`} size={`small`}>
                  {raw.fields?.map(field => {
                    return <small>{field.name} : {field.value}</small>
                  })}
                </Space>
              )
            }
          },
          {
            title: 'SKU',
            dataIndex: 'display_id',
            key: 'display_id',
            render: (sku, raw) => {
              return sku;
            }
          },
          {
            title: '', key: 'action', render: raw => {
              return <Button onClick={() => onSync(raw.product_id, current?.id)} size={`small`} type={`danger`}>
                Synchronize
              </Button>
            }
          },
        ]}
      />
    </Spin>
  )
};
export default PancakeSyncComponent;

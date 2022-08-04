import React, {useEffect, useState} from "react";
import {
  Button,
  Table,
  message,
  Image,
  Form, Spin, Input,
} from "antd";

import {defaultImage} from "../../../util/Helper";
import {
  SearchOutlined,
} from "@ant-design/icons";
import {reqHaravanSyncUpdateProduct, reqSyncHaravanGetProducts} from "../../../appRedux/services/HaranvanSync";


const HaravanSyncComponent = () => {
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
      const res = await reqSyncHaravanGetProducts(params);
      const {total, limit, page, list} = res.data;
      console.log(res.data);
      setList(list);
      setPagination({
        current: parseInt(page),
        total: total,
        pageSize: limit,
        simple: true
      })

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
  const onSync = async (pId) => {
    try {
      setIsLoading(true);
      await reqHaravanSyncUpdateProduct(pId);
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
                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                  <Image
                    width={40}
                    height={40}
                    src={raw.image_url}
                    fallback={defaultImage()}
                  />
                  <span className={`pl-1`}>{raw.name}</span>
                </div>
              )
            }
          },
          {title: 'SKU', dataIndex: 'sku', key: 'sku'},
          {title: 'NCC', dataIndex: 'vendor_name', key: 'vendor_name'},
          {title: 'Đơn vị', dataIndex: 'unit', key: 'unit'},
          {
            title: '', key: 'action', render: raw => {
              return <Button onClick={() => onSync(raw.id)} size={`small`} type={`danger`}>
                Synchronize
              </Button>
            }
          },
        ]}
      />
    </Spin>
  )
};
export default HaravanSyncComponent;

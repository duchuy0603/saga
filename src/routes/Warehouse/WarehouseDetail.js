import React, {useEffect, useState} from "react";
import {Button, Card, Descriptions, Divider, message, Modal, Skeleton, Space, Table} from "antd";
import {useParams} from "react-router-dom";
import {reqWarehouseDetail} from "../../appRedux/services/inventory";
import {ShopOutlined, SplitCellsOutlined, SyncOutlined} from "@ant-design/icons";
import {getEmpty, renderWhStt} from "../../util/Helper";
import {reqInventorySync, reqPancakeAsyncGetWhList, reqPancakeConnect} from "../../appRedux/services/PancakeSync";

const WarehouseDetail = (props) => {
    const {whId} = useParams();
    const [detailLoad, setDetailLoad] = useState(false);
    const [wh, setWh] = useState(null);
    const [whPancakeList, setWhPancakeList] = useState([]);
    const [asyncLoading, setAsyncLoading] = useState(false)
    const [syncAcLoad, setSyncAcLoad] = useState(false)
    const [pancakeVisible, setPancakeVisible] = useState(false);
    const [validWh, setValidWh] = useState(null);
    const onLoadPancakeWhList = async () => {
      try {
        setAsyncLoading(true);
        const response = await reqPancakeAsyncGetWhList();
        setWhPancakeList(response.data);
      } catch (e) {
        message.error(e.message)
      } finally {
        setAsyncLoading(false)
      }
    }
    const doSyncPancake = async (pancakeId) => {
      try {
        setAsyncLoading(true);
        const validWh = wh.extract_wh.find(wh => wh.wh_type === 'valid');
        if (!validWh) {
          message.error("Không tìm thấy kho khả dụng!");
          return false;
        }
        await reqPancakeConnect({
          whValidId: validWh.id,
          pancakeId: pancakeId
        });
        setValidWh(validWh);
        message.success("Kết nối thành công!");
        setPancakeVisible(false);
      } catch (e) {
        message.error(e.message)
      } finally {
        setAsyncLoading(false)
      }
    }
    useEffect(() => {
      onLoadPancakeWhList();
      (async () => {
        try {
          setDetailLoad(true)
          const response = await reqWarehouseDetail(whId);
          setWh(response.data);
          const validWh = response.data.extract_wh.find(wh => wh.wh_type === 'valid');
          if (validWh && validWh.pancake_connected) {
            setValidWh(validWh);
          }
        } catch (e) {
          message.error(e.message);
        } finally {
          setDetailLoad(false)
        }
      })();
    }, []);

    const onSyncInventory = async (whId) => {
      try {
        setSyncAcLoad(true)
        const postData = {
          whId
        }
        const response = await reqInventorySync(postData);
        message.success("Đồng bộ thành công!");
      } catch (e) {
        message.error(e.message);
      } finally {
        setSyncAcLoad(false)
      }
    }
    return (
      <>
        <Card title={`${wh ? wh.name : 'loading...'}`}>
          {detailLoad ? <Skeleton active/> : <>
            {
              !wh ? <h4>Kho không tồn tại</h4> : <>
                {wh.extract_wh && wh.extract_wh.map(wh => {
                  const {wh_type, name, platform, city_name, district_name, platform_id, address, type, status} = wh;
                  return (
                    <>
                      <h4><ShopOutlined/> Kho {wh_type === 'valid' ? 'khả dụng' : 'đổi trả'}</h4>
                      <Descriptions>
                        <Descriptions.Item label={`Tên kho`}>{name}</Descriptions.Item>
                        <Descriptions.Item label={`Loại`}>{type}</Descriptions.Item>
                        <Descriptions.Item label={`Platform`}>{platform}</Descriptions.Item>
                        <Descriptions.Item label={`Platform ID`}>{getEmpty(platform_id)}</Descriptions.Item>
                        <Descriptions.Item label={`Trạng thái`}>{renderWhStt(status)}</Descriptions.Item>
                        <Descriptions.Item label={`Địa chỉ`}>{getEmpty(address)}</Descriptions.Item>
                        <Descriptions.Item label={`Tỉnh/Thành phố`}>{getEmpty(city_name)}</Descriptions.Item>
                        <Descriptions.Item label={`Quận/Huyện`}>{getEmpty(district_name)}</Descriptions.Item>
                      </Descriptions>
                      <Divider/>
                    </>
                  )
                })}
                <Divider/>
                <Space size={`small`} align={`center`}>
                  <span>Kế nối Pancake :</span> <Button loading={syncAcLoad} onClick={() => setPancakeVisible(true)}
                                                        className={`mb-0`}
                                                        size={`small`} danger type={`dashed`}>Kết
                  nối</Button>
                  {validWh?.pancake_connected?.platform_id &&
                  <Button loading={syncAcLoad} onClick={() => onSyncInventory(validWh.id)} className={`mb-0`}
                          type={`dashed`} danger
                          size={`small`}><SyncOutlined/> Sync inventory</Button>}
                  {validWh && <>
                    <Divider/>
                    <span>ID kho kết nối: {validWh.id} | ID kho pancake: {validWh.pancake_connected?.platform_id}</span>
                  </>}

                </Space>
              </>
            }</>}
          <Modal
            width={720}
            onCancel={() => setPancakeVisible(false)}
            visible={pancakeVisible}
            title={`Kết nối kho Pancake`}
            footer={[
              <Button onClick={() => setPancakeVisible(false)}>Đóng</Button>
            ]}
          >
            <Table
              size={`small`}
              pagination={false}
              columns={[
                {title: 'Tên kho', dataIndex: 'name', key: 'name'},
                {
                  title: 'Info', dataIndex: 'id', key: 'id', render: (id, raw) => {
                    return (
                      <Space direction={`vertical`} size={`small`}>
                        <small>ID: {id}</small>
                        <small>Address: {getEmpty(raw.full_address)}</small>
                        <small>Phone: {getEmpty(raw.phone_number)}</small>
                      </Space>
                    )
                  }
                },
                {
                  title: 'Action',
                  render: raw => <Button onClick={() => doSyncPancake(raw.id)}
                                         icon={<SyncOutlined spin={asyncLoading}/>}
                                         danger type={`dashed`}
                                         size={"small"}>Connect</Button>
                },
              ]}
              dataSource={whPancakeList}/>
          </Modal>
        </Card>
      </>
    )
  }
;
export default WarehouseDetail;

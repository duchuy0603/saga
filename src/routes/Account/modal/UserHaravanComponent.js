import React, {useEffect, useState} from "react";
import {Button, message, Space, Spin, Table} from "antd";
import {reqHrvGetUser, reqHrvSyncUser} from "../../../appRedux/services/HaranvanSync";
import {getEmpty} from "../../../util/Helper";

const UserHaravanComponent = ({onClose, getAccount}) => {
  const [syncLoad, setSyncLoad] = useState(false);
  const [syncAction, setSyncAction] = useState(false);
  const [hrvList, setHrvList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  });

  const onHrvGetListUser = async (params = {}) => {
    try {
      setSyncLoad(true);
      const response = await reqHrvGetUser(params);
      const {list, limit, page} = response.data;
      setHrvList(list);
      setPagination({
        ...pagination,
        pageSize: parseInt(limit),
        current: parseInt(page),
        simple: true
      })
    } catch (e) {
      message.error(e.message);
    } finally {
      setSyncLoad(false);
    }
  };

  const onSync = async (id) => {
    try {
      setSyncAction(true);
      await reqHrvSyncUser({
        user_id: id
      });
      //onClose();
     // getAccount();
      message.success('Cập nhật thành công!');
    } catch (e) {
      message.error(e.message);
    } finally {
      setSyncAction(false)
    }
  };

  useEffect(() => {
    onHrvGetListUser({page: 1});
  }, []);

  return (
    <Spin spinning={syncLoad}>
      <Table
        className={'hide-paginate'}
        rowKey={`id`}
        dataSource={hrvList}
        pagination={pagination}
        onChange={({current}) => onHrvGetListUser({page: current})}
        columns={[
          {title: 'ID ', dataIndex: 'id', key: 'id'},
          {
            title: 'Name', dataIndex: 'screen_name', key: 'screen_name',
            render: (screen_name, raw) => {
              return <Space size={1} direction={`vertical`}>
                <span>{raw.first_name} {raw.last_name}</span>
                <span>{screen_name} : {getEmpty(raw.screen_name)}</span>
              </Space>
            }
          },
          {title: 'Email', dataIndex: 'email', key: 'email'},
          {title: 'Phone', dataIndex: 'phone', key: 'phone'},
          {
            title: '', key: 'action', render: raw => {
              return <Button loading={syncAction} onClick={() => onSync(raw.id)} size={`small`} type={`danger`}>
                Synchronize
              </Button>
            }
          },
        ]}
      />
    </Spin>
  )
};

export default UserHaravanComponent;

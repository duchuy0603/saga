import React, {useEffect} from "react";
import {Image, Spin, Table} from "antd";
import {defaultImage} from "../../util/Helper";
import {GET_PO} from "../../constants/ActionTypes";
import {useDispatch, useSelector} from "react-redux";

const TabReturn = ({...props}) => {
  const {purchaseOrders, listLoading, pagination} = useSelector(({inventory}) => inventory);
  const dispatch = useDispatch();

  useEffect(() => {
    getPurchaseOrders();
  }, []);

  const getPurchaseOrders = (params = {}) => {
    dispatch({
      type: GET_PO,
      payload: params
    });
  };

  const onChangePage = ({current, pageSize}) => {
    getPurchaseOrders({page: current});
  };

  return (
    <Spin spinning={listLoading}>
      {/*<FilterImport onSearch={search} />*/}
      <Table
        onChange={onChangePage}
        dataSource={purchaseOrders}
        pagination={pagination}
        columns={[
          {
            title: 'ID', dataIndex: 'id', key: 'id',
            render: (id, raw) => {
              return (
                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                  <Image
                    width={50}
                    height={50}
                    src="error"
                    fallback={defaultImage()}
                  />
                  <a className={`pl-1`} href={`/inventory/po/${id}`}>#{id}.{raw.name}</a>
                </div>
              )
            }
          },
          {title: 'Nhà cung cấp', dataIndex: 'ncc', key: 'ncc'},
          {title: 'Trạng thái', dataIndex: 'warehouse_name', key: 'warehouse_name'},
          {title: 'Giá trị', dataIndex: 'warehouse_name', key: 'warehouse_name'},
          {title: 'Nhập', dataIndex: 'unit', key: 'unit'},
          {title: 'Thanh toán', dataIndex: 'inventory', key: 'inventory'},
          {title: 'Dự kiến', dataIndex: 'alert', key: 'alert'},
        ]}
      />
    </Spin>
  )
};
export default TabReturn;

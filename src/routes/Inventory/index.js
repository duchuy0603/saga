import React, {useState} from "react";
import {Button, Card, Modal, Tabs} from 'antd';
import TabProduct from "./tab-product";
import TabImport from "./tab-import";
import {Switch, Route} from "react-router-dom";
import TabPo from "./tab-po";
import TabExport from "./tab-export";
import TabTransfer from "./tab-transfer";
import TabReturn from "./tab-return";
import {SyncOutlined} from "@ant-design/icons";
import WarehousePancakeSyncList from "./modals/WarehousePancakeSyncList";

const {TabPane} = Tabs;
const Inventory = () => {
  const [syncVisible, setSyncVisible] = useState(false);
  const onSyncWhProduct = () => {
  }
  return (
    <div>
      {/*<Row>*/}
      {/*  <Col md={6}>*/}
      {/*    <Metrics title={`Tổng tồn`}>*/}
      {/*      <div className={`text-right`}>*/}
      {/*        <h2 className={`m-0 p-0`}>{renderNumberFormat(report.total_stock)}</h2>*/}
      {/*      </div>*/}
      {/*    </Metrics>*/}
      {/*  </Col>*/}
      {/*  <Col md={6}>*/}
      {/*    <Metrics title={`Tổng giá bán`}>*/}
      {/*      <div className={`text-right`}>*/}
      {/*        <h2 className={`m-0 p-0`}>0đ</h2>*/}
      {/*      </div>*/}
      {/*    </Metrics>*/}
      {/*  </Col>*/}
      {/*  <Col md={6}>*/}
      {/*    <Metrics title={`Tổng giá trị`}>*/}
      {/*      <div className={`text-right`}>*/}
      {/*        <h2 className={`m-0 p-0`}>0đ</h2>*/}
      {/*      </div>*/}
      {/*    </Metrics>*/}
      {/*  </Col>*/}
      {/*  <Col md={6}>*/}
      {/*    <Metrics title={`Tổng lợi nhuận`}>*/}
      {/*      <div className={`text-right`}>*/}
      {/*        <h2 className={`m-0 p-0`}>0đ</h2>*/}
      {/*      </div>*/}
      {/*    </Metrics>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      <Card>
        <Route
          path={`/inventory/:key?`}
          render={({match, history}) => {
            return (
              <Switch>
                <Tabs
                  tabBarExtraContent={<Button onClick={() => setSyncVisible(true)} danger type={`dashed`}
                                              size={`small`}><SyncOutlined/> Pancake Sync</Button>}
                  onTabClick={key => history.push(`/inventory/${key}`)}
                  defaultActiveKey={match.params.key}>
                  <TabPane tab={`Tồn kho`} key="">
                    <TabProduct/>
                  </TabPane>
                  <TabPane tab={`Vận chuyển`} key="po-all">
                    <TabPo/>
                  </TabPane>
                  <TabPane tab={`Phiếu xuất`} key="po-export">
                    <TabExport/>
                  </TabPane>
                  <TabPane tab={`Phiếu nhập`} key="po-import">
                    <TabImport/>
                  </TabPane>
                  <TabPane tab={`Phiếu chuyển kho`} key="po-transfer">
                    <TabTransfer/>
                  </TabPane>
                  <TabPane tab={`Phiếu trả hàng`} key="po-return">
                    <TabReturn/>
                  </TabPane>
                </Tabs>
              </Switch>
            )
          }}
        >

        </Route>
        <Modal
          width={720}
          onCancel={() => setSyncVisible(false)}
          visible={syncVisible}
          title={`Đồng bộ tồn kho`}
          footer={[<Button onClick={() => setSyncVisible(false)} type={`primary`}>Đóng</Button>]}
        >
          <WarehousePancakeSyncList/>
        </Modal>
      </Card>
    </div>
  )
}
export default Inventory;

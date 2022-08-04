import React from "react";
import {Timeline, Button} from 'antd';
import {EditOutlined, PlusOutlined} from "@ant-design/icons";

const TabPoHistory = () => {
  return (
    <div>
      <Button>
        <PlusOutlined/> Thêm ghi chú
      </Button>
      <Timeline mode={`left`}>
        <Timeline.Item dot={<EditOutlined/>} color={`red`} label="2015-09-01">Create a services</Timeline.Item>
        <Timeline.Item label="2015-09-01 09:12:11">Solve initial network problems</Timeline.Item>
        <Timeline.Item>Technical testing</Timeline.Item>
        <Timeline.Item label="2015-09-01 09:12:11">Network problems being solved</Timeline.Item>
      </Timeline>
    </div>
  )
}
export default TabPoHistory;

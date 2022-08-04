import React, {useState} from "react";
import {Timeline, Button, Modal, Input} from 'antd';
import {EditOutlined, PlusOutlined} from "@ant-design/icons";

const TabHistory = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {TextArea} = Input;

  const showAddNote = () => {
    setVisible(true);
  };

  const handleSave = () => {
    setMessage('Đang lưu lại ghi chú');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000)
  }

  const handleCancel = () => {
    setVisible(false);
  }

  return (
    <div>
      <Timeline mode={`left`}>
        <Timeline.Item dot={<EditOutlined/>} color={`red`} label="2015-09-01">Create a services</Timeline.Item>
        <Timeline.Item label="2015-09-01 09:12:11">Solve initial network problems</Timeline.Item>
        <Timeline.Item>Technical testing</Timeline.Item>
        <Timeline.Item label="2015-09-01 09:12:11">Network problems being solved</Timeline.Item>
      </Timeline>
      <Button type="primary" onClick={showAddNote}>
        <PlusOutlined/> Thêm ghi chú
      </Button>
      <Modal
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={handleSave}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" confirmLoading={confirmLoading} onClick={handleSave}>
            Lưu
          </Button>,
        ]}
      >

        <TextArea rows={4} style={{marginTop: 15}}/>

      </Modal>
    </div>
  )
}
export default TabHistory;

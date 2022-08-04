import React, {useRef, useState} from "react";
import {Button, Form, Input, message, Modal, Progress, Space} from "antd";
import {reqImportExcel} from "../../../appRedux/services/common";


const ModalImport = (props) => {
  const {visible, setVisible, callback, importType = 'category'} = props;
  const [fileImport, setFileImport] = useState();
  const [isUpload, setIsUpload] = useState(false);
  const [fileInfo, setFileInfo] = useState({
    text: 'Nhấp hoặc kéo thả file vào ô này',
    size: 0,
    percentUpload: 0
  })
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("importType", importType);
    formData.append("file", fileImport);
    try {
      setIsUpload(true);
      await reqImportExcel(formData, {
        onUploadProgress: progressEvent => {
          const {loaded, total} = progressEvent;
          setFileInfo({
            ...fileInfo,
            percentUpload: (loaded / total) * 100
          })
        }
      });
      message.success("Nhập liệu thành công!");
      if (typeof callback == "function") {
        callback();
      }
      setVisible(false);
    } catch (e) {
      message.error(e.message)
    } finally {
      setIsUpload(false);
    }
  }
  return (
    <Modal
      title={`Import file`}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => setVisible(false)} type={`default`}>Hủy</Button>,
        <Button loading={isUpload} onClick={onSubmit} type={`primary`}>Nhập liệu</Button>
      ]}
    >
      <div className={`import-area`}>
        <div className={`import-file`}>
          <Input onChange={e => {
            const file = e.target.files[0];
            setFileImport(file);
            setFileInfo({
              ...fileInfo,
              text: file.name,
              size: file.size,
            })
          }} type={`file`}/>
          <span>{fileInfo.text}</span>
          {isUpload && <div className={`p-3`}>
            <Progress percent={fileInfo.percentUpload} status="active"/>
          </div>}
        </div>
        <div className={`import-content`}>
          <Space direction={`vertical`} size={`small`}>
            <small># File không quá 10MB dung lượng</small>
            <small># Định dạng file nhập liệu *.xlsx</small>
          </Space>
        </div>
      </div>
    </Modal>
  )
}
export default ModalImport;

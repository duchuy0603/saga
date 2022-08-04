import React from "react";
import {Upload, Button} from "antd";
import {handleUploadMedia} from "../appRedux/services/common";

const UploadImage = ({...props}) => {

  return (
    <div>
      <Upload
        name={props.name ? props.name : ''}
        listType="picture"
        className="upload-list-inline"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      >
        <Button type={'link'}>Upload</Button>
      </Upload>
    </div>
  )
}

export default UploadImage;

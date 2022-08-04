import React, {useState} from "react";
import {Button, DatePicker, Form, Input, Modal, Select, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {formWrap} from "../../../constants/constant";

const TabPoCheckGoods = ({...props}) => {
  const {po} = props;
  const [form] = Form.useForm();
  const [state, setState] = useState({
    modalVisible: false
  });
  const addCheckGoods = () => {
    setState({
      modalVisible: true
    })
  }
  return (
    <div>
      <Modal
        footer={[
          <small className={`text-note danger`}>* Thông tin bắt buộc</small>,
          <Button onClick={() => setState({modalVisible: false})}>Hủy</Button>,
          <Button type={`primary`} htmlType={`submit`} form={`payment`}>Lưu</Button>,
        ]}
        onCancel={() => setState({modalVisible: false})}
        visible={state.modalVisible}
        title={`#P0UA-001`}>
        <Form id={`payment`} form={form} {...formWrap}>
          <Form.Item
            label={`Mã vận đơn`}
            name={`code`}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={`Trạng thái`}
            name={`status`}
          >
            <Select>
              <Select.Option>Chưa đối soát</Select.Option>
              <Select.Option>Đã thanh toán</Select.Option>
              <Select.Option>Hoàn</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={`Ngày nhận`}
            name={`date_payment`}
          >
            <DatePicker style={{width: '100%'}} showTime/>
          </Form.Item>
          <Form.Item
            label={`Mã tracking`}
            name={`tracking`}
          >
            <Input/>
          </Form.Item>
          <Form.List name={`products`}>
            {(fields, {add, remove}) => {
              return (
                <table className={`table table-bordered`}>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>SL yêu cầu</th>
                    <th>Đã nhận</th>
                    <th>Số lượng gói</th>
                  </tr>
                  </thead>
                  {fields.map(({key, name, fieldKey, ...restField}) => (
                    <tr>
                      <td>1</td>
                      <td>SP 1</td>
                      <td>0</td>
                      <td>0</td>
                      <td>
                        <Form.Item
                          {...restField}
                          name={[name, 'sl_yc']}
                        >
                        </Form.Item>
                      </td>
                    </tr>
                  ))}
                </table>
              )
            }}
          </Form.List>
        </Form>
      </Modal>

      <Table
        dataSource={[
          {id: 1, name: 'demo'}
        ]}
        columns={[
          {title: 'Mã số', dataIndex: 'name'},
          {title: 'Ngày nhận'},
          {title: 'Hóa đơn liên quan'},
          {title: 'Trạng thái'},
          {
            title: '', render: raw => {
              return (
                <div>
                  <Button type={"primary"} size={`small`}><EditOutlined/></Button>
                  <Button danger size={`small`}><DeleteOutlined/></Button>
                </div>
              )
            }
          }
        ]}
        footer={() => <Button onClick={addCheckGoods}>Thêm phiếu kiểm</Button>}
      />
    </div>
  )
}
export default TabPoCheckGoods;

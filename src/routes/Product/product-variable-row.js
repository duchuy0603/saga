import React, {useContext, useEffect, useRef, useState} from "react";
import {Form, Input} from "antd";

const EditableContext = React.createContext(null);

export const ProductVariableRow = ({index, ...props}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const ProductVariableCell = ({
                                      title,
                                      editable,
                                      children,
                                      dataIndex,
                                      record,
                                      handleSave,
                                      ...restProps
                                    }) => {
  const [editing, setEditing] = useState(true);
  const [checkValue, setCheckValue] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    form.validateFields([dataIndex]);
  }, [checkValue]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const getRules = () => {
    switch (dataIndex) {
      case "value":
        return [
          {
            required: true,
            message: `${title} không được rỗng`,
          },
          {
            pattern: /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+(;[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+)*$/,
            message: `${title} không được chứa giá trị rỗng, chỉ chứa chữ và số, không ký tự đặc biệt`,
          }
        ];
      default:
        return [
          {
            required: true,
            message: `${title} không được rỗng.`,
          },
        ];
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields([dataIndex]);
      toggleEdit();
      handleSave({...record, ...values});
      await form.validateFields();
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={getRules()}
      >
        <Input width={"100%"}
               ref={inputRef}
               placeholder={dataIndex !== "value" ? "Tên loại" : "Giá trị phân cách nhau bằng dấu ;"}
               onPressEnter={save}
               onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

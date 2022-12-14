import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, Modal, Popconfirm, Space} from "antd";

const SaveFilter = (props) => {
  const {saveFilterName, searchForm, visibleSaveFilter, setVisibleSaveFilter} = props;
  const [activeFilter, setActiveFilter] = useState(-1);
  const [filterList, setFilterList] = useState(null);
  const [saveFilterForm] = Form.useForm();

  useEffect(() => {
    if (!filterList) {
      setFilterList(onGetFilter());
    }
  }, []);

  const onGetFilter = () => {
    let filterArr;
    try {
      filterArr = JSON.parse(localStorage.getItem(saveFilterName));
    } catch (e) {
      filterArr = [];
    }
    if (filterArr == null) {
      filterArr = [];
    }
    return filterArr;
  };

  const onLoadFilter = (filterIdx) => {
    if (filterIdx >= filterList.length) {
      filterIdx = -1;
    }

    saveFilterForm.resetFields();
    searchForm.resetFields();
    if (filterIdx > -1) {
      const {name, formValues} = filterList[filterIdx];
      searchForm.setFieldsValue(formValues);
      saveFilterForm.setFieldsValue({
        name: name
      })
    }

    searchForm.submit();
    setActiveFilter(filterIdx);
  };

  const onRemoveFilter = (filterIdx) => {
    if (filterIdx >= filterList.length) {
      filterIdx = -1;
    }

    const newList = [...filterList];
    if (filterIdx > -1) {
      newList.splice(filterIdx, 1);
    }
    localStorage.setItem(saveFilterName, JSON.stringify(newList));
    setFilterList(newList);
    onLoadFilter(-1);
  };

  const onSaveFilter = (values) => {
    const {name} = values;
    const formValues = searchForm.getFieldsValue();
    const newFilter = {
      name,
      formValues
    };
    upsertFilter(newFilter);
    setVisibleSaveFilter(false);
  };

  const upsertFilter = (newFilter) => {
    let filterArr = onGetFilter();
    let idx = filterArr.findIndex(item => item?.name === newFilter.name);
    if (idx > -1) {
      filterArr[idx] = newFilter;
    } else {
      filterArr.push(newFilter);
      idx = filterArr.length - 1;
    }
    localStorage.setItem(saveFilterName, JSON.stringify(filterArr));
    setFilterList(filterArr);
    return idx;
  };

  return <>
    <Space split={<Divider type={"vertical"} />} className="gx-mb-3">
      <small>B??? l???c</small>
      <Button type={"link"} size={'small'}
              onClick={() => onLoadFilter(-1)}
              className={`gx-mb-0 ${activeFilter < 0 ? "gx-text-black" : "text-mute"}`}
      >
        M???c ?????nh
      </Button>
      {filterList && filterList.map((item, idx) => {
        return <span key={`fl_${idx}`}>
            <Button onClick={() => onLoadFilter(idx)}
                    type={"link"} size={'small'}
                    className={`gx-mb-0  gx-p-0 ${activeFilter !== idx ? "text-mute" : "gx-text-black"}`}
            >
              {item.name}
            </Button>
            <Popconfirm title={"B???n c?? mu???n x??a kh??ng"} onConfirm={() => onRemoveFilter(idx)}>
              <Button type={"link"}
                      size={'small'}
                      className={`gx-mb-0 gx-p-0 ${activeFilter !== idx ? "text-mute" : "gx-text-black"}`}
              >
                x
              </Button>
            </Popconfirm>
          </span>
      })}
    </Space>
    <Modal
      title={"L??u b??? l???c"}
      visible={visibleSaveFilter}
      onCancel={() => setVisibleSaveFilter(false)}
      footer={[
        <Button key="cancel"
                onClick={() => setVisibleSaveFilter(false)}>
          H???y
        </Button>,
        <Button form="saveFilterForm" key="submit" htmlType="submit">
          L??u
        </Button>
      ]}
    >
      <Form
        id={"saveFilterForm"}
        form={saveFilterForm}
        name={"saveFilterForm"}
        onFinish={onSaveFilter}
      >
        <Form.Item name={"name"} rules={[
          {required: true, message: "Thi???u t??n"}
        ]}>
          <Input placeholder={"Nh???p t??n ????? l??u"} max={50} />
        </Form.Item>
      </Form>
    </Modal>
  </>
};

export default SaveFilter;

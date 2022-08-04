import React from 'react';
import {Badge, message, notification, Space, Tag, Tooltip} from 'antd';
import moment from 'moment';

import IntlMessages from './IntlMessages';
import {getDistrictList, getWardList} from '../appRedux/services/common';
import NumberFormat from 'react-number-format';
import {
  ADJUSTMENT_STT,
  FULFILLMENT_STATUS,
  GATE_WAYCODE,
  HARAVAN_FF_STATUS,
  HARAVAN_ORDER_FINANCE_STATUS,
  ORDER_TRANS_TYPE,
  PAYMENT_COD_CONFIRM_C,
  PAYMENT_STATUS,
  PLATFORM_HARAVAN,
  PO_DELIVER_STATUS,
  PO_PACKING_STATUS,
  PO_ST_C_STATUS,
  PO_STATUS,
  PO_STT_LIST,
  PO_TYPE_IMPORT,
  PO_TYPE_REFUND,
  PO_TYPE_TRANSFER,
  PO_TYPES,
  SERVICE_AUTH,
  SERVICE_CUSTOMER,
  SERVICE_INVENTORY,
  SERVICE_ORDER,
  STOCK_CHECK_STATUS,
  USER_ACTIVE,
  USER_ROLES,
} from "../constants/constant";
import Moment from "react-moment";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";

export const axiosCatch = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data: ', error.response.data);
    console.error('Response status', error.response.status);
    console.error('Response header', error.response.headers);
    const {data} = error.response;
    const {errors, code, message} = data;
    let msg = message;
    if (!message && errors.length > 0) {
      msg = errors[Object.keys(errors)[0]][0];
    }
    throw {
      data: errors,
      message: msg,
      code: code
    };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error('Request', error.request);
    throw {
      message: error.message,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
    throw {
      message: error.message,
    };
  }
};

export const showNotify = (title = 'Wellcome', text = 'Notify', type = 'success') => {
  notification[type]({
    message: title,
    description: text,
    placement: 'topRight',
  });
};

export const findIndex = (args = [], searchValue, key = 'id') => {
  let index = false;
  args.forEach((item, i) => {
    if (item[key] === searchValue) {
      index = i;
    }
  });
  return index;
};
export const default_gift = () => {
  return 'data:image/png;base64,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';
};
export const defaultImage = () => {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';
};

export const date = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getDay() + '/' + (date.getMonth() - 1) + '/' + date.getFullYear();
};

export const limitText = (text, length = 1, prefix = '...') => {
  if (text.length > length) {
    return text.slice(0, length) + prefix;
  }
  return text;
};

export const dateFormat = (date) => {
  return moment.unix(date).format('DD/MM/YYYY');
};
export const textLeading = (num, size = 6) => {
  let s = num + "xxx";
  return s.substr(s.length - size);
};
export const dateTimeFormat = (date) => {
  return moment.unix(date).format('DD/MM/YYYY H:i:s');
};

export const renderEventStatus = (status, size = 'm', endDate = null) => {
  let color = '';
  let content = 'Unknown';

  if (endDate && endDate < new Date().getTime() / 1000) {
    status = -1;
  }

  switch (status) {
    case 0: {
      color = 'danger';
      content = <IntlMessages id={'in-active'}/>;
      break;
    }
    case 1: {
      color = 'success';
      content = <IntlMessages id={'active'}/>;
      break;
    }
    case -1: {
      color = 'default';
      content = 'Hết hạn';
      break;
    }
  }
  let fSize = '14px';
  switch (size) {
    case 's':
      fSize = '11px';
      break;
    case 'l':
      fSize = '20px';
      break;
  }
  return <Badge status={color} text={content} style={{fontSize: fSize}}/>;
};


export const renderEventType = (type, size = 'm') => {
  let content = 'Unknown';
  let fSize = '12px';
  switch (type) {
    case 0:
      content = <IntlMessages id={'er.type.manual'}/>;
      break;
    case 1:
      content = <IntlMessages id={'er.type.auto'}/>;
      break;
  }
  switch (size) {
    case 's':
      fSize = '10px';
      break;
    case 'l':
      fSize = '20px';
      break;
  }
  return <Tag style={{fontSize: fSize}}>{content}</Tag>;
};

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
export const userLogin = () => {
  if (!localStorage.getItem('token')) {
    showNotify('Alert!', 'Phiên đăng nhập Hết hạn!');
    return null;
  }
  return parseJwt(localStorage.getItem('token'));
};

export const listCities = () => {
  if (localStorage.getItem('cities')) {
    return JSON.parse(localStorage.getItem('cities'));
  }
  return [];
};

export const listDistricts = (cityKey) => {
  const cityDistrictKey = `c_${cityKey}_d`;
  if (localStorage.getItem(cityDistrictKey)) {
    return JSON.parse(localStorage.getItem(cityDistrictKey));
  }
  return [];
};
export const listWards = (districtKey) => {
  const wardDistrictKey = `d_${districtKey}_w`;
  if (localStorage.getItem(wardDistrictKey)) {
    return JSON.parse(localStorage.getItem(wardDistrictKey));
  }
  return [];
};

export const saveLocalDistrict = (cityKey, districts) => {
  const cityDistrictKey = `c_${cityKey}_d`;
  localStorage.setItem(cityDistrictKey, JSON.stringify(districts));
};
export const saveLocalWard = (districtKey, wards) => {
  const districtWardKey = `d_${districtKey}_w`;
  localStorage.setItem(districtWardKey, JSON.stringify(wards));
};

export function pad(n) {
  return n < 10 ? '0' + n : n;
}

export function getWardData(districtKey, callBack) {
  const wards = listWards(districtKey);

  if (wards.length === 0) {
    let saveWards = [];
    getWardList(districtKey)
      .then((res) => {
        let data = res.data;
        for (const [key, value] of Object.entries(data)) {
          saveWards.push(value);
        }
        saveLocalWard(districtKey, saveWards);
        callBack(saveWards);
      })
      .catch((e) => {
        message.error(e.message);
      });
  } else {
    callBack(wards);
  }
}

export function getDistrictsData(cityKey, callBack) {
  const districts = listDistricts(cityKey);
  if (districts.length === 0) {
    let saveDistricts = [];
    getDistrictList(cityKey)
      .then((res) => {
        let data = res.data;
        for (const [key, value] of Object.entries(data)) {
          saveDistricts.push(value);
        }
        saveLocalDistrict(cityKey, saveDistricts);
        callBack(saveDistricts);
      })
      .catch((e) => {
        message.error(e.message);
      });
  } else {
    callBack(districts);
  }
}

export const setDistrict = (city) => {
  let arr = [];
  let district = null;
  getDistrictList(city).then((res) => {
    district = res.data;
    for (const [key, value] of Object.entries(district)) {
      arr.push(value);
    }
  });
  return arr;
};


export const getOpenTabs = () => {
  let openedTabs = JSON.parse(localStorage.getItem('openedTabs'));
  if (!openedTabs) {
    openedTabs = [];
  }
  return openedTabs;
};

export const addOpenTab = (giftTicketId) => {
  let openedTabs = getOpenTabs();
  if (openedTabs.findIndex((item) => item === giftTicketId) < 0) {
    openedTabs.push(giftTicketId);
  }
  localStorage.setItem('openedTabs', JSON.stringify(openedTabs));
};

export const removeOpenTab = (giftTicketId) => {
  let openedTabs = getOpenTabs();
  const idx = openedTabs.findIndex((item) => item === giftTicketId);
  if (idx >= 0) {
    if (idx === 0) {
      openedTabs = [];
    } else {
      openedTabs = openedTabs.splice(idx, 1);
    }
  }
  localStorage.setItem('openedTabs', JSON.stringify(openedTabs));
};


export const toUnicode = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str;
};

export const dateTime = (timestamp, format = 'DD/MM/YYYY') => {
  return moment(timestamp).format(format);
};

export const defaultFormatDateTime = "DD/MM/YYYY | HH:mm:ss";
export const dateTimeFromString = (time, format = defaultFormatDateTime, className = '', styles = {}) => {
  if (!time) {
    return '---';
  }
  return <Moment className={className} format={format} style={styles}>{time}</Moment>;
};
export const getApiURL = (service) => {
  const {
    REACT_APP_API_BASE_URL,
    REACT_APP_API_PRODUCT,
    REACT_APP_API_INVENTORY,
    REACT_APP_API_CUSTOMER,
    REACT_APP_API_ORDER,
    REACT_APP_API_AUTH,
    REACT_APP_API_VERSION
  } = process.env;
  switch (service) {
    case SERVICE_INVENTORY:
      return REACT_APP_API_BASE_URL + REACT_APP_API_VERSION + REACT_APP_API_INVENTORY;
    case SERVICE_ORDER:
      return REACT_APP_API_BASE_URL + REACT_APP_API_VERSION + REACT_APP_API_ORDER;
    case SERVICE_CUSTOMER:
      return REACT_APP_API_BASE_URL + REACT_APP_API_VERSION + REACT_APP_API_CUSTOMER;
    case SERVICE_AUTH:
      return REACT_APP_API_BASE_URL + REACT_APP_API_VERSION + REACT_APP_API_AUTH;
    default:
      return REACT_APP_API_BASE_URL + REACT_APP_API_VERSION + REACT_APP_API_PRODUCT;
  }
};
export const getPaginate = (response) => {
  const {
    current_page,
    total,
    per_page
  } = response;
  return {
    current: current_page,
    total,
    pageSize: per_page,
  }
};
export const toPrice = (num) => {
  if (!num) {
    return 0;
  }
  return '' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
};
export const toDefaultPicker = timestamp => {
  const time = moment.unix(timestamp).format('DD-MM-YYYY');
  return moment(time, 'DD-MM-YYYY');
};
export const renderOrderStatus = (order, style = {}, platform = "haravan") => {
  let title = "Unknown";
  let color = "default";
  if (platform === 'haravan') {
    if (order.cancelled_status === 'cancelled') {
      title = "Hủy";
      color = 'red';
    } else if (order.delete_status === 'deleted') {
      title = "Đã Xóa";
      color = 'magenta';
    } else if (order.closed_status === 'closed') {
      title = "Đã đóng";
      color = 'magenta';
    } else if (order.confirmed_status === 'confirmed') {
      title = "Đã Xác nhận";
      color = 'green';
    }
  }
  return <Tag style={style} color={color}>{title}</Tag>
};

export const renderOrderPaidStatus = (order, platform = "haravan") => {
  let title = "Unknown";
  let color = "default";
  let gw = "Unknown";
  if (platform === 'haravan') {
    //Fix for raw hrv data
    let rfs = order.finance_status;
    if (!rfs && order.financial_status) {
      rfs = order.financial_status;
    }
    const fs = HARAVAN_ORDER_FINANCE_STATUS.findIndex(
      item => item.code === rfs
    );
    if (fs >= 0) {
      title = HARAVAN_ORDER_FINANCE_STATUS[fs].name;
      color = HARAVAN_ORDER_FINANCE_STATUS[fs].color;
    }
    const gc = GATE_WAYCODE.findIndex(
      item => item.code === (order.gateway_code && order.gateway_code.toLowerCase())
    );
    if (gc >= 0) {
      gw = GATE_WAYCODE[gc].name;
    }
  }
  return <Badge color={color} text={`${gw} - ${title}`}/>
};

export const renderGateway = (gatewayCode, platform = "haravan") => {
  let gw = "Unknown";
  if (platform === 'haravan') {
    const gc = GATE_WAYCODE.findIndex(
      item => item.code === gatewayCode
    );
    if (gc >= 0) {
      gw = GATE_WAYCODE[gc].name;
    }
  }
  return <>{gw}</>
};

//Dùng cho order sync
export const renderHrvOrderFFStatus = (order, platform = "haravan") => {
  let title = "Không giao hàng";
  let color = "default";
  if (platform === 'haravan') {
    const gc = HARAVAN_FF_STATUS.findIndex(
      item => item.code === order.fulfillment_status
    );
    if (gc >= 0) {
      title = HARAVAN_FF_STATUS[gc].name;
      color = HARAVAN_FF_STATUS[gc].color;
    }
  }
  return <Badge color={color} text={title}/>
};

export const renderOrderFulfillmentStatus = (order, platform = "haravan") => {
  let title = "Unknown";
  let color = "default";
  if (platform === 'haravan') {
    const gc = FULFILLMENT_STATUS.findIndex(
      item => item.code === order.fulfillment_status
    );
    if (gc >= 0) {
      title = FULFILLMENT_STATUS[gc].name;
      color = FULFILLMENT_STATUS[gc].color;
    }
  }
  //   if (order.fulfillment_status === 'fulfilled') {
  //     title = "Đã xử lý";
  //     color = 'green';
  //   } else if (order.fulfillment_status === 'notfulfilled') {
  //     title = "Chưa xử lý";
  //     color = 'red';
  //   }
  // }
  return <Badge size={'small'} color={color} text={title}/>
};

export const renderNumberFormat = (number, className = "", postFix = '') => {
  return <NumberFormat
    displayType={"text"} className={className} value={number} thousandSeparator={true}
    renderText={(value, props) => <span {...props}>{`${value} ${postFix}`}</span>}
  />
};

export const renderOrderChannelSrc = (src, platform = "haravan") => {
  let title = src;
  if (platform === 'haravan') {
    if (src === 'zalo') {
      title = "Zalo";
    } else if (src === 'web') {
      title = "Web";
    } else if (src === 'haravan_draft_order') {
      title = "Nháp";
    } else if (src === 'fb') {
      title = "Facebook";
    } else if (src === 'pos') {
      title = "POS";
    } else if (src === 'shopee') {
      title = "Shopee";
    } else if (src === 'lazada') {
      title = "Lazada";
    }
  }
  return title;
};
export const renderWhStt = (stt, platform = PLATFORM_HARAVAN) => {
  return <Badge color={stt == 'active' ? 'green' : 'red'} text={stt.toUpperCase()}/>
};

export const renderProStt = (stt) => {
  return <Badge color={stt == 'active' ? 'green' : 'default'} text={stt.toUpperCase()}/>
};

export const renderPaymentStatus = (status, platform = "haravan") => {
  let title = "Unknown";
  let color = "default";
  let gw = "Unknown";
  if (platform === 'haravan') {
    const fs = PAYMENT_STATUS.findIndex(
      item => item.code === status
    );
    if (fs >= 0) {
      title = PAYMENT_STATUS[fs].name;
      color = PAYMENT_STATUS[fs].color;
    }
  }
  return <Badge color={color} text={`${title}`}/>
};

export const renderOTType = (type, platform = "haravan") => {
  let title = "---";
  let color = "";
  if (platform === 'haravan') {
    const fs = ORDER_TRANS_TYPE.findIndex(
      item => item.code === type
    );
    if (fs >= 0) {
      title = ORDER_TRANS_TYPE[fs].name;
      color = ORDER_TRANS_TYPE[fs].color;
    }
  }
  return <Tag color={color}>{title}</Tag>
};

/**
 * Trạng thái kiểm ở PO
 * @param po_type
 * @param status
 * @param showTitle
 * @returns {string|*}
 */
export const renderPOStockCheck = (po_type, status, showTitle = false) => {
  let title = "---";
  let color = "default";

  switch (po_type) {
    case PO_TYPE_IMPORT:
    case PO_TYPE_REFUND:
    case PO_TYPE_TRANSFER: {
      const fs = PO_ST_C_STATUS.findIndex(
        item => item.code === status
      );
      if (fs >= 0) {
        title = PO_ST_C_STATUS[fs].name;
        color = PO_ST_C_STATUS[fs].color;
      }
      break;
    }
  }
  return <Badge color={color} text={`${title}`}/>;
};

/**
 * Trạng thái từng phiếu kiểm
 * @param status
 * @returns {*}
 */
export const renderStockCheckStt = (status) => {
  let title = "---";
  let color = "default";
  const fs = STOCK_CHECK_STATUS.findIndex(
    item => item.code === status
  );
  if (fs >= 0) {
    title = STOCK_CHECK_STATUS[fs].name;
    color = STOCK_CHECK_STATUS[fs].color;
  }
  return <Badge color={color} text={`${title}`}/>
};

export const renderPoDeliveringStatus = (stt, platform = 'haravan') => {
  let title = "Unknown";
  let color = "default";
  let gw = "Unknown";
  if (platform === 'haravan') {
    const fs = PO_DELIVER_STATUS.findIndex(
      item => item.code === stt
    );
    if (fs >= 0) {
      title = PO_DELIVER_STATUS[fs].name;
      color = PO_DELIVER_STATUS[fs].color;
    }
  }
  return <Badge color={color} text={`${title}`}/>
};

export const renderPOStatus = (status, platform = "haravan") => {
  let title = "Unknown";
  let color = "default";
  let gw = "Unknown";
  const fs = PO_STATUS.findIndex(
    item => item.code === status
  );
  if (fs >= 0) {
    title = PO_STATUS[fs].name;
    color = PO_STATUS[fs].color;
  }
  return <Badge color={color} text={`${title}`}/>
};

export const renderAdjustStt = (status) => {
  let title = "Unknown";
  let color = "default";
  let gw = "Unknown";
  const fs = ADJUSTMENT_STT.findIndex(
    item => item.code === status
  );
  if (fs >= 0) {
    title = ADJUSTMENT_STT[fs].name;
    color = ADJUSTMENT_STT[fs].color;
  }
  return <Badge color={color} text={`${title}`}/>
};

export const renderPoPackingStatus = (status) => {
  let title = "Unknown";
  let color = "default";
  const fs = PO_PACKING_STATUS.findIndex(
    item => item.code === status
  );
  if (fs >= 0) {
    title = PO_PACKING_STATUS[fs].name;
    color = PO_PACKING_STATUS[fs].color;
  }
  return <Badge color={color} text={`${title}`}/>
};


export const getObj = (key, value, obj) => {
  let index = obj.findIndex(item => item.key === value);
  if (typeof obj[index] === "undefined") {
    return null;
  }
  return obj[index][key];
};

export const getEmpty = (string, prefix = '---', suffix = '') => {
  if (!string || string.length <= 0 || typeof string === "undefined") {
    return prefix + suffix;
  }
  return string;
};

export const getWindowDimensions = () => {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height
  };
};

export function zeroText(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export function renderPOType(type) {
  const poType = PO_TYPES.find(item => item.code === type);
  if (poType) {
    return <Tag color={poType.color}>{poType.name}</Tag>
  }
  return "---";
}

export function renderCarrier(code, carriers) {
  const carrier = carriers.find(item =>
    item.code === code);
  if (!carrier) {
    return code;
  }
  return carrier.name;
}

export function renderRoleName(key) {
  const role = USER_ROLES.find(role => role.key === key);
  if (role) {
    return role.title;
  }
  return '---';
}

export const renderCodConf = confirm => {
  return confirm === PAYMENT_COD_CONFIRM_C ?
    <Tooltip title={`Đã nhận COD`}><CheckCircleOutlined style={{color: 'green'}}/></Tooltip> :
    <Tooltip title={`Chưa nhận COD`}><CloseCircleOutlined style={{color: 'red'}}/></Tooltip>
};

export const renderDepositConf = confirm => {
  return confirm === PAYMENT_COD_CONFIRM_C ?
    <Tooltip title={`Đã cọc`}><CheckCircleOutlined style={{color: 'green'}}/></Tooltip> :
    <Tooltip title={`Chưa cọc`}><CloseCircleOutlined style={{color: 'red'}}/></Tooltip>
};
export const renderUserStt = (stt) => {
  let title = stt === USER_ACTIVE ? 'Kích hoạt' : 'Hủy';
  let color = stt === USER_ACTIVE ? 'green' : 'red';
  return <Badge color={color} text={title}/>
};

export const toInt = (stt) => {
  return parseInt(stt);
};

export const countTotal = (data = [], key = 'total_price') => {
  if (data.length === 0) return 0;
  let total = 0;
  data.map(item => {
    if (!item[key]) {
      total += 0;
    } else {
      total += item[key];
    }
  });
  return renderNumberFormat(total, '', 'đ');
};

export const countChildren = (data = [], children = 'order_trans', key = 'total_price') => {
  if (data.length === 0) return 0;
  let total = 0;
  data.map(item => {

    if (!item[children] || item[children].length === 0) {
      total += 0;
    } else {
      console.log(item[children]);
      item[children].map(item => {
        total += item[key];
      })
    }
  });
  return renderNumberFormat(total, '', 'đ');
};

export const LinkOriginOrder = (id) => {
  if (!id) {
    return '';
  }
  const {REACT_APP_HARAVAN_ADMIN_URL} = process.env;
  return `${REACT_APP_HARAVAN_ADMIN_URL}/${id}`;
};

export const renderTag = (value = [], row) => {
  const tags = JSON.parse(value);
  if (!Array.isArray(tags)) {
    return "";
  }
  let html = '';

  return <Space size={'small'} wrap>{
    tags.map((item, index) => {
      return <small
        key={'tag' + row.id + item.id}>{limitText(item.name, 13, 'xxx')}{tags.length !== index + 1 && ','}</small>;
    })
  }</Space>;
};
export const poSttIndex = (status) => {
  return PO_STT_LIST.findIndex(stt => stt.key === status);
};

export function slugify(slug) {

  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\’|\~|\!|\@|\®|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_|-/gi, '');
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, "");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '');
  slug = slug.replace(/\-\-\-\-/gi, '');
  slug = slug.replace(/\-\-\-/gi, '');
  slug = slug.replace(/\-\-/gi, '');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  return slug;
}

export const checkStt = (stt, lists = []) => {
  //const poStt = PO_STATUS.map(status => status.code);
  return lists.includes(stt);
}

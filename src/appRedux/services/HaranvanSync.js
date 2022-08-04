import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from '../../util/Api';
import {SERVICE_CUSTOMER} from "../../constants/constant";
import {message} from "antd";
import Axios from "axios";

const {REACT_APP_HARAVAN_HOOK_URL} = process.env;
export const reqSyncHaravanGetProducts = async (params) => {
  const {page, ids, collection_id} = params;
  return await axiosAuth().get(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/product`, {
    params: {
      page,
      ids,
      collection_id,
      limit: 10
    }
  }).catch(axiosCatch);
};

export const reqHaravanSyncUpdateProduct = async (pId) => {
  return await axiosAuth().post(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/product`, {
    pId
  }).catch(axiosCatch);
};

export const reqtSyncHaravanGetLocation = async () => {
  return await axiosAuth().get(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/location`).catch(axiosCatch);
};

export const reqHaravanSyncUpdateLocation = async (location) => {
  return await axiosAuth().post(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/location`, {
    location
  }).catch(axiosCatch);
};

export const reqGetHrvOrders = async (params) => {
  return await axiosAuth()
    .get(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/order`, {
      params: params
    })
    .catch(axiosCatch);
};

export const reqSyncHrvOrder = async (params) => {
  const {ids} = params;
  return await axiosAuth()
    .post(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/order`, {
      platformIds: ids
    })
    .catch(axiosCatch);
};
export const reqHrvGetUser = async (params) => {
  console.log('Call service user sync');
  return await axiosAuth()
    .get(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/user`, {params})
    .catch(axiosCatch);
};
export const reqHrvSyncUser = async (params) => {
  return await axiosAuth()
    .post(`${REACT_APP_HARAVAN_HOOK_URL}/synchronize/user`, params)
    .catch(axiosCatch);
};

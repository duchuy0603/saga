import {axiosCatch} from "../../util/Helper";
import {axiosAuth} from '../../util/Api';

const {REACT_APP_PANCAKE_HOOK_URL} = process.env;

export const reqPancakeAsyncGetWhList = async (params = {}) => {
  return await axiosAuth().get(`${REACT_APP_PANCAKE_HOOK_URL}/sync/warehouses`, {
    params: params
  }).catch(axiosCatch);
};

export const reqPancakeConnect = async (params = {}) => {
  return await axiosAuth().post(`${REACT_APP_PANCAKE_HOOK_URL}/sync/warehouses/connect`, params).catch(axiosCatch);
};

export const reqPancakeSyncProVariantsList = async (params = {}) => {
  return await axiosAuth().get(`${REACT_APP_PANCAKE_HOOK_URL}/sync/variants`, {
    params
  }).catch(axiosCatch)
};

export const reqPancakeProConnectVariants = async (productId) => {
  return await axiosAuth().post(`${REACT_APP_PANCAKE_HOOK_URL}/sync/variants/connect`, {
    productId
  }).catch(axiosCatch)
};

export const reqPancakeGetOrders = async (params = {}) => {
  return await axiosAuth().get(`${REACT_APP_PANCAKE_HOOK_URL}/sync/orders`, {
    params: params
  })
};

export const reqPancakeSyncOrder = async (params) => {
  return await axiosAuth().post(`${REACT_APP_PANCAKE_HOOK_URL}/sync/orders`, {
    ...params
  })
};




export const reqInventorySync = async (params = {}) => {
  return await axiosAuth().post(`${REACT_APP_PANCAKE_HOOK_URL}/sync/warehouses/inventory-sync`, params).catch(axiosCatch);
}

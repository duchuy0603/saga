import {axiosCatch, getApiURL} from '../../util/Helper';
import {axiosAuth} from '../../util/Api';
import React from 'react';
import {SERVICE_AUTH} from "../../constants/constant";

const ROUTE_ACCOUNT = 'account';
export const reqAuth = ({email, password}) => {
  return axiosAuth().post(`${getApiURL(SERVICE_AUTH)}/login`, {email, password}).catch(axiosCatch);
};

export const checkToken = async (params) => {
  return await axiosAuth().post(`${getApiURL(SERVICE_AUTH)}/check`).catch(axiosCatch, {params});
};

export const getAppInfo = async () => {
  return axiosAuth().get(`${getApiURL(SERVICE_AUTH)}/app-info`).catch(axiosCatch);
};

export const reqGetAccount = async (params) => {
  return axiosAuth().get(`${getApiURL(SERVICE_AUTH)}/${ROUTE_ACCOUNT}`, params).catch(axiosCatch);
};
export const reqViewUser = async (user_id) => {
  return axiosAuth().get(`${getApiURL(SERVICE_AUTH)}/${ROUTE_ACCOUNT}/${user_id}`).catch(axiosCatch);
};

export const reqCreateAccount = async (account) => {
  return axiosAuth().post(`${getApiURL(SERVICE_AUTH)}/${ROUTE_ACCOUNT}`, account).catch(axiosCatch);
};
export const reqUpdateAccount = async (account) => {
  return axiosAuth().put(`${getApiURL(SERVICE_AUTH)}/${ROUTE_ACCOUNT}/${account.id}`, account).catch(axiosCatch);
};
export const reqDeleteAccount = async (accountId) => {
  return axiosAuth().delete(`${getApiURL(SERVICE_AUTH)}/${ROUTE_ACCOUNT}/${accountId}`).catch(axiosCatch);
};

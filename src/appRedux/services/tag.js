import {axiosAuth} from "../../util/Api";
import {axiosCatch, getApiURL} from "../../util/Helper";
import {SERVICE_CUSTOMER} from "../../constants/constant";

export const reqTagGetList = async (params = {}) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_CUSTOMER)}/tag`, {
    params
  }).catch(axiosCatch);
}

export const reqTagCreate = async (params = {}) => {
  return await axiosAuth().post(`${getApiURL(SERVICE_CUSTOMER)}/tag`, params).catch(axiosCatch);
}

export const reqTagUpdate = async (params = {}) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_CUSTOMER)}/tag/${params.id}`, params).catch(axiosCatch);
}

export const reqTagDelete = async (tagId) => {
  return await axiosAuth().delete(`${getApiURL(SERVICE_CUSTOMER)}/tag/${tagId}`).catch(axiosCatch);
}

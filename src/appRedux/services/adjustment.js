import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from "../../util/Api";
import {SERVICE_CUSTOMER, SERVICE_INVENTORY} from "../../constants/constant";

export const reqAdjustmentGetList = (params) => {
  return axiosAuth().get(`${getApiURL(SERVICE_INVENTORY)}/adjustment`, {params}).catch(axiosCatch)
}
export const reqAdjustmentCreate = (params) => {
  return axiosAuth().post(`${getApiURL(SERVICE_INVENTORY)}/adjustment`, params).catch(axiosCatch)
}
export const reqAdjustmentUpdate = (params) => {
  return axiosAuth().put(`${getApiURL(SERVICE_INVENTORY)}/adjustment/${params.id}`, params).catch(axiosCatch)
}
export const reqAdjustmentChangeStt = (params) => {
  return axiosAuth().post(`${getApiURL(SERVICE_INVENTORY)}/adjustment/change-status`, params).catch(axiosCatch)
}


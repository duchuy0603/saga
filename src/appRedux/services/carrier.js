import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from "../../util/Api";
import {SERVICE_CUSTOMER} from "../../constants/constant";

export const reqCarrierGetList = (params) => {
  return axiosAuth().get(`${getApiURL(SERVICE_CUSTOMER)}/carrier`, {params}).catch(axiosCatch)
}
export const reqCarrierCreate = (params) => {
  return axiosAuth().post(`${getApiURL(SERVICE_CUSTOMER)}/carrier`, params).catch(axiosCatch)
}
export const reqCarrierUpdate = (params) => {
  return axiosAuth().put(`${getApiURL(SERVICE_CUSTOMER)}/carrier/${params.id}`, params).catch(axiosCatch)
}
export const reqCarrierDelete = (carrierId) => {
  return axiosAuth().delete(`${getApiURL(SERVICE_CUSTOMER)}/carrier/${carrierId}`).catch(axiosCatch)
}

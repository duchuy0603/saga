import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from "../../util/Api";
import {SERVICE_CUSTOMER} from "../../constants/constant";

export const reqGetBrand = (params) => {
  return axiosAuth().get(`${getApiURL(SERVICE_CUSTOMER)}/brand`, {params}).catch(axiosCatch)
};
export const reqCreateBrand = (params) => {
  return axiosAuth().post(`${getApiURL(SERVICE_CUSTOMER)}/brand`, params).catch(axiosCatch)
};
export const reqUpdateBrand = (params) => {
  return axiosAuth().put(`${getApiURL(SERVICE_CUSTOMER)}/brand/${params.id}`, params).catch(axiosCatch)
};
export const reqDeleteBrand = (brandId) => {
  return axiosAuth().delete(`${getApiURL(SERVICE_CUSTOMER)}/brand/${brandId}`).catch(axiosCatch)
};

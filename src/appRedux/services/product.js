import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from '../../util/Api';

export const reqGetProduct = async (params) => {
  return await axiosAuth().get(getApiURL(), {
    params
  }).catch(axiosCatch);
}
export const reqCreateProduct = async (product) => {
  return await axiosAuth().post(getApiURL(), product).catch(axiosCatch);
}
export const reqUpdateProduct = async (productId, params) => {
  return await axiosAuth().put(`${getApiURL()}/${productId}`, params).catch(axiosCatch);
}
export const reqChangeStatusProduct = async (payload) => {
  const {productId, status} = payload;
  return await axiosAuth().post(`${getApiURL()}/change-status/${productId}`, {status}).catch(axiosCatch);
}
export const reqProductDetail = async (productId) => {
  return await axiosAuth().get(`${getApiURL()}/${productId}`).catch(axiosCatch);
}

//product category variants
export const reqGetProductCategory = async (params) => {
  return await axiosAuth().get(`${getApiURL()}/category`, {
    params
  }).catch(axiosCatch);
}

export const reqCreateProductCategory = async (category) => {
  return await axiosAuth().post(`${getApiURL()}/category`, category).catch(axiosCatch);
}
export const reqUpdateProductCategory = async (category) => {
  return await axiosAuth().put(`${getApiURL()}/category/${category.id}`, category).catch(axiosCatch);
}
export const reqDeleteProductCategory = async (id) => {
  return await axiosAuth().delete(`${getApiURL()}/category/${id}`).catch(axiosCatch);
}
export const reqProductDetailCategory = async (categoryId) => {
  return await axiosAuth().get(`${getApiURL()}/category/${categoryId}`).catch(axiosCatch);
}

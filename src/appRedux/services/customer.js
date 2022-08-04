import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from '../../util/Api';
import {CUSTOMER_TYPE_MANUFACTURE, SERVICE_CUSTOMER} from "../../constants/constant";

export const reqGetCustomer = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_CUSTOMER), {
    params
  }).catch(axiosCatch);
};
export const reqCreateCustomer = async (customer) => {
  return await axiosAuth().post(getApiURL(SERVICE_CUSTOMER), customer).catch(axiosCatch);
};
export const reqUpdateCustomer = async (customerId, params) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_CUSTOMER)}/${customerId}`, params)
    .catch(axiosCatch);
};
export const reqDeleteCustomer = async (id) => {
  return await axiosAuth().delete(`${getApiURL(SERVICE_CUSTOMER)}/${id}`).catch(axiosCatch);
};
export const reqCustomerDetail = async (customerId) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_CUSTOMER)}/${customerId}`).catch(axiosCatch);
};
//Vendor

export const reqGetVendor = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_CUSTOMER), {
    params
  }).catch(axiosCatch);
}
export const reqCreateVendor = async (vendor) => {
  return await axiosAuth().post(getApiURL(SERVICE_CUSTOMER), vendor).catch(axiosCatch);
}
export const reqUpdateVendor = async (vendor) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_CUSTOMER)}/${vendor.id}`, vendor).catch(axiosCatch);
}
export const reqDeleteVendor = async (id) => {
  return await axiosAuth().delete(`${getApiURL(SERVICE_CUSTOMER)}/${id}`).catch(axiosCatch);
}
export const reqVendorDetail = async (vendorId) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_CUSTOMER)}/${vendorId}`).catch(axiosCatch);
}


// Manufacture

export const reqGetManufacture = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_CUSTOMER), {
    params
  }).catch(axiosCatch);
}
export const reqCreateManufacture = async (manufacture) => {
  return await axiosAuth().post(getApiURL(SERVICE_CUSTOMER), manufacture).catch(axiosCatch);
}
export const reqUpdateManufacture = async (manufacture) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_CUSTOMER)}/${manufacture.id}`, manufacture).catch(axiosCatch);
}
export const reqDeleteManufacture = async (id) => {
  return await axiosAuth().delete(`${getApiURL(SERVICE_CUSTOMER)}/${id}`).catch(axiosCatch);
}
export const reqManufactureDetail = async (mId) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_CUSTOMER)}/${mId}`).catch(axiosCatch);
}


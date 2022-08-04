import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from '../../util/Api';
import {SERVICE_CUSTOMER, SERVICE_ORDER} from "../../constants/constant";

export const reqGetOrderList = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_ORDER), {
    params
  }).catch(axiosCatch)
};

export const reqGetOrder = async (params) => {
  const {id} = params;
  return await axiosAuth().get(getApiURL(SERVICE_ORDER) + `/${id}`, {
    params
  }).catch(axiosCatch)
};

export const reqOrderDetail = async (orderId) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_ORDER)}/${orderId}`).catch(axiosCatch);
};


export const reqOrderTransactions = async (params) => {
  return await axiosAuth()
    .get(`${getApiURL(SERVICE_ORDER)}/transaction`, {params}).catch(axiosCatch);
};
export const reqOTByOrder = async (params) => {
  return await axiosAuth()
    .get(`${getApiURL(SERVICE_ORDER)}/transaction-by-order`, {params}).catch(axiosCatch);
};
export const reqOTRelated = async (params) => {
  return await axiosAuth()
    .get(`${getApiURL(SERVICE_ORDER)}/transaction/related`, {params}).catch(axiosCatch);
}

export const reqCreateOT = async (params) => {
  return await axiosAuth()
    .post(`${getApiURL(SERVICE_ORDER)}/transaction`, params)
    .catch(axiosCatch);
};

export const reqUpdateOt = async (otId, params) => {
  return await axiosAuth()
    .put(`${getApiURL(SERVICE_ORDER)}/transaction/${otId}`, params)
    .catch(axiosCatch);
};

export const reqDeleteOt = async (otId) => {
  return await axiosAuth()
    .delete(`${getApiURL(SERVICE_ORDER)}/transaction/${otId}`)
    .catch(axiosCatch);
};

export const reqOtChangeStatus = async (otId, status) => {
  let url = ``;
  if (status === 'success') {
    url = `${getApiURL(SERVICE_ORDER)}/transaction/set-paid/${otId}`;
  } else if (status === 'cancel') {
    url = `${getApiURL(SERVICE_ORDER)}/transaction/set-cancel/${otId}`;
  } else {
    throw {
      message: "Unknown status"
    }
  }
  return await axiosAuth()
    .put(url)
    .catch(axiosCatch);
};

export const reqOrderChangeStatus = async (status, id, reason = '') => {
  const statues = ['paid', 'confirm', 'cancel', 'close'];
  const idx = statues.findIndex(item => item === status);
  if (idx < 0) {
    throw {
      message: "Unknown status"
    }
  }
  let url = `${getApiURL(SERVICE_ORDER)}/${status}/${id}`;
  let data = {};
  if (status === 'cancel') {
    data = {
      reason
    }
  }
  return await axiosAuth()
    .put(url, data)
    .catch(axiosCatch);
};

export const reqApplyBrand = async (params) => {
  return await axiosAuth().post(`${getApiURL(SERVICE_ORDER)}/apply-brand`, params).catch(axiosCatch);
}

export const reqOTCodConfirm = async (id) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_ORDER)}/transaction/cod-confirm/${id}`).catch(axiosCatch);
}
export const reqOTDepositConfirm = async (id) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_ORDER)}/transaction/deposit-confirm/${id}`).catch(axiosCatch);
}
export const reqOTSetComplete = async (id) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_ORDER)}/transaction/set-complete/${id}`).catch(axiosCatch);
}

export const reqOTSetNote = async (params) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_ORDER)}/transaction/set-note/${params.id}`, params).catch(axiosCatch);
}
export const reqOTSetCancel = async (id) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_ORDER)}/transaction/set-cancel/${id}`).catch(axiosCatch);
}

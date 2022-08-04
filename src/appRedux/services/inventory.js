import {axiosCatch, getApiURL} from "../../util/Helper";
import {axiosAuth} from '../../util/Api';
import {SERVICE_INVENTORY} from "../../constants/constant";

const ABSOLUTE_PATH = '/po';
const ABSOLUTE_WAREHOUSE = '/warehouse';
//Purchase Order services
export const reqGetPurchaseOrder = async (params) => {
  console.log('params inventory: ', params);
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH, {
    params
  }).catch(axiosCatch);
};
export const reqPurchaseOrderDetail = async (poId) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_INVENTORY)}${ABSOLUTE_PATH}/${poId}`).catch(axiosCatch);
};

export const reqPoCreateByOrderData = async (data) => {
  const {
    items,
    order_id,
    po_type
  } = data;
  return await axiosAuth().post(`${getApiURL(SERVICE_INVENTORY)}/po-via-order`, {
    items,
    order_id,
    po_type
  }).catch(axiosCatch);
};

/// cái ajax GET POST
// GET lấy danh sách, 1 . URL API, 2 là params ví dụ là page=1, sort=ASC.....
// POST PUT
export const reqDeletePurchaseOrder = async (poId) => {
  return await axiosAuth().delete(`${getApiURL(SERVICE_INVENTORY)}${ABSOLUTE_PATH}/${poId}`).catch(axiosCatch);
};
export const reqCreatePurchaseOrder = async (po) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH, po).catch(axiosCatch);
};

export const reqUpdatePurchaseOrder = async (poId) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_INVENTORY)}${ABSOLUTE_PATH}/${poId}`).catch(axiosCatch);
};

export const reqCreatePoViaProduct = async (po) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH + '-product', po).catch(axiosCatch);
};

//warehouse

export const reqGetWarehouse = async (params) => {
  return await axiosAuth().get(
    `${getApiURL(SERVICE_INVENTORY)}/warehouse`, {
      params
    }).catch(axiosCatch);
};
export const reqWarehouseDetail = async (warehouse_id) => {
  return await axiosAuth().get(`${getApiURL(SERVICE_INVENTORY)}${ABSOLUTE_WAREHOUSE}/${warehouse_id}`).catch(axiosCatch);
};

export const reqDeleteWarehouse = async (warehouse_id) => {
  return await axiosAuth().delete(`${getApiURL(SERVICE_INVENTORY)}${ABSOLUTE_WAREHOUSE}/${warehouse_id}`).catch(axiosCatch);
};
export const reqCreateWarehouse = async (warehouse) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_WAREHOUSE, warehouse).catch(axiosCatch);
};

export const reqUpdateWarehouse = async (warehouse) => {
  return await axiosAuth().put(`${getApiURL(SERVICE_INVENTORY)}${ABSOLUTE_WAREHOUSE}/${warehouse.id}`, warehouse).catch(axiosCatch);
};

//get product inventory

export const reqGetWarehouseProduct = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_WAREHOUSE + '-product', {params}).catch(axiosCatch);
};

export const reqGetWarehousePoProduct = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_WAREHOUSE + '-po-product', {params}).catch(axiosCatch);
};

export const reqGetVariantProduct = async (params) => {
  console.log('variant params: ', params);
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_WAREHOUSE + '-variant', {params}).catch(axiosCatch);
};
export const reqGetTransProduct = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_WAREHOUSE + '-transaction', {params}).catch(axiosCatch);
};


// update po packing status
export const reqUpdatePoPacking = async (params) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po-update-packing`, params)
    .catch(axiosCatch);
};

// update po packing status
export const reqUpdateCarrier = async (params) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po-update-carrier`, params)
    .catch(axiosCatch);
};

// update po tracking numner
export const reqUpdatePoTrackingNumber = async (params) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po-update-tracking`, params)
    .catch(axiosCatch);
};

// update po
export const reqPoDelivered = async (poId) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po-delivered`, poId)
    .catch(axiosCatch);
};

// check stock
export const reqPoCheckStock = async (parms) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po/create-stock-check`, parms).catch(axiosCatch);
};
//change stt
export const reqPoConfirm = async (parms) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH + '-confirm', parms).catch(axiosCatch);
};
//change stt
export const reqPoDelivering = async (params) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po-delivering`, params)
    .catch(axiosCatch);
};

// set done po
export const reqPoSetCompleted = async (params) => {
  return await axiosAuth()
    .post(`${getApiURL(SERVICE_INVENTORY)}/po/set-done`, params)
    .catch(axiosCatch);
};

// get po detail payment
export const reqGetPoDetailPayment = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH + '-payment', params).catch(axiosCatch);
};
export const reqCreatePoDetailPayment = async (params) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH + '-payment', params).catch(axiosCatch);
};
//update shipping address

export const reqUpdateShippingAddress = async (params) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH + '-shipping-address', params).catch(axiosCatch);
};
// GET Warehouse report


export const reqGetWarehouseReport = async (params) => {
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_WAREHOUSE + '-report', params).catch(axiosCatch);
};

export const reqSetDefaultWarehouse = async (warehouseId) => {
  return await axiosAuth().put(
    `${getApiURL(SERVICE_INVENTORY)}/warehouse/set-default/${warehouseId}`)
    .catch(axiosCatch);
};

export const reqGetStockCheck = async (params) => {
  return await axiosAuth().get(
    `${getApiURL(SERVICE_INVENTORY)}/stock-check`, {
      params
    })
    .catch(axiosCatch);
};

export const reqConfirmStockCheck = async (id) => {
  return await axiosAuth().put(
    `${getApiURL(SERVICE_INVENTORY)}/stock-check/confirm/${id}`)
    .catch(axiosCatch);
};

export const reqCancelStockCheck = async (id) => {
  return await axiosAuth().put(
    `${getApiURL(SERVICE_INVENTORY)}/stock-check/cancel /${id}`)
    .catch(axiosCatch);
};

export const reqCompleteStockCheck = async ({poId}) => {
  return await axiosAuth().put(
    `${getApiURL(SERVICE_INVENTORY)}/po/complete-stock-check`, {
      poId
    })
    .catch(axiosCatch);
};
//set brand po
export const reqPoApplyBrand = async (data) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po/set-brand`, data)
    .catch(axiosCatch);
};

// get po transaction
export const reqPoTransactionList = async (params) => {
  return await axiosAuth().get(
    `${getApiURL(SERVICE_INVENTORY)}/po/transaction`, {
      params
    })
    .catch(axiosCatch);
};

export const reqSavePrintCount = async (params) => {
  return await axiosAuth().post(
    `${getApiURL(SERVICE_INVENTORY)}/po/count-print`, params)
    .catch(axiosCatch);
}

// create po transfer
export const reqPoTransferCreate = async (transfer) => {
  return await axiosAuth().post(`${getApiURL(SERVICE_INVENTORY)}/po-create-transfer`, transfer)
}

// Po Cancel

export const reqPoCancel = async (params) => {
  return await axiosAuth().put(getApiURL(SERVICE_INVENTORY) + ABSOLUTE_PATH + '/set-cancel', params).catch(axiosCatch);
};
// get product synced list

export const reqWarehouseSyncList = async (params = {}) => {
  return await axiosAuth().get(getApiURL(SERVICE_INVENTORY) + '/warehouse-sync-list', {params}).catch(axiosCatch);
}

//po refund
export const reqPoCreateRefund = async (params = {}) => {
  return await axiosAuth().post(getApiURL(SERVICE_INVENTORY) + '/refund/create', params).catch(axiosCatch);
}

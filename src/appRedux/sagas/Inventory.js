import React from "react";
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {message} from "antd";

import {
  reqCompleteStockCheck,
  reqCreatePoDetailPayment,
  reqCreatePurchaseOrder,
  reqCreateWarehouse,
  reqDeletePurchaseOrder,
  reqDeleteWarehouse,
  reqGetPoDetailPayment,
  reqGetPurchaseOrder, reqGetTransProduct, reqGetVariantProduct,
  reqGetWarehouse,
  reqGetWarehouseProduct, reqGetWarehouseReport, reqPoApplyBrand, reqPoCancel,
  reqPoCheckStock, reqPoConfirm, reqPoCreateRefund, reqPoCreateRefundImport,
  reqPoDelivered, reqPoDelivering,
  reqPoSetCompleted, reqPoTransferCreate,
  reqPurchaseOrderDetail, reqSetDefaultWarehouse,
  reqUpdateCarrier,
  reqUpdatePoPacking,
  reqUpdatePoTrackingNumber,
  reqUpdatePurchaseOrder, reqUpdateShippingAddress,
  reqUpdateWarehouse
} from "../services/inventory";

import {
  CHANGE_PO_STT,
  CREATE_PO,
  CREATE_PO_PAYMENT,
  CREATE_WAREHOUSE,
  CREATE_WAREHOUSE_SUCCESS,
  DELETE_PO,
  DELETE_WAREHOUSE,
  DELETE_WAREHOUSE_SUCCESS,
  GET_PO,
  GET_PO_DETAIL,
  GET_PO_DETAIL_SUCCESS,
  GET_PO_PAYMENT,
  GET_PO_PAYMENT_SUCCESS,
  GET_PO_SUCCESS,
  GET_WAREHOUSE,
  GET_WAREHOUSE_PRODUCT,
  GET_WAREHOUSE_PRODUCT_SUCCESS, GET_WAREHOUSE_REPORT, GET_WAREHOUSE_REPORT_SUCCESS,
  GET_WAREHOUSE_SUCCESS,
  GET_WAREHOUSE_TRANS,
  GET_WAREHOUSE_TRANS_SUCCESS,
  GET_WAREHOUSE_VARIANT,
  GET_WAREHOUSE_VARIANT_SUCCESS, PO_APPLY_BRAND,
  PO_CHECK_STOCK, PO_CHECK_STOCK_COMPLETE,
  PO_CONFIRM_DELIVERED,
  PO_CONFIRM_DELIVERING,
  PO_CONFIRM_STATUS, PO_REFUND_CREATE, PO_SET_CANCEL,
  PO_SET_COMPLETED, PO_TRANSFER_CREATE, PO_UPDATE_CARRIER,
  PO_UPDATE_PACKING,
  PO_UPDATE_SHIPPING_ADDRESS,
  PO_UPDATE_TRACKING_NUMBER,
  SET_STATE_PO,
  UPDATE_PO,
  UPDATE_WAREHOUSE,
  UPDATE_WAREHOUSE_SUCCESS,
  WAREHOUSE_SET_DEFAULT, WAREHOUSE_SET_DEFAULT_SUCCESS, WAREHOUSE_SET_STATE
} from "../../constants/ActionTypes";
import {getPaginate} from "../../util/Helper";
import {getDetailPo} from "../actions";
import {reqApplyBrand} from "../services/order";
import {PO_TYPE_EXPORT, PO_TYPE_TRANSFER} from "../../constants/constant";

function* callGetPurchaseOrder({payload}) {
  try {
    yield put({
      type: CHANGE_PO_STT,
      payload: {listLoading: true}
    });
    const res = yield call(reqGetPurchaseOrder, payload);
    yield put({
      type: GET_PO_SUCCESS,
      payload: {
        purchaseOrders: res.data.data,
        pagination: getPaginate(res.data),
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: CHANGE_PO_STT,
      payload: {listLoading: false}
    })
  }
}

function* callGetPurchaseOrderDetail({payload}) {
  try {
    yield put({
      type: CHANGE_PO_STT,
      payload: {
        isDetailLoading: true
      }
    });
    const res = yield call(reqPurchaseOrderDetail, payload.poId);
    yield put({
      type: GET_PO_DETAIL_SUCCESS,
      payload: {
        poDetail: res.data
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: CHANGE_PO_STT,
      payload: {
        isDetailLoading: false
      }
    })
  }
}


function* callCreatePurchaseOrder({payload}) {
  try {
    yield call(reqCreatePurchaseOrder, payload);
    message.success('Tạo đơn đặt hàng thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdatePurchaseOrder({payload}) {
  try {
    yield call(reqUpdatePurchaseOrder, payload);
    message.success('Cập nhật đơn đặt hàng thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callDeletePurchaseOrder({payload}) {
  try {
    yield call(reqDeletePurchaseOrder, payload.poId);
    message.success('Xoá đơn đặt hàng thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

//warehouse product
function* callGetWarehouseProduct({payload}) {
  try {
    const res = yield call(reqGetWarehouseProduct, payload);
    yield put({
      type: GET_WAREHOUSE_PRODUCT_SUCCESS,
      payload: {
        pWarehousesList: res.data.data,
        pWarehousePagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  }
}

//warehouse product variant
function* callGetWarehouseProductVariant({payload}) {
  try {
    const res = yield call(reqGetVariantProduct, payload);
    yield put({
      type: GET_WAREHOUSE_VARIANT_SUCCESS,
      payload: {
        pVariantList: res.data.data,
        pVariantPagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  }
}

//warehouse product trans
function* callGetWPT({payload}) {
  try {
    const res = yield call(reqGetTransProduct, payload);
    yield put({
      type: GET_WAREHOUSE_TRANS_SUCCESS,
      payload: {
        detailTrans: res.data.data,
        detailTransPagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  }
}

//Warehouse
function* callGetWarehouse({payload}) {
  try {
    const res = yield call(reqGetWarehouse, payload);
    yield put({
      type: GET_WAREHOUSE_SUCCESS,
      payload: {
        warehouses: res.data.data,
        pagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  }
}

function* callGetWarehouseReport({payload}) {
  try {
    const res = yield call(reqGetWarehouseReport, payload);
    yield put({
      type: GET_WAREHOUSE_REPORT_SUCCESS,
      payload: {
        report: res.data
      }
    });
  } catch (e) {
    message.error(e.message);
  }
}

function* callCreateWarehouse({payload}) {
  try {
    const res = yield call(reqCreateWarehouse, payload);
    yield put({
      type: CREATE_WAREHOUSE_SUCCESS,
      payload: {
        warehouse: res.data
      }
    });
    message.success('Tạo kho thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdateWarehouse({payload}) {
  try {
    const res = yield call(reqUpdateWarehouse, payload);
    yield put({
      type: UPDATE_WAREHOUSE_SUCCESS,
      payload: {
        warehouse: res.data
      }
    })
    message.success('Cập nhật kho thành công!');
  } catch (e) {
    message.error(e.message);
  }
}


function* callDeleteWarehouse({payload}) {
  try {
    const res = yield call(reqDeleteWarehouse, payload.warehouseId);
    yield put({
      type: DELETE_WAREHOUSE_SUCCESS,
      payload: {
        warehouseId: payload.warehouseId
      }
    });
    message.success('Xóa thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdatePoPacking({payload}) {
  try {
    yield call(reqUpdatePoPacking, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Cập nhập trạng thái đóng gói thành công');
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdateCarrier({payload}) {
  try {
    yield call(reqUpdateCarrier, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Thêm nhà vận chuyển thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdatePoTrackingNumber({payload}) {
  try {
    yield call(reqUpdatePoTrackingNumber, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Cập nhật mã vận đơn thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callPoDelivered({payload}) {
  try {
    yield call(reqPoDelivered, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Xác nhận đã giao hàng thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callPoCheckStock({payload}) {
  try {
    yield call(reqPoCheckStock, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Tạo phiếm kiểm hàng thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callPoCheckStockComplete({payload}) {
  try {
    yield call(reqCompleteStockCheck, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Xác nhận đã kiểm hàng xong thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callPoSetCompleted({payload}) {
  try {
    yield call(reqPoSetCompleted, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Vận đơn đã hoàn thành. Số liệu đã cập nhập vào kho');
  } catch (e) {
    message.error(e.message);
  }
}

function* callPoConfirm({payload}) {
  try {
    yield call(reqPoConfirm, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Thay đổi trạng thái thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callPoDelivering({payload}) {
  try {
    yield call(reqPoDelivering, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Thay đổi trạng thái thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callGetPoDetailPayment({payload}) {
  try {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isListLoading: true
      }
    });
    const res = yield call(reqGetPoDetailPayment, payload);
    yield put({
      type: GET_PO_PAYMENT_SUCCESS,
      payload: {
        poPaymentList: res.data,
      }
    })
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isListLoading: false
      }
    })
  }
}

function* callCreatePoDetailPayment({payload}) {
  try {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isListLoading: true
      }
    });
    yield call(reqCreatePoDetailPayment, payload);
    message.success('Tạo thanh toán thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isListLoading: false
      }
    })
  }
}

function* callUpdateShippingAddress({payload}) {
  try {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isDetailLoading: true
      }
    });
    yield call(reqUpdateShippingAddress, payload);
    yield put(getDetailPo(payload.poId));
    message.success('Cập nhật địa chỉ nhận hàng thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isDetailLoading: false
      }
    })
  }
}

function* callWarehouseSetDefault({payload}) {
  try {
    yield put({
      type: WAREHOUSE_SET_STATE,
      payload: {
        isLoading: true,
      }
    });
    const {warehouseId} = payload;
    const res = yield call(reqSetDefaultWarehouse, warehouseId);
    yield put({
      type: WAREHOUSE_SET_DEFAULT_SUCCESS,
      payload: {
        warehouse: res.data.data,
      }
    });
    message.success('Thay đổi trạng thái thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: WAREHOUSE_SET_STATE,
      payload: {
        isLoading: false,
      }
    });
  }
}

function* callPoApplyBrand({payload}) {
  try {
    console.log("callPoApplyBrand", payload);
    yield put({
      type: SET_STATE_PO,
      payload: {
        isDetailLoading: true
      }
    });
    yield put(getDetailPo(payload.poId));
    message.success('Cập nhận brand thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isDetailLoading: false
      }
    })
  }
}

//po transfer create
function* callPoTransferCreate({payload}) {
  try {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isListLoading: true
      }
    })
    yield call(reqPoTransferCreate, payload);
    yield put({
      type: GET_PO,
      payload: {
        po_type: PO_TYPE_TRANSFER,
      }
    })
    message.success("Tạo phiếu chuyển kho thành công!");
  } catch (e) {
    message.error(e.message)
  } finally {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isListLoading: false
      }
    })
  }
}

//po cancel
function* callPoSetCancel({payload}) {
  try {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isDetailLoading: true
      }
    })
    const response = yield call(reqPoCancel, payload);
    yield put(getDetailPo(payload.poId));
    message.success("Hủy phiếu chuyển thành công!")
  } catch (e) {
    message.error(e.message)
  } finally {
    yield put({
      type: SET_STATE_PO,
      payload: {
        isDetailLoading: false
      }
    })
  }
}

export function* callPoRefundCreate({payload}) {
  try {
    yield reqPoCreateRefund(payload);
    message.success("Tạo phiếu đổi trả thành công! ");
  } catch (e) {
    message.error(e.message);
  }
}

export default function* rootSaga() {
  return all([

    yield takeEvery(GET_PO, callGetPurchaseOrder),
    yield takeEvery(GET_PO_DETAIL, callGetPurchaseOrderDetail),
    yield takeLatest(DELETE_PO, callDeletePurchaseOrder),
    yield takeLatest(CREATE_PO, callCreatePurchaseOrder),
    yield takeEvery(UPDATE_PO, callUpdatePurchaseOrder),

    yield takeEvery(GET_WAREHOUSE, callGetWarehouse),
    yield takeLatest(DELETE_WAREHOUSE, callDeleteWarehouse),
    yield takeEvery(CREATE_WAREHOUSE, callCreateWarehouse),
    yield takeEvery(UPDATE_WAREHOUSE, callUpdateWarehouse),
    yield takeEvery(GET_WAREHOUSE_PRODUCT, callGetWarehouseProduct),
    yield takeEvery(GET_WAREHOUSE_VARIANT, callGetWarehouseProductVariant),
    yield takeEvery(GET_WAREHOUSE_TRANS, callGetWPT),
    yield takeEvery(GET_WAREHOUSE_REPORT, callGetWarehouseReport),

    yield takeLatest(PO_UPDATE_CARRIER, callUpdateCarrier),
    yield takeLatest(PO_UPDATE_PACKING, callUpdatePoPacking),
    yield takeLatest(PO_UPDATE_TRACKING_NUMBER, callUpdatePoTrackingNumber),
    yield takeLatest(PO_CHECK_STOCK, callPoCheckStock),
    yield takeLatest(PO_CHECK_STOCK_COMPLETE, callPoCheckStockComplete),
    yield takeLatest(PO_SET_COMPLETED, callPoSetCompleted),
    yield takeLatest(GET_PO_PAYMENT, callGetPoDetailPayment),
    yield takeLatest(CREATE_PO_PAYMENT, callCreatePoDetailPayment),
    yield takeLatest(PO_CONFIRM_STATUS, callPoConfirm),
    yield takeLatest(PO_CONFIRM_DELIVERING, callPoDelivering),
    yield takeLatest(PO_CONFIRM_DELIVERED, callPoDelivered),
    yield takeLatest(PO_UPDATE_SHIPPING_ADDRESS, callUpdateShippingAddress),
    yield takeLatest(WAREHOUSE_SET_DEFAULT, callWarehouseSetDefault),
    yield takeLatest(PO_APPLY_BRAND, callPoApplyBrand),
    yield takeLatest(PO_SET_CANCEL, callPoSetCancel),

    //po transfer create
    yield takeLatest(PO_TRANSFER_CREATE, callPoTransferCreate),

    //po refund create
    yield takeLatest(PO_REFUND_CREATE, callPoRefundCreate),
  ]);
}

import React from "react";
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {message} from "antd";
import {
  reqApplyBrand,
  reqCreateOT,
  reqDeleteOt,
  reqGetOrder,
  reqGetOrderList,
  reqOrderTransactions, reqOTByOrder,
  reqOtChangeStatus,
  reqOTCodConfirm,
  reqOTDepositConfirm,
  reqOTSetCancel,
  reqOTSetComplete,
  reqOTSetNote,
  reqUpdateOt
} from "../services/order";
import {
  APPLY_BRAND_ORDER, APPLY_BRAND_ORDER_SUCCESS,
  CREATE_ORDER_TRANSACTION,
  CREATE_ORDER_TRANSACTION_SUCCESS,
  DELETE_ORDER_TRANSACTION,
  DELETE_ORDER_TRANSACTION_SUCCESS,
  GET_ORDER_DETAIL,
  GET_ORDER_DETAIL_SUCCESS,
  GET_ORDER_LIST,
  GET_ORDER_LIST_SUCCESS,
  GET_ORDER_TRANSACTION_LIST,
  GET_ORDER_TRANSACTION_LIST_SUCCESS, GET_OT_LIST_BY_ORDER, OT_COD_CONFIRM, OT_COD_CONFIRM_SUCCESS, OT_DEPOSIT_CONFIRM,
  OT_DEPOSIT_CONFIRM_SUCCESS, OT_SET_CANCEL, OT_SET_CANCEL_SUCCESS, OT_SET_COMPLETE,
  OT_SET_COMPLETE_SUCCESS, OT_SET_NOTE,
  OT_SET_NOTE_SUCCESS,
  UPDATE_ORDER_TRANSACTION,
  UPDATE_ORDER_TRANSACTION_SUCCESS
} from "../../constants/ActionTypes";
import {getPaginate} from "../../util/Helper";
import {setStateOrder} from "../actions/Order";

function* callGetOrderList({payload}) {
  try {
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqGetOrderList, payload);
    yield put({
      type: GET_ORDER_LIST_SUCCESS,
      payload: {
        orders: res.data.data,
        pagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* callGetOrder({payload}) {
  try {
    const {id} = payload;
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqGetOrder, {
      id
    });
    yield put({
      type: GET_ORDER_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* callCreateOT({payload}) {
  try {
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqCreateOT, {
      payload
    });
    yield put({
      type: CREATE_ORDER_TRANSACTION_SUCCESS,
      payload: res.data
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* callUpdateOT({payload}) {
  try {
    const {id} = payload;
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqUpdateOt, {
      id,
      payload
    });
    yield put({
      type: UPDATE_ORDER_TRANSACTION_SUCCESS,
      payload: res.data
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* callDeleteOT({payload}) {
  try {
    const {id} = payload;
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqDeleteOt, id);
    yield put({
      type: DELETE_ORDER_TRANSACTION_SUCCESS,
      payload: res.data
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* callGetOTList({payload}) {
  try {
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqOrderTransactions, payload);
    yield put({
      type: GET_ORDER_TRANSACTION_LIST_SUCCESS,
      payload: {
        ots: res.data.data,
        otPagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* callGetOTListByOrder({payload}) {
  try {
    yield put(setStateOrder({
      isListLoading: true
    }));
    const res = yield call(reqOTByOrder, payload);
    yield put({
      type: GET_ORDER_TRANSACTION_LIST_SUCCESS,
      payload: {
        ots: res.data.data,
        otPagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      isListLoading: false
    }));
  }
}

function* applyBrand({payload}) {
  try {
    yield put(setStateOrder({
      actionLoading: true
    }));
    const res = yield call(reqApplyBrand, payload);
    // yield put({
    //   type: APPLY_BRAND_ORDER_SUCCESS,
    //   payload: {
    //     order: res.data
    //   }
    // })
    message.success('Áp dụng nhãn hàng thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      actionLoading: false
    }));
  }
}

function* callOTSetComplete({payload}) {
  try {
    yield put(setStateOrder({
      actionLoading: true
    }));
    const res = yield call(reqOTSetComplete, payload.id);
    yield put({
      type: OT_SET_COMPLETE_SUCCESS,
      payload: {
        ot: res.data
      }
    });
    message.success('Xác nhận đối soát hoàn thành!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      actionLoading: false
    }));
  }
}

function* callOTCodConfirm({payload}) {
  try {
    yield put(setStateOrder({
      actionLoading: true
    }));
    const res = yield call(reqOTCodConfirm, payload.id);
    yield put({
      type: OT_SET_COMPLETE_SUCCESS,
      payload: {
        ot: res.data
      }
    });
    message.success('Xác nhận COD thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      actionLoading: false
    }));
  }
}

function* callOTDepositConfirm({payload}) {
  try {
    yield put(setStateOrder({
      actionLoading: true
    }));
    const res = yield call(reqOTDepositConfirm, payload.id);
    yield put({
      type: OT_SET_COMPLETE_SUCCESS,
      payload: {
        ot: res.data
      }
    });
    message.success('Xác nhận đối soát hoàn thành!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      actionLoading: false
    }));
  }
}

function* callOTSetCancel({payload}) {
  try {
    yield put(setStateOrder({
      actionLoading: true
    }));
    const res = yield call(reqOTSetCancel, payload.id);
    yield put({
      type: OT_SET_COMPLETE_SUCCESS,
      payload: {
        ot: res.data
      }
    });
    message.success('Hủy đối soát thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      actionLoading: false
    }));
  }
}

function* callOTSetNote({payload}) {
  try {
    yield put(setStateOrder({
      actionLoading: true
    }));
    const res = yield call(reqOTSetNote, payload);
    yield put({
      type: OT_SET_COMPLETE_SUCCESS,
      payload: {
        ot: res.data
      }
    });
    message.success('Cập nhật ghi chú thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put(setStateOrder({
      actionLoading: false
    }));
  }
}

export default function* rootSaga() {
  return all([
    yield takeLatest(GET_ORDER_LIST, callGetOrderList),
    yield takeLatest(GET_ORDER_DETAIL, callGetOrder),
    yield takeLatest(GET_ORDER_TRANSACTION_LIST, callGetOTList),
    yield takeLatest(GET_OT_LIST_BY_ORDER, callGetOTListByOrder),
    yield takeLatest(CREATE_ORDER_TRANSACTION, callCreateOT),
    yield takeLatest(UPDATE_ORDER_TRANSACTION, callUpdateOT),
    yield takeLatest(DELETE_ORDER_TRANSACTION, callDeleteOT),
    yield takeLatest(APPLY_BRAND_ORDER, applyBrand),

    yield takeLatest(OT_SET_CANCEL, callOTSetCancel),
    yield takeLatest(OT_SET_COMPLETE, callOTSetComplete),
    yield takeLatest(OT_DEPOSIT_CONFIRM, callOTDepositConfirm),
    yield takeLatest(OT_COD_CONFIRM, callOTCodConfirm),
    yield takeLatest(OT_SET_NOTE, callOTSetNote),
  ])
}

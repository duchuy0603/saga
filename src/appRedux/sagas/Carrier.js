import React from 'react';
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {
  CARRIER_SET_STT,
  CARRIER_CREATE, CARRIER_CREATE_SUCCESS,
  CARRIER_DELETE, CARRIER_DELETE_SUCCESS,
  CARRIER_GET_LIST,
  CARRIER_GET_LIST_SUCCESS,
  CARRIER_UPDATE, CARRIER_UPDATE_SUCCESS
} from "../../constants/ActionTypes";
import {reqTagCreate, reqTagDelete, reqTagGetList, reqTagUpdate} from "../services/tag";
import {getPaginate} from "../../util/Helper";
import {message} from 'antd';
import {reqCarrierCreate, reqCarrierDelete, reqCarrierGetList, reqCarrierUpdate} from "../services/carrier";

export function* setStt(isLoading = false) {
  yield put({
    type: CARRIER_SET_STT,
    isLoading
  })
}

export function* callCarrierGetList({payload}) {
  try {
    yield call(setStt, true);
    const response = yield call(reqCarrierGetList, payload);
    yield put({
      type: CARRIER_GET_LIST_SUCCESS,
      payload: {
        carrierList: response.data.data,
        carrierPaginate: getPaginate(response.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, false);
  }
}

export function* callCarrierDelete({payload}) {
  try {
    yield call(setStt, true);
    yield call(reqCarrierDelete, payload.carrierId);
    yield put({
      type: CARRIER_DELETE_SUCCESS,
      payload: payload
    })
    message.success('Xóa ĐVVC thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, false);
  }
}

export function* callCarrierUpdate({payload}) {
  try {
    yield call(setStt, true);
    const response = yield call(reqCarrierUpdate, payload);
    yield put({
      type: CARRIER_UPDATE_SUCCESS,
      payload: {
        carrier: response.data
      }
    })
    message.success('Cập nhật ĐVVC thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, false);
  }
}

export function* callCarrierCreate({payload}) {
  try {
    yield call(setStt, true);
    const response = yield call(reqCarrierCreate, payload);
    yield put({
      type: CARRIER_CREATE_SUCCESS,
      payload: {
        carrier: response.data
      }
    })
    message.success('Tạo ĐVVC thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, true);
  }
}

export default function* rootSaga() {
  return all([
    yield takeEvery(CARRIER_GET_LIST, callCarrierGetList),
    yield takeLatest(CARRIER_CREATE, callCarrierCreate),
    yield takeLatest(CARRIER_UPDATE, callCarrierUpdate),
    yield takeLatest(CARRIER_DELETE, callCarrierDelete),
  ]);
}

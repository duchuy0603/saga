import {message} from "antd";
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {
  CREATE_VENDOR,
  CREATE_VENDOR_SUCCESS, DELETE_VENDOR, DELETE_VENDOR_SUCCESS,
  GET_VENDOR,
  GET_VENDOR_SUCCESS, UPDATE_VENDOR, UPDATE_VENDOR_SUCCESS
} from "../../constants/ActionTypes";
import {getPaginate} from "../../util/Helper";
import {reqCreateVendor, reqDeleteVendor, reqGetVendor, reqUpdateVendor} from "../services/customer";
import {push} from "react-router-redux";

function* callGetVendor({payload}) {
  try {
    const res = yield call(reqGetVendor, payload);
    yield put({
      type: GET_VENDOR_SUCCESS,
      payload: {
        vendors: res.data.data,
        pagination: getPaginate(res.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  }
}

function* callCreateVendor({payload}) {
  try {
    const res = yield call(reqCreateVendor, payload);
    yield put({
      type: CREATE_VENDOR_SUCCESS,
      payload: {
        vendors: res.data
      }
    });
    yield put(push(`/vendor/${res.data.id}`));
    message.success('Tạo nhà cung cấp thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdateVendor({payload}) {
  try {
    const res = yield call(reqUpdateVendor, payload);
    yield put({
      type: UPDATE_VENDOR_SUCCESS,
      payload: {
        vendors: res.data
      }
    });
    yield put(push(`/vendor/${res.data.id}`));
    message.success('Cập nhật nhà cung cấp thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callDeleteVendor({payload}) {
  try {
    const res = yield call(reqDeleteVendor, payload.vendorId);
    console.log('res VENDOR:', res.data);
    yield put({
      type: DELETE_VENDOR_SUCCESS,
      payload: {
        vendorId: payload.vendorId
      }
    });
    message.success('Xoá nhà cung cấp thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

export default function* rootSaga() {
  return all([
    yield takeEvery(GET_VENDOR, callGetVendor),
    yield takeLatest(CREATE_VENDOR, callCreateVendor),
    yield takeLatest(UPDATE_VENDOR, callUpdateVendor),
    yield takeLatest(DELETE_VENDOR, callDeleteVendor),
  ]);
}

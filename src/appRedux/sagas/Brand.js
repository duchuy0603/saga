import {message} from "antd";
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';

import {getPaginate} from "../../util/Helper";
import {reqCreateBrand, reqDeleteBrand, reqGetBrand, reqUpdateBrand} from "../services/brand";
import {
  CREATE_BRAND,
  CREATE_BRAND_SUCCESS, DELETE_BRAND,
  DELETE_BRAND_SUCCESS, GET_BRAND,
  GET_BRAND_SUCCESS, UPDATE_BRAND,
  UPDATE_BRAND_SUCCESS
} from "../../constants/ActionTypes";

function* callGetBrand({payload}) {
  try {
    const res = yield call(reqGetBrand, payload);
    yield put({
      type: GET_BRAND_SUCCESS,
      payload: {
        brandList: res.data.data,
        pagination: getPaginate(res.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  }
}

function* callCreateBrand({payload}) {
  try {
    const res = yield call(reqCreateBrand, payload);
    yield put({
      type: CREATE_BRAND_SUCCESS,
      payload: {
        brand: res.data
      }
    });
    message.success('Tạo nhãn hàng thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdateBrand({payload}) {
  try {
    const res = yield call(reqUpdateBrand, payload);
    yield put({
      type: UPDATE_BRAND_SUCCESS,
      payload: {
        brand: res.data
      }
    });
    message.success('Cập nhật nhãn hàng thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callDeleteBrand({payload}) {
  try {
    const res = yield call(reqDeleteBrand, payload.brandId);
    yield put({
      type: DELETE_BRAND_SUCCESS,
      payload: {
        brandId: payload.brandId
      }
    });
    message.success('Xoá nhãn hàng thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

export default function* rootSaga() {
  return all([
    yield takeEvery(GET_BRAND, callGetBrand),
    yield takeLatest(CREATE_BRAND, callCreateBrand),
    yield takeLatest(UPDATE_BRAND, callUpdateBrand),
    yield takeLatest(DELETE_BRAND, callDeleteBrand),
  ]);
}

import {message} from "antd";
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {
  CREATE_MANUFACTURE,
  CREATE_MANUFACTURE_SUCCESS, DELETE_MANUFACTURE, DELETE_MANUFACTURE_SUCCESS,
  GET_MANUFACTURE,
  GET_MANUFACTURE_SUCCESS, UPDATE_MANUFACTURE, UPDATE_MANUFACTURE_SUCCESS
} from "../../constants/ActionTypes";
import {getPaginate} from "../../util/Helper";
import {reqCreateManufacture, reqDeleteManufacture, reqGetManufacture, reqUpdateManufacture} from "../services/customer";
import {push} from "react-router-redux";

function* callGetManufacture({payload}) {
  try {
    const res = yield call(reqGetManufacture, payload);
    yield put({
      type: GET_MANUFACTURE_SUCCESS,
      payload: {
        manufactures: res.data.data,
        pagination: getPaginate(res.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  }
}

function* callCreateManufacture({payload}) {
  try {
    const res = yield call(reqCreateManufacture, payload);
    console.log('res MANUFACTURE:', res.data);
    yield put({
      type: CREATE_MANUFACTURE_SUCCESS,
      payload: {
        MANUFACTURE: res.data
      }
    });
    yield put(push(`/manufacture/${res.data.id}`));
    message.success('Tạo nhà sản xuất thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdateManufacture({payload}) {
  try {
    const res = yield call(reqUpdateManufacture, payload);
    console.log('res MANUFACTURE:', res.data);
    yield put({
      type: UPDATE_MANUFACTURE_SUCCESS,
      payload: {
        MANUFACTURE: res.data
      }
    });
    yield put(push(`/manufacture/${res.data.id}`));
    message.success('Cập nhật nhà sản xuất thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callDeleteManufacture({payload}) {
  try {
    const res = yield call(reqDeleteManufacture, payload.MANUFACTUREId);
    console.log('res MANUFACTURE:', res.data);
    yield put({
      type: DELETE_MANUFACTURE_SUCCESS,
      payload: {
        mId: payload.mId
      }
    });
    message.success('Xoá nhà sản xuất thành công!')
  } catch (e) {
    message.error(e.message);
  }
}
//Manufacture
export default function* rootSaga() {
  return all([
    yield takeEvery(GET_MANUFACTURE, callGetManufacture),
    yield takeLatest(CREATE_MANUFACTURE, callCreateManufacture),
    yield takeLatest(UPDATE_MANUFACTURE, callUpdateManufacture),
    yield takeLatest(DELETE_MANUFACTURE, callDeleteManufacture),
  ]);
}

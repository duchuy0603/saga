import {message} from "antd";
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_SUCCESS, DELETE_CUSTOMER, DELETE_CUSTOMER_SUCCESS,
  GET_CUSTOMER,
  GET_CUSTOMER_SUCCESS, UPDATE_CUSTOMER, UPDATE_CUSTOMER_SUCCESS
} from "../../constants/ActionTypes";
import {getPaginate} from "../../util/Helper";
import {reqCreateCustomer, reqDeleteCustomer, reqGetCustomer, reqUpdateCustomer} from "../services/customer";
import {push} from "react-router-redux";

function* callGetCustomer({payload}) {
  try {
    const res = yield call(reqGetCustomer, payload);
    yield put({
      type: GET_CUSTOMER_SUCCESS,
      payload: {
        customers: res.data.data,
        pagination: getPaginate(res.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  }
}

function* callCreateCustomer({payload}) {
  try {
    const res = yield call(reqCreateCustomer, payload);
    console.log('res customer:', res.data);
    yield put({
      type: CREATE_CUSTOMER_SUCCESS,
      payload: {
        customer: res.data
      }
    });
    yield put(push(`/customer/${res.data.id}`));
    message.success('Tạo khách hàng thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callUpdateCustomer({payload}) {
  try {
    const {customerId, params} = payload;
    const res = yield call(reqUpdateCustomer, customerId, params);
    yield put({
      type: UPDATE_CUSTOMER_SUCCESS,
      payload: {
        customer: res.data
      }
    });
    yield put(push(`/customer/${res.data.id}`));
    message.success('Cập nhật khách hàng thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

function* callDeleteCustomer({payload}) {
  try {
    const res = yield call(reqDeleteCustomer, payload.customerId);
    console.log('res customer:', res.data);
    yield put({
      type: DELETE_CUSTOMER_SUCCESS,
      payload: {
        customerId: payload.customerId
      }
    });
    message.success('Xoá khách hàng thành công!')
  } catch (e) {
    message.error(e.message);
  }
}

export default function* rootSaga() {
  return all([
    yield takeEvery(GET_CUSTOMER, callGetCustomer),
    yield takeLatest(CREATE_CUSTOMER, callCreateCustomer),
    yield takeLatest(UPDATE_CUSTOMER, callUpdateCustomer),
    yield takeLatest(DELETE_CUSTOMER, callDeleteCustomer),
  ]);
}

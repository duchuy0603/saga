import {all, call, fork, put, takeEvery, takeLatest} from "redux-saga/effects";
import {
  CREATE_ACCOUNT,
  CREATE_ACCOUNT_SUCCESS, DELETE_ACCOUNT, DELETE_ACCOUNT_SUCCESS, GET_ACCOUNT,
  GET_ACCOUNT_SUCCESS,
  SET_USER_STT, UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_SUCCESS
} from "../../constants/ActionTypes";
import {reqCreateAccount, reqDeleteAccount, reqGetAccount, reqUpdateAccount} from "../services/auth";
import {getPaginate} from "../../util/Helper";
import {message} from "antd";

export function* callGetAccount({payload}) {
  try {
    yield put({
      type: SET_USER_STT,
      payload: {loader: true}
    });
    const response = yield call(reqGetAccount, payload);
    yield put({
      type: GET_ACCOUNT_SUCCESS,
      payload: {
        acList: response.data.data,
        acPaginate: getPaginate(response.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_USER_STT,
      payload: {loader: false}
    })
  }
}

export function* callCreateAccount({payload}) {
  try {
    yield put({
      type: SET_USER_STT,
      payload: {loader: true}
    });
    const response = yield call(reqCreateAccount, payload.account);
    yield put({
      type: CREATE_ACCOUNT_SUCCESS,
      payload: {
        account: response.data
      }
    });
    message.success("Tạo tài khoản thành công!");
  } catch (e) {
    yield put({
      type: SET_USER_STT,
      payload: {error: true}
    })
    message.error(e.message);
  } finally {
    yield put({
      type: SET_USER_STT,
      payload: {loader: false}
    })
  }
}

export function* callUpdateAccount({payload}) {
  try {
    yield put({
      type: SET_USER_STT,
      payload: {acLoading: true}
    });
    const response = yield call(reqUpdateAccount, payload.account);
    yield put({
      type: UPDATE_ACCOUNT_SUCCESS,
      payload: {
        account: response.data
      }
    });
    message.success("Cập nhật tài khoản thành công!")
  } catch (e) {
    yield put({
      type: SET_USER_STT,
      payload: {error: true}
    })
    message.error(e.message);
  } finally {
    yield put({
      type: SET_USER_STT,
      payload: {acLoading: false}
    })
  }
}

export function* callDeleteAccount({payload}) {
  try {

    yield put({
      type: SET_USER_STT,
      payload: {loader: true}
    })
    const response = yield call(reqDeleteAccount, payload.accountId);
    yield put({
      type: DELETE_ACCOUNT_SUCCESS,
      payload: {
        accountId: payload.accountId
      }
    })
    message.success("Xóa tài khoản thành công!");
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_USER_STT,
      payload: {loader: false}
    })
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(GET_ACCOUNT, callGetAccount),
    yield takeLatest(CREATE_ACCOUNT, callCreateAccount),
    yield takeLatest(UPDATE_ACCOUNT, callUpdateAccount),
    yield takeLatest(DELETE_ACCOUNT, callDeleteAccount),
  ])
}

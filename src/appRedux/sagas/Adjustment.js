import {all, call, put, takeLatest, takeEvery} from "redux-saga/effects";
import {message} from "antd";
import {reqAdjustmentChangeStt, reqAdjustmentCreate, reqAdjustmentGetList} from "../services/adjustment";
import {
  ADJ_CANCEL,
  ADJ_CHANGE_STT, ADJ_CONFIRM, ADJ_CONFIRM_SUCCESS,
  ADJ_CREATE,
  ADJ_CREATE_SUCCESS,
  ADJ_GET_LIST,
  ADJ_GET_LIST_SUCCESS
} from "../../constants/ActionTypes";
import {getPaginate} from "../../util/Helper";

function* changeStt(obj = {acLoad: false, loading: false}) {
  yield put({
    type: ADJ_CHANGE_STT,
    payload: {
      ...obj
    }
  })
}

function* callAdjustmentGetList({payload}) {
  try {
    yield call(changeStt, {loading: true});
    const response = yield call(reqAdjustmentGetList, payload);
    yield put({
      type: ADJ_GET_LIST_SUCCESS,
      payload: {
        adjList: response.data.data,
        adjPaginate: getPaginate(response.data)
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(changeStt, {loading: false})
  }
}

function* callAdjustmentCreate({payload}) {
  try {
    yield call(changeStt, {acLoad: true});
    const response = yield call(reqAdjustmentCreate, payload);
    yield put({
      type: ADJ_CREATE_SUCCESS,
      payload: {
        adjustment: response.data
      }
    });
    message.success("Tạo phiếu chuyển thành công!")
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(changeStt, {acLoad: false})
  }
}

function* callAdjustmentChangeStt({payload}) {
  try {
    yield call(changeStt, {acLoad: true});
    const response = yield call(reqAdjustmentChangeStt, payload);
    yield put({
      type: ADJ_CONFIRM_SUCCESS,
      payload: {
        adjustment: response?.data
      }
    });
    message.success("Thay đổi trạng thái phiếu chuyển thành công!")

  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(changeStt, {acLoad: false})
  }
}

export default function* rootSaga() {
  return yield all([
    yield takeEvery(ADJ_GET_LIST, callAdjustmentGetList),
    yield takeLatest(ADJ_CREATE, callAdjustmentCreate),
    yield takeLatest(ADJ_CANCEL, callAdjustmentChangeStt),
    yield takeLatest(ADJ_CONFIRM, callAdjustmentChangeStt),
  ])
}

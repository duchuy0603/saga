import React from 'react';
import {takeEvery, put, call, all, takeLatest} from 'redux-saga/effects';
import {
  TAG_CREATE, TAG_CREATE_SUCCESS,
  TAG_DELETE, TAG_DELETE_SUCCESS,
  TAG_GET_LIST,
  TAG_GET_LIST_SUCCESS,
  TAG_SET_STT,
  TAG_UPDATE, TAG_UPDATE_SUCCESS
} from "../../constants/ActionTypes";
import {reqTagCreate, reqTagDelete, reqTagGetList, reqTagUpdate} from "../services/tag";
import {getPaginate} from "../../util/Helper";
import {message} from 'antd';

export function* setStt(isLoading = false) {
  yield put({
    type: TAG_SET_STT,
    isLoading
  })
}

export function* callTagGetList({payload}) {
  try {
    yield call(setStt, true);
    const response = yield call(reqTagGetList, payload);
    yield put({
      type: TAG_GET_LIST_SUCCESS,
      payload: {
        tagList: response.data.data,
        tagPaginate: getPaginate(response.data)
      }
    })
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, false);
  }
}

export function* callTagDelete({payload}) {
  try {
    yield call(setStt, true);
    yield call(reqTagDelete, payload.tagId);
    yield put({
      type: TAG_DELETE_SUCCESS,
      payload: payload
    })
    message.success('Xóa tag thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, false);
  }
}

export function* callTagUpdate({payload}) {
  try {
    yield call(setStt, true);
    const response = yield call(reqTagUpdate, payload);
    yield put({
      type: TAG_UPDATE_SUCCESS,
      payload: {
        tag: response.data
      }
    })
    message.success('Cập nhật tag thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, false);
  }
}

export function* callTagCreate({payload}) {
  try {
    yield call(setStt, true);
    const response = yield call(reqTagCreate, payload);
    yield put({
      type: TAG_CREATE_SUCCESS,
      payload: {
        tag: response.data
      }
    })
    message.success('Tạo tag thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield call(setStt, true);
  }
}

export default function* rootSaga() {
  return all([
    yield takeEvery(TAG_GET_LIST, callTagGetList),
    yield takeLatest(TAG_CREATE, callTagCreate),
    yield takeLatest(TAG_UPDATE, callTagUpdate),
    yield takeLatest(TAG_DELETE, callTagDelete),
  ]);
}

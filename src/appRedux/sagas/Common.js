import {all, call, put, takeLatest} from 'redux-saga/effects';
import {callGetMenu, getCityList} from '../services/common';
import {message} from 'antd';
import {COMMON_GET_MENU, COMMON_GET_MENU_SUCCESS, GET_CITY,} from '../../constants/ActionTypes';
import {listCities} from '../../util/Helper';

export function* doGetCities() {
  try {
    let cities = listCities();
    if (cities.length === 0) {
      const res = yield getCityList();
      cities = res.data;
    }
    yield put({
      type: GET_CITY,
      payload: {
        cities,
      },
    });
  } catch (e) {
    message.error(e.message);
  }
}

export function* getMenu({payload}) {
  const {role} = payload;
  const res = yield call(callGetMenu, role);
  yield put({
    type: COMMON_GET_MENU_SUCCESS,
    payload: res,
  });
}

export default function* rootSaga() {
  yield all([takeLatest(COMMON_GET_MENU, getMenu)]);
}

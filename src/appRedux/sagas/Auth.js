import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {
  SIGNIN_USER,
  SIGNOUT_USER,
} from "constants/ActionTypes";
import {
  showAuthLoader,
  showAuthMessage, userGetAppInfo,
  userSignInSuccess,
  userSignOutSuccess,
} from '../../appRedux/actions/Auth';
import {message} from "antd";
import {doGetCities} from "./Common";
import {
  checkToken,
  getAppInfo,
} from "../services/auth";
import {actionGetMenu, fetchStart} from '../actions';
import {reqAuth} from "../services/auth";
import {getVersion} from '../services/common';


const signInUserAuth = async (email, password) => {
  return reqAuth({email, password});
};

const signOutRequest = async () => {
  return undefined;
};

function* signInUserWithEmailPassword({payload}) {
  const {email, password} = payload;
  try {
    yield put(fetchStart);
    const response = yield call(signInUserAuth, email, password);

    const {token, user} = response.data
    if (response.message) {
      yield put(showAuthMessage(response.message));
    } else {
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('token', token);
      yield put(userSignInSuccess(response.data));
      yield put(actionGetMenu(user.role));
      yield doGetCities();
    }
  } catch (error) {
    message.error(error.message);
    yield put(showAuthMessage(error.message));
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser === undefined) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      yield put(userSignOutSuccess());
    } else {
      yield put(showAuthMessage(signOutUser.message));
    }
  } catch (error) {
    message.error(error.message);
    yield put(showAuthMessage(error));
  }
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export function* doCheckAppVersion() {
  try {
    const rest = yield call(getAppInfo);
    const clientVersion = getVersion();
    if (clientVersion !== rest.data.client_version) {
      message.warn(
        `Phiên bản ${clientVersion} hiện tại cần năng cấp lên phiên bản ${rest.data.client_version}. Xin vui lòng nhấn "Ctrl + F5" để cập nhập`,
        30
      );
    }
    console.log("doCheckAppVersion", rest.data);
    yield put(userGetAppInfo(rest.data));
  } catch (e) {
    message.error(e.message);
  }
}

export function* doCheckToken() {
  try {
    const _token = localStorage.getItem('token');
    if (_token) {
      const res = yield call(checkToken, {token: _token});
      const {user, token, role} = res.data;
      yield put(
        userSignInSuccess({
          user: user,
          token: token ? token : _token,
          role: user.role,
        }),
      );
      if (token) {
        localStorage.setItem('token', token);
      }
      yield put(actionGetMenu(user.role));
      yield doGetCities();
    } else {
      yield put(userSignOutSuccess());
    }
  } catch (e) {
    yield put(userSignOutSuccess());
    yield put(showAuthMessage(e.message));
  }
}


export default function* rootSaga() {
  yield all([
    fork(signInUser),
    fork(signOutUser),
    yield doCheckAppVersion(),
    yield doCheckToken(),
  ])
}

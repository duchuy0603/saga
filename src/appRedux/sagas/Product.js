import React from "react";
import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {message} from "antd";
import {push} from 'react-router-redux';
import {
  reqChangeStatusProduct,
  reqCreateProduct,
  reqCreateProductCategory,
  reqDeleteProductCategory,
  reqGetProduct,
  reqGetProductCategory,
  reqProductDetail,
  reqUpdateProduct,
  reqUpdateProductCategory
} from "../services/product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_SUCCESS,
  PRODUCT_CAT_CREATE,
  PRODUCT_CAT_CREATE_SUCCESS,
  PRODUCT_CAT_DEL,
  PRODUCT_CAT_DEL_SUCCESS,
  PRODUCT_CAT_GET_LIST,
  PRODUCT_CAT_GET_LIST_SUCCESS,
  PRODUCT_CAT_UPDATE,
  PRODUCT_CAT_UPDATE_SUCCESS,
  SET_P_STATE,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS
} from "../../constants/ActionTypes";
import {fetchError} from "../actions";
import {getPaginate} from "../../util/Helper";

function* callGetProduct({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        isListLoading: true
      }
    });
    const res = yield call(reqGetProduct, payload);
    const {data} = res.data;
    yield put({
      type: GET_PRODUCT_SUCCESS,
      payload: {
        products: data,
        pagination: getPaginate(res.data)
      }
    });
  } catch (e) {
    yield put(fetchError());
    message.error(e.message);
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        isListLoading: false
      }
    });
  }
}

function* callProductDetail({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        pDetailLoading: true
      }
    });
    const res = yield call(reqProductDetail, payload.productId);
    yield put({
      type: GET_PRODUCT_DETAIL_SUCCESS,
      payload: {
        pDetail: res.data
      }
    });
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        pDetailLoading: false
      }
    })
  }
}

function* callProductCreate({payload}) {
  try {
    const res = yield call(reqCreateProduct, payload.product);
    yield put(push('/product'));
    message.success('Tạo sản phẩm thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callProductUpdate({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        pDetailLoading: true
      }
    });
    const {productId, product} = payload;
    yield call(reqUpdateProduct, productId, product);
    // yield put(push(`/product/${productId}`));
    message.success('Cập nhật sản phẩm thành công!');
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        pDetailLoading: false
      }
    })
  }
}

function* callProductChangeStatus({payload}) {
  try {
    yield call(reqChangeStatusProduct, payload);
    yield put({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: payload
    });
    message.success('Thay đổi trạng thái sản phẩm sản phẩm thành công!');
  } catch (e) {
    message.error(e.message);
  }
}

function* callProductCategoryCreate({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: true
      }
    });
    const response = yield call(reqCreateProductCategory, payload);
    yield put({
      type: PRODUCT_CAT_CREATE_SUCCESS,
      payload: {
        cat: response.data
      }
    });
    message.success(`Tạo sản phẩm thành công!`)
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: false
      }
    });
  }
}

function* callProductCatGetList({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: true
      }
    });
    const response = yield call(reqGetProductCategory, payload);
    yield put({
      type: PRODUCT_CAT_GET_LIST_SUCCESS,
      payload: {
        catList: response.data.data,
        catPage: getPaginate(response.data)
      }
    });
  } catch (e) {
    message.error(e.message)
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: false
      }
    })
  }
}

function* callProductCatUpdate({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: true
      }
    });
    const response = yield call(reqUpdateProductCategory, payload);
    yield put({
      type: PRODUCT_CAT_UPDATE_SUCCESS,
      payload: {
        cat: response.data
      }
    });
    message.success(`Cập nhật thành công!`);
  } catch (e) {
    message.error(e.message)
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: false
      }
    })
  }
}

function* callProductCatDelete({payload}) {
  try {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: true
      }
    });
    yield call(reqDeleteProductCategory, payload.catId);
    yield put({
      type: PRODUCT_CAT_DEL_SUCCESS,
      payload
    });
    message.success(`Xoá thành công!`)
  } catch (e) {
    message.error(e.message);
  } finally {
    yield put({
      type: SET_P_STATE,
      payload: {
        acLoad: false
      }
    })
  }
}


export default function* rootSaga() {
  return all([
    yield  takeEvery(GET_PRODUCT, callGetProduct),
    yield  takeLatest(GET_PRODUCT_DETAIL, callProductDetail),
    yield  takeLatest(CREATE_PRODUCT, callProductCreate),
    yield takeLatest(DELETE_PRODUCT, callProductChangeStatus),
    yield takeLatest(UPDATE_PRODUCT, callProductUpdate),
    //Danh mục/Nhãn hiệu/Loại/Nhóm/Biến thể sản phẩm

    yield takeEvery(PRODUCT_CAT_GET_LIST, callProductCatGetList),
    yield takeLatest(PRODUCT_CAT_CREATE, callProductCategoryCreate),
    yield takeLatest(PRODUCT_CAT_UPDATE, callProductCatUpdate),
    yield takeLatest(PRODUCT_CAT_DEL, callProductCatDelete),
  ]);
}

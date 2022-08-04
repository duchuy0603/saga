import {
  DELETE_PRODUCT_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_SUCCESS,
  PRODUCT_CAT_CREATE_SUCCESS,
  PRODUCT_CAT_DEL_SUCCESS,
  PRODUCT_CAT_GET_LIST_SUCCESS,
  PRODUCT_CAT_UPDATE_SUCCESS,
  SET_P_STATE
} from "../../constants/ActionTypes";

const initState = {
  isListLoading: false,
  products: [],
  pagination: {},
  pDetailLoading: false,
  pDetail: null,
  acLoad: false,
  catList: [],
  catPage: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_P_STATE:
    case PRODUCT_CAT_GET_LIST_SUCCESS: {
      return {
        ...state,
        ...action.payload
      }
    }

    case PRODUCT_CAT_CREATE_SUCCESS: {
      const catList = state.catList.slice();
      catList.push(action.payload.cat);
      return {
        ...state,
        catList
      }
    }
    case PRODUCT_CAT_UPDATE_SUCCESS: {
      const catList = state.catList.slice();
      const catIndex = catList.findIndex(cat => cat.id === action.payload.cat.id);
      if (catIndex > -1) {
        catList[catIndex] = action.payload.cat
      }
      return {
        ...state,
        catList
      }
    }
    case PRODUCT_CAT_DEL_SUCCESS: {
      state.catList = state.catList.filter(item => item.id !== action.payload.catId);
      return {
        ...state,
        catList: state.catList
      }
    }
    case DELETE_PRODUCT_SUCCESS:
      state.products = state.products.filter(item => item.id !== action.payload.productId);
      return {
        ...state,
        products: state.products
      };
    case GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        pDetail: action.payload.pDetail
      };
    case GET_PRODUCT_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination
      }
    default:
      return {
        ...state
      }
  }
}

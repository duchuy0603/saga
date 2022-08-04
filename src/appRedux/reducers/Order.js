import {
  APPLY_BRAND_ORDER_SUCCESS,
  CHANGE_STATUS_ORDER_TRANSACTION_SUCCESS,
  CREATE_ORDER_TRANSACTION_SUCCESS,
  DELETE_ORDER_TRANSACTION_SUCCESS,
  GET_ORDER_DETAIL_SUCCESS,
  GET_ORDER_LIST_SUCCESS,
  GET_ORDER_TRANSACTION_LIST_SUCCESS,
  OT_COD_CONFIRM_SUCCESS,
  OT_DEPOSIT_CONFIRM_SUCCESS,
  OT_SET_CANCEL_SUCCESS,
  OT_SET_COMPLETE_SUCCESS, OT_SET_NOTE_SUCCESS,
  SET_STATE_ORDER,
  UPDATE_ORDER_TRANSACTION_SUCCESS,
} from '../../constants/ActionTypes'

const initialState = {
  orders: [],
  order: null,
  actionLoading: false,
  isListLoading: false,
  pagination: {},
  ots: [],
  otPagination: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_ORDER: {
      return {
        ...state,
        ...action.payload
      }
    }
    case GET_ORDER_LIST_SUCCESS: {
      const {orders, pagination} = action.payload;
      return {
        ...state,
        orders,
        pagination
      };
    }
    case APPLY_BRAND_ORDER_SUCCESS:
    case GET_ORDER_DETAIL_SUCCESS: {
      const order = action.payload;
      return {
        ...state,
        order
      };
    }
    case GET_ORDER_TRANSACTION_LIST_SUCCESS: {
      const {ots, otPagination} = action.payload;
      console.log(ots, otPagination);
      return {
        ...state,
        ots,
        otPagination
      };
    }
    case CREATE_ORDER_TRANSACTION_SUCCESS: {
      const ot = action.payload;
      const newList = state.ots.slice();
      newList.push(ot);
      return {
        ...state,
        ots: newList
      };
    }
    case CHANGE_STATUS_ORDER_TRANSACTION_SUCCESS:
    case UPDATE_ORDER_TRANSACTION_SUCCESS: {
      const ot = action.payload;
      const newList = state.ots.slice();
      const idx = newList.findIndex(item => {
        return item.id === ot.id
      });
      if (idx > -1) {
        newList[idx] = ot;
      }
      return {
        ...state,
        ots: newList
      };
    }
    case OT_SET_CANCEL_SUCCESS:
    case OT_SET_COMPLETE_SUCCESS:
    case OT_DEPOSIT_CONFIRM_SUCCESS:
    case OT_SET_NOTE_SUCCESS:
    case OT_COD_CONFIRM_SUCCESS: {
      const {ot} = action.payload;
      const ots = state.ots.slice();
      const indexOT = ots.findIndex(item => item.id === ot.id);
      if (indexOT > -1) {
        ots[indexOT] = ot;
      }
      return {
        ...state,
        ots
      }
    }
    case DELETE_ORDER_TRANSACTION_SUCCESS: {
      const ot = action.payload;
      let newList = state.ots.slice();
      const idx = newList.findIndex(item => {
        return item.id === ot.id
      });
      if (idx > 0) {
        newList = newList.splice(idx, 1);
      }

      return {
        ...state,
        ots: newList
      };
    }
    default:
      return {...state};
  }
}

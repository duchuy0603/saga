import {
  CHANGE_PO_STT,
  GET_PO_DETAIL_SUCCESS,
  GET_PO_SUCCESS, PO_REFUND_CREATE, PO_REFUND_CREATE_SUCCESS,
} from "../../constants/ActionTypes";

const initialState = {
  purchaseOrders: null,
  pagination: {},
  poDetail: {},
  isDetailLoading: false,
  listLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PO_STT:
      return {
        ...state,
        ...action.payload
      };
    case GET_PO_SUCCESS:
      return {
        ...state,
        ...{
          purchaseOrders: action.payload.purchaseOrders,
          pagination: action.payload.pagination
        }
      };
    case GET_PO_DETAIL_SUCCESS:
      return {
        ...state,
        ...{
          poDetail: action.payload.poDetail,
        }
      };
    default:
      return {
        ...state
      }
  }
}

import {GET_PO_PAYMENT_SUCCESS, GET_PO_SUCCESS, SET_STATE_PO} from "../../constants/ActionTypes";

const initialState = {
  poPaymentList: [],
  pagination: {},
  isListLoading: false
}
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_PO:
      return {
        ...state,
        ...action.payload
      }
    case GET_PO_PAYMENT_SUCCESS:
      return {
        ...state,
        ...{
          poPaymentList: action.payload.poPaymentList,
          pagination: action.payload.pagination,
          isListLoading: false
        }
      }
    default:
      return {
        ...state
      }
  }
}

import {
  CREATE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_SUCCESS,
  GET_CUSTOMER,
  GET_CUSTOMER_SUCCESS
} from "../../constants/ActionTypes";

const initialState = {
  customers: null,
  pagination: {}
}
export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_CUSTOMER_SUCCESS:
      return {
        ...state
      }
    case DELETE_CUSTOMER_SUCCESS:
      state.customers = state.customers.filter(item => item.id !== action.payload.customerId);
      return {
        ...state,
        customers: state.customers
      }
    case GET_CUSTOMER_SUCCESS:
      return {
        ...state,
        ...{
          customers: action.payload.customers,
          pagination: action.payload.pagination
        }
      }
    default:
      return {
        ...state
      }
  }
}

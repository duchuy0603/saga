import {
  CREATE_VENDOR_SUCCESS,
  DELETE_VENDOR_SUCCESS,
  GET_VENDOR_SUCCESS
} from "../../constants/ActionTypes";

const initialState = {
  vendors: [],
  pagination: {}
};
export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_VENDOR_SUCCESS:
      return {
        ...state
      }
    case DELETE_VENDOR_SUCCESS:
      state.vendors = state.vendors.filter(item => item.id !== action.payload.vendorId);
      return {
        ...state,
        vendors: state.vendors
      }
    case GET_VENDOR_SUCCESS:
      return {
        ...state,
        ...{
          vendors: action.payload.vendors,
          pagination: action.payload.pagination
        }
      }
    default:
      return {
        ...state
      }
  }
}

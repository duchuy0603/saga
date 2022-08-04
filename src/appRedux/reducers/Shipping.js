import {
  CREATE_MANUFACTURE_SUCCESS,
  DELETE_MANUFACTURE_SUCCESS,
  GET_MANUFACTURE_SUCCESS
} from "../../constants/ActionTypes";

const initialState = {
  manufactures: null,
  pagination: {}
}
export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_MANUFACTURE_SUCCESS:
      return {
        ...state
      }
    case DELETE_MANUFACTURE_SUCCESS:
      state.manufactures = state.manufactures.filter(item => item.id !== action.payload.mId);
      return {
        ...state,
        manufactures: state.manufactures
      }
    case GET_MANUFACTURE_SUCCESS:
      return {
        ...state,
        ...{
          manufactures: action.payload.manufactures,
          pagination: action.payload.pagination
        }
      }
    default:
      return {
        ...state
      }
  }
}

import {
  CREATE_BRAND_SUCCESS,
  DELETE_BRAND_SUCCESS,
  GET_BRAND_SUCCESS,
  UPDATE_BRAND_SUCCESS
} from "../../constants/ActionTypes";

const initialState = {
  brandList: [],
  isLoading: false,
  pagination: null
}
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BRAND_SUCCESS:
      return {
        ...state,
        brandList: action.payload.brandList,
        pagination: action.payload.pagination
      }
    case CREATE_BRAND_SUCCESS:
      const brand = action.payload.brand;
      const newList = state.brandList.slice();
      newList.push(brand);
      return {
        ...state,
        brandList: newList
      }
    case UPDATE_BRAND_SUCCESS:
      const brands = state.brandList.slice();
      const index = brands.findIndex(item => item.id === action.payload.brand.id);
      brands[index] = action.payload.brand
      return {
        ...state,
        brandList: brands
      }
    case DELETE_BRAND_SUCCESS:
      return {
        ...state,
        brandList: state.brandList.filter(item => item.id !== action.payload.brandId)
      }
    default:
      return {
        ...state
      }
  }

}

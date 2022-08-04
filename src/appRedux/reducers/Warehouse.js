import {
  CREATE_WAREHOUSE_SUCCESS,
  DELETE_WAREHOUSE_SUCCESS,
  GET_WAREHOUSE,
  GET_WAREHOUSE_PRODUCT_SUCCESS,
  GET_WAREHOUSE_REPORT_SUCCESS,
  GET_WAREHOUSE_SUCCESS,
  GET_WAREHOUSE_TRANS_SUCCESS,
  GET_WAREHOUSE_VARIANT_SUCCESS,
  UPDATE_WAREHOUSE_SUCCESS,
  WAREHOUSE_SET_DEFAULT_SUCCESS, WAREHOUSE_SET_STATE
} from "../../constants/ActionTypes";

const initialState = {
  warehouses: [],
  isLoading: false,
  pagination: {},
  pWarehousesList: [],
  pWarehousePagination: {},
  pVariantList: [],
  pVariantPagination: {},
  detailTrans: [],
  detailTransPagination: {},
  report: {
    total_stock: 0
  }
};
export default (state = initialState, action) => {
  switch (action.type) {
    case WAREHOUSE_SET_STATE: {
      return {
        ...state,
        ...action.payload
      }
    }
    case DELETE_WAREHOUSE_SUCCESS:
      state.warehouses = state.warehouses.filter(item => item.id !== action.payload.warehouseId);
      return {
        ...state,
        warehouses: state.warehouses
      };
    case GET_WAREHOUSE_REPORT_SUCCESS:
      return {
        ...state,
        report: action.payload.report
      };
    case CREATE_WAREHOUSE_SUCCESS: {
      const warehouse = action.payload.warehouse;
      const newList = state.warehouses.slice();
      newList.push(warehouse);
      return {
        ...state,
        warehouses: newList
      }
    }

    case UPDATE_WAREHOUSE_SUCCESS: {
      const warehouses = state.warehouses.slice();
      const index = warehouses.findIndex(item => item.id === action.payload.warehouse.id);
      if (index >= 0) {
        warehouses[index] = action.payload.warehouse;
      }
      return {
        ...state,
        warehouses: warehouses
      }
    }
    case GET_WAREHOUSE_SUCCESS:
      return {
        ...state,
        ...{
          warehouses: action.payload.warehouses,
          pagination: action.payload.pagination
        }
      };
    case WAREHOUSE_SET_DEFAULT_SUCCESS: {
      const warehouse = action.payload.warehouse;
      const newList = state.warehouses.slice();
      for (let i = 0; i++; i < newList.length) {
        newList[i].default = 0;
        if (newList[i].id === warehouse.id) {
          newList[i].default = 1;
        }
      }
      return {
        ...state,
        warehouses: newList
      };
    }
    case GET_WAREHOUSE_VARIANT_SUCCESS:
      return {
        ...state,
        ...{
          pVariantList: action.payload.pVariantList,
          pVariantPagination: action.payload.pVariantPagination
        }
      };
    case GET_WAREHOUSE_TRANS_SUCCESS:
      return {
        ...state,
        ...{
          detailTrans: action.payload.detailTrans,
          detailTransPagination: action.payload.detailTransPagination
        }
      };
    case GET_WAREHOUSE_PRODUCT_SUCCESS:
      return {
        ...state,
        ...{
          pWarehousesList: action.payload.pWarehousesList,
          pWarehousePagination: action.payload.pWarehousePagination
        }
      };
    default:
      return {
        ...state
      }
  }
}

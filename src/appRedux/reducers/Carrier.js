import {
  CARRIER_CREATE_SUCCESS,
  CARRIER_DELETE_SUCCESS,
  CARRIER_GET_LIST_SUCCESS, CARRIER_SET_STT,
  CARRIER_UPDATE_SUCCESS
} from "../../constants/ActionTypes";

const INITIAL_STATE = {
  carrierList: [],
  carrierPaginate: null,
  isLoading: false
}
export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case CARRIER_SET_STT: {
      return {
        ...state,
        ...payload
      }
    }
    case CARRIER_GET_LIST_SUCCESS: {
      return {
        ...state,
        ...payload
      }
    }
    case CARRIER_CREATE_SUCCESS: {
      const carrierList = state.carrierList.slice();
      carrierList.push(payload.carrier);
      return {
        ...state,
        carrierList
      }
    }
    case CARRIER_UPDATE_SUCCESS: {
      const carrierList = state.carrierList.slice();
      const cIndex = carrierList.findIndex(carrier => carrier.id === payload.carrier.id);
      if (cIndex > -1) {
        carrierList[cIndex] = payload.carrier;
      }
      return {
        ...state,
        carrierList
      }
    }
    case CARRIER_DELETE_SUCCESS: {
      const carries = state.carrierList;
      const carrierList = carries.filter(carrier => carrier.id !== payload.carrierId);
      return {
        ...state,
        ...carrierList
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

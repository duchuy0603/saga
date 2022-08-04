import {ADJUSTMENT_STT} from "../../constants/constant";
import {
  ADJ_CANCEL_SUCCESS,
  ADJ_CHANGE_STT,
  ADJ_CONFIRM_SUCCESS, ADJ_CREATE_SUCCESS,
  ADJ_GET_LIST_SUCCESS, ADJ_UPDATE_SUCCESS
} from "../../constants/ActionTypes";

const initial_state = {
  adjList: [],
  adjPaginate: {},
  acLoad: false,
  loading: false
}

export default (state = initial_state, action) => {
  const {type, payload} = action;
  switch (type) {
    case ADJ_CHANGE_STT:
    case ADJ_GET_LIST_SUCCESS: {
      return {
        ...state,
        ...payload
      }
    }
    case ADJ_CREATE_SUCCESS: {
      const adjustment = payload.adjustment;
      const adjList = state.adjList.slice();
      adjList.push(adjustment);
      return {
        ...state,
        adjList: adjList
      }
    }
    case ADJ_CONFIRM_SUCCESS:
    case ADJ_CANCEL_SUCCESS:
    case ADJ_UPDATE_SUCCESS:
      const adjList = state.adjList.slice();
      const index = adjList.findIndex(item => item.id === payload.adjustment.id);
      adjList[index] = payload.adjustment
      return {
        ...state,
        adjList: adjList
      }
    default: {
      return state;
    }
  }
}

import {SET_STATE_ORDER} from "../../constants/ActionTypes";

export const setStateOrder = (payload) => {
  return {
    type: SET_STATE_ORDER,
    payload: payload
  };
};

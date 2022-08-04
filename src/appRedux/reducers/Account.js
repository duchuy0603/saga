import {
  CREATE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  GET_ACCOUNT_SUCCESS,
  SET_USER_STT, UPDATE_ACCOUNT_SUCCESS
} from "../../constants/ActionTypes";

const initialState = {
  acList: [],
  acPaginate: null,
  acLoading: false,
  loader: false,
  error: false
};

export default (state = initialState, action) => {
  const {payload, type} = action;

  switch (type) {
    case SET_USER_STT: {
      return {
        ...state,
        ...payload
      }
    }
    case GET_ACCOUNT_SUCCESS: {
      return {
        ...state,
        ...payload
      }
    }
    case DELETE_ACCOUNT_SUCCESS: {
      const accountId = action.payload.accountId;
      const acList = state.acList.filter(item => item.id !== accountId);
      return {
        ...state,
        acList
      }
    }
    case CREATE_ACCOUNT_SUCCESS: {
      const account = payload.account;
      const acList = state.acList.slice();
      acList.push(account);
      return {
        ...state,
        acList
      }
    }
    case UPDATE_ACCOUNT_SUCCESS: {
      const account = payload.account;
      const acList = state.acList.slice();
      const index = acList.findIndex(item => item.id === account.id);
      if (index !== -1) {
        acList[index] = account;
      }
      return {
        ...state,
        acList
      }
    }
    default:
      return {
        ...state
      }
  }
}

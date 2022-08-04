import {
  TAG_CREATE_SUCCESS,
  TAG_DELETE,
  TAG_DELETE_SUCCESS,
  TAG_GET_LIST_SUCCESS,
  TAG_UPDATE_SUCCESS
} from "../../constants/ActionTypes";

const INITIAL_STATE = {
  tagList: [],
  tagPaginate: null,
  isLoading: false
}
export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case TAG_GET_LIST_SUCCESS: {
      return {
        ...state,
        ...payload
      }
    }
    case TAG_CREATE_SUCCESS: {
      const {tag} = payload;
      const tagList = state.tagList.slice();
      tagList.push(tag);
      return {
        ...state,
        tagList
      }
    }
    case TAG_UPDATE_SUCCESS: {
      const {tag} = payload;
      const tagList = state.tagList.slice();
      const indexTag = tagList.findIndex(item => item.id === tag.id);
      if (indexTag > -1) {
        tagList[indexTag] = tag;
      }
      return {
        ...state,
        tagList
      }
    }
    case TAG_DELETE_SUCCESS: {
      const tagList = state.tagList;
      const tags = tagList.filter(item => item.id !== payload.tagId);
      return {
        ...state,
        tagList: tags
      }
    }

    default:
      return {
        ...state
      }
  }
}

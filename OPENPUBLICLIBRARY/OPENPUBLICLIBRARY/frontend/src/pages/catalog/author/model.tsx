import { Effect, Reducer } from 'umi';

import { AuthorsListItemDataType } from './data.d';
import { getAuthorsList } from './service';

export interface StateType {
  list: AuthorsListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getAuthorsList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'authorsList',

  state: {
    list: [],
  },

  effects: {
    *getAuthorsList(_, { call, put }) {
      const response = yield call(getAuthorsList);
      console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    /**
     *
     * @param state
     * @param action
     * @returns {{[p: string]: *}}
     */
    save(state: any, action:any) {
      return {
        ...state, 
        data: action.payload 
      };
    }

  },
};

export default Model;

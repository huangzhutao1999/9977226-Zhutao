import { Effect, Reducer } from 'umi';

import { BooksListItemDataType } from './data.d';
import { getBooksList } from './service';

export interface StateType {
  list: BooksListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getBooksList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'booksList',

  state: {
    list: [],
  },

  effects: {
    *getBooksList(_, { call, put }) {
      const response = yield call(getBooksList);
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

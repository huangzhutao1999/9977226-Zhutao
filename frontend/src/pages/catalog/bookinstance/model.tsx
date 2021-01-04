import { Effect, Reducer } from 'umi';

import { BookInstancesListItemDataType } from './data.d';
import { getBookInstancesList } from './service';

export interface StateType {
  list: BookInstancesListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getBookInstancesList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'bookInstancesList',

  state: {
    list: [],
  },

  effects: {
    *getBookInstancesList(_, { call, put }) {
      const response = yield call(getBookInstancesList);
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

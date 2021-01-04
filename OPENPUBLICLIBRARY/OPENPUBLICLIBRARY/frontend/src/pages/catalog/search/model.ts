import { Effect, Reducer } from 'umi';
import { SearchListItemDataType } from './data.d';
import { queryFakeList } from './service';

export interface StateType {
  list: SearchListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'catalogAndsearch',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(queryFakeList, payload);
      console.log(response);
      yield put({
        // type: 'queryList',
        type: 'save',
        // payload: Array.isArray(response) ? response : [],
        payload: response,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
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
    save(state: any, action: any) {
      return {
        ...state,
        list: action.payload
      };
    },
    queryList(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
      };

    },
    appendList(state:any, action: any) {
      return {
        ...state,
        list: (state as StateType).list.concat(action.payload),
      };
    },
  },
};

export default Model;

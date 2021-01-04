import { Effect, Reducer } from 'umi';

import { GenresListItemDataType } from './data.d';
import { getGenresList } from './service';

export interface StateType {
  list: GenresListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getGenresList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'genresList',

  state: {
    list: [],
  },

  effects: {
    *getGenresList(_, { call, put }) {
      const response = yield call(getGenresList);
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

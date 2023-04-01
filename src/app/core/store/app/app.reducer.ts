import { Action, ActionReducerMap } from '@ngrx/store';
import { checklistReducer } from '../../../features/checklists/store/checklist.reducer';
import * as AppActions from './app.actions';
import { AppState } from './app.state';
import { errorReducer } from '../error/error.reducer';
import { userReducer } from '../user/user.reducer';
import { ActionReducer } from '@ngrx/store/src/models';

export function clearStateMetaReducer(reducer: ActionReducer<AppState>): (state: AppState, action: Action) => AppState {
  return (state: AppState, action: Action) => {
    if (action.type === AppActions.CLEAR_STORE) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export const appReducer: ActionReducerMap<AppState> = {
  checklists: checklistReducer,
  error: errorReducer,
  user: userReducer
};

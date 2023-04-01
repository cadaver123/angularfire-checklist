import { THROW_ERROR, ThrowErrorAction } from './error.actions';
import { ErrorState } from './error.state';

export function errorReducer(state: { errorMsg: string } = { errorMsg: null }, action: ThrowErrorAction): ErrorState {
  switch (action.type) {
    case THROW_ERROR:
      return state = { ...state, errorMsg: action.payload.errorMsg };
    default:
      return state;
  }
}

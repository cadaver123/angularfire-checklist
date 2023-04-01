import { SET_USER_STATUS, SetUserStatusAction } from './user.actions';
import { UserState } from './user.state';
import { UserStatus } from '../../constants/user-status';

export function userReducer(state: UserState = { userStatus: UserStatus.LOGGED_OUT }, action: SetUserStatusAction): UserState {
  switch (action.type) {
    case SET_USER_STATUS:
      return state = { ...state, userStatus: action.payload.userStatus };
    default:
      return state;
  }
}

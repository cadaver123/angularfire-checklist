import { Action } from '@ngrx/store';
import { UserStatus } from '../../constants/user-status';

export const SET_USER_STATUS: string = '[User] Set user status';

export class SetUserStatusAction implements Action {
  public readonly type: string = SET_USER_STATUS;

  constructor(public payload: { userStatus: UserStatus }) {
  }
}

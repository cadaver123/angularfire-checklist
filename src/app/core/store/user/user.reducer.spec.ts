import { SetUserStatusAction } from './user.actions';
import { userReducer } from './user.reducer';
import { UserStatus } from '../../constants/user-status';

describe('userReducer', () => {
  it('should set default state', () => {
    expect(userReducer(undefined, {
      type: null
    } as SetUserStatusAction)).toEqual({ userStatus: UserStatus.LOGGED_OUT });
  });

  describe(`when dispatching a 'set user status' action`, () => {
    it('should change the user status', () => {
      expect(userReducer(undefined, new SetUserStatusAction({ userStatus: UserStatus.LOGGED_IN })))
        .toEqual({ userStatus: UserStatus.LOGGED_IN });
    });
  });
});

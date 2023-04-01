import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { UserState } from './user.state';
import { AppState } from '../app/app.state';
import { UserStatus } from '../../constants/user-status';

const userState: MemoizedSelector<AppState, UserState> = createFeatureSelector<UserState>('user');
const userStatus: MemoizedSelector<AppState, UserStatus> = createSelector(userState, ((state: UserState) => state.userStatus));

export const USER_SELECTORS: { userStatus: typeof userStatus} = { userStatus };

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ErrorState } from './error.state';
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { AppState } from '../app/app.state';

const errorState: MemoizedSelector<AppState, ErrorState> = createFeatureSelector<ErrorState>('error');
const errorMsg: MemoizedSelector<AppState, string> = createSelector(errorState, ((state: ErrorState) => state.errorMsg));

export const ERROR_SELECTORS: { errorMsg: typeof errorMsg} = { errorMsg };

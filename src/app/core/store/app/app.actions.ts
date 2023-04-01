import { Action } from '@ngrx/store';

export const CLEAR_STORE: string = '[APP] Clear store';

export class ClearStoreAction implements Action {
  public readonly type: string = CLEAR_STORE;
}


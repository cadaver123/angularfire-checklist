import { Action } from '@ngrx/store';

export const THROW_ERROR: string = '[APP] Throw error';

export class ThrowErrorAction implements Action {
  public readonly type: string = THROW_ERROR;

  constructor(public payload: { errorMsg: string }) {
  }
}

import { ErrorHandler, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app/app.state';
import { ThrowErrorAction } from '../../store/error/error.actions';

type Error = { rejection?: { message: string } };

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {

  constructor(private store: Store<AppState>) {
  }

  public handleError(error: Error):
    void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.store.dispatch(new ThrowErrorAction({ errorMsg: error.rejection?.message }));
  }
}

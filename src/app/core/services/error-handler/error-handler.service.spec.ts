import { StoreSimpleStub } from '../../../stubs/store-simple.stub';
import { AppState } from '../../store/app/app.state';
import { Store } from '@ngrx/store';
import { ErrorHandlerService } from './error-handler.service';
import { ThrowErrorAction } from '../../store/error/error.actions';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let dependencies: {
    store: StoreSimpleStub<AppState>;
  };

  beforeEach(() => {
    dependencies = {
      store: new StoreSimpleStub<AppState>()
    };

    service = new ErrorHandlerService(dependencies.store as Partial<Store<AppState>> as Store<AppState>);
  });

  describe('when error occurs', () => {
    beforeEach(() => {
      service.handleError({
        rejection: {
          message: 'an error'
        }
      });
    });

    it(`should dispatch a 'throw error' action`, () => {
      expect(dependencies.store.dispatch).toHaveBeenCalledWith(new ThrowErrorAction({ errorMsg: 'an error' }));
    });
  });

  afterAll(() => {
    service = null;
    dependencies = null;
  });
});

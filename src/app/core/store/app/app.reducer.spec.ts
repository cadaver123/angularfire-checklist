import { clearStateMetaReducer } from './app.reducer';
import { ClearStoreAction } from './app.actions';
import { AppState } from './app.state';

describe('clearStateMetaReducer', () => {
  let reducerSpy: jasmine.Spy;

  beforeEach(() => {
    reducerSpy = jasmine.createSpy('clearStateMetaReducer');
  });

  describe(`when action 'clear station' has been dispatched`, () => {
    beforeEach(() => {
      clearStateMetaReducer(reducerSpy)({
        checklists: {}
      } as Partial<AppState> as AppState, new ClearStoreAction());
    });

    it('should clear the state', () => {
      expect(reducerSpy).toHaveBeenCalledWith(undefined, new ClearStoreAction());
    });
  });

  describe(`when other action than 'clear station' has been dispatched`, () => {
    beforeEach(() => {
      clearStateMetaReducer(reducerSpy)({
        checklists: {}
      } as Partial<AppState> as AppState, { type: 'differentType' });
    });

    it('should clear the state', () => {
      expect(reducerSpy).toHaveBeenCalledWith({
        checklists: {}
      }, { type: 'differentType' });
    });
  });

  afterAll(() => {
    reducerSpy = null;
  });
});

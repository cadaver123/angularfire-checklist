import { errorReducer } from './error.reducer';
import { ThrowErrorAction } from './error.actions';

describe('errorReducer', () => {
  it('should set the default state', () => {
    expect(errorReducer(undefined, {
      type: null
    } as ThrowErrorAction)).toEqual({ errorMsg: null });
  });

  describe(`when dispatching an 'error thrown' action`, () => {
    it('should change the error message', () => {
      expect(errorReducer(undefined, new ThrowErrorAction({ errorMsg: 'errorMsg' })))
        .toEqual({ errorMsg: 'errorMsg' });
    });
  });
});

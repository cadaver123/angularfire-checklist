import { Stub } from './stub.type';
import { Store } from '@ngrx/store';

export class StoreSimpleStub<T> implements Partial<Stub<Store<T>>> {
  public dispatch: jasmine.Spy = jasmine.createSpy('StoreSimpleStub.dispatch');
  public select: jasmine.Spy = jasmine.createSpy('StoreSimpleStub.select');
}

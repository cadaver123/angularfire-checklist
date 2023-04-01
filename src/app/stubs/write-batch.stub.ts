import { Stub } from './stub.type';
import firebase from 'firebase/compat';
import WriteBatch = firebase.firestore.WriteBatch;

export class WriteBatchStub implements Partial<Stub<WriteBatch>> {
  public delete: jasmine.Spy = jasmine.createSpy('WriteBatchStub.delete');
  public commit: jasmine.Spy = jasmine.createSpy('WriteBatchStub.commit');
}

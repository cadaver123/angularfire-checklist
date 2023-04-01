import firebase from 'firebase/compat';
import { Stub } from './stub.type';

export class FirestoreStub implements Partial<Stub<firebase.firestore.Firestore>> {
  public batch: jasmine.Spy = jasmine.createSpy('FirestoreStub.batch');
}

import { Stub } from './stub.type';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore/collection/collection';

export class AngularFirestoreCollectionStub implements Partial<Stub<AngularFirestoreCollection>> {
  public add: jasmine.Spy = jasmine.createSpy('AngularFirestoreCollectionStub.add');
  public doc: jasmine.Spy = jasmine.createSpy('AngularFirestoreCollectionStub.doc');
  public get: jasmine.Spy = jasmine.createSpy('AngularFirestoreCollectionStub.get');
  public stateChanges: jasmine.Spy = jasmine.createSpy('AngularFirestoreCollectionStub.stateChanges');
}

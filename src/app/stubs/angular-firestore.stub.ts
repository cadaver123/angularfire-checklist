import { Stub } from './stub.type';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import Firestore = firebase.firestore.Firestore;

export class AngularFirestoreStub implements Partial<Stub<AngularFirestore>> {
  public firestore: Firestore;

  public collection: jasmine.Spy = jasmine.createSpy('AngularFirestoreStub.collection');
  public doc: jasmine.Spy = jasmine.createSpy('AngularFirestoreStub.doc');
  public get: jasmine.Spy = jasmine.createSpy('AngularFirestoreStub.get');
}

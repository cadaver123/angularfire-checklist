import { Stub } from './stub.type';
import { DocumentReference } from '@angular/fire/compat/firestore/interfaces';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

export class AngularFirestoreDocumentStub implements Partial<Stub<AngularFirestoreDocument>> {
  public ref: DocumentReference;

  public update: jasmine.Spy = jasmine.createSpy('AngularFirestoreDocumentStub.update');
}

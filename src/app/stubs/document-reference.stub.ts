import { DocumentReference } from '@angular/fire/compat/firestore';
import { Stub } from './stub.type';

export class DocumentReferenceStub implements Partial<Stub<DocumentReference>> {
  public id: string;

  public delete: jasmine.Spy = jasmine.createSpy('DocumentReferenceStub.delete');
}

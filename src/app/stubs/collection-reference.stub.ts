import { Stub } from './stub.type';
import { CollectionReference } from '@angular/fire/compat/firestore/interfaces';

export class ColectionReferenceStub implements Partial<Stub<CollectionReference>> {
  public where: jasmine.Spy = jasmine.createSpy('CollectionReferenceStub.where');
}

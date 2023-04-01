import { Stub } from '../../../stubs/stub.type';
import { FirestorePathHelperService } from './firestore-path-helper.service';

export class FirestorePathHelperServiceStub implements Stub<FirestorePathHelperService> {
  public getChecklistDocument: jasmine.Spy = jasmine.createSpy('FirestorePathHelperServiceStub.getChecklistDocument');
  public getChecklistsCollection: jasmine.Spy = jasmine.createSpy('FirestorePathHelperServiceStub.getChecklistsCollection');
  public getTasksCollection: jasmine.Spy = jasmine.createSpy('FirestorePathHelperServiceStub.getTasksCollection');
  public getTasksDocument: jasmine.Spy = jasmine.createSpy('FirestorePathHelperServiceStub.getTasksDocument');
}

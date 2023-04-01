import { FirestoreService } from './firestore.service';
import { Stub } from '../../../stubs/stub.type';

export class FirestoreServiceStub implements Stub<FirestoreService> {
  public createChecklist: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.createChecklist');
  public createTask: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.createTask');
  public removeTask: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.removeTask');
  public removeChecklist: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.removeChecklist');
  public updateChecklistColor: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.updateChecklistColor');
  public updateChecklistName: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.updateChecklistName');
  public updateChecklistPosition: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.updateChecklistPosition');
  public updateChecklistSize: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.updateChecklistSize');
  public updateTaskStatus: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.updateTaskStatus');
  public updateTaskMessage: jasmine.Spy = jasmine.createSpy('FirestoreServiceStub.updateTaskMessage');
}

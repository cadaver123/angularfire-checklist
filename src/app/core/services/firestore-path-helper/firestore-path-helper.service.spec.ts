import { FirestorePathHelperService } from './firestore-path-helper.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireAuthStub } from 'src/app/stubs/angular-fire-auth.stub';
import firebase from 'firebase/compat';

describe('FirestorePathHelperService', () => {
  let service: FirestorePathHelperService;
  let dependencies: {
    auth: AngularFireAuthStub;
  };

  beforeEach(() => {
    dependencies = {
      auth: new AngularFireAuthStub()
    };
    dependencies.auth.currentUser = Promise.resolve({ uid: 'currentUserId' } as Partial<firebase.User> as firebase.User);

    service = new FirestorePathHelperService(dependencies.auth as Partial<AngularFireAuth> as AngularFireAuth);
  });

  it('should return the checklist document path', async () => {
    expect(await service.getChecklistDocument('checklistId')).toEqual('currentUserId/checklists/checklists/checklistId');
  });

  it('should return the task document path', async () => {
    expect(await service.getTasksDocument('taskId')).toEqual('currentUserId/checklists/tasks/taskId');
  });

  it('should return the task collection path', async () => {
    expect(await service.getTasksCollection()).toEqual('currentUserId/checklists/tasks');
  });

  it('should return the checklist collist path', async () => {
    expect(await service.getChecklistsCollection()).toEqual('currentUserId/checklists/checklists');
  });

  afterAll(() => {
    service = null;
    dependencies = null;
  });
});

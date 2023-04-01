import { FirestoreSubscriptionsService } from './firestore-subscriptions.service';
import { AngularFirestoreStub } from '../../../stubs/angular-firestore.stub';
import { AuthServiceStub } from '../auth/auth.service.stub';
import { StoreSimpleStub } from '../../../stubs/store-simple.stub';
import { AppState } from '../../store/app/app.state';
import { FirestorePathHelperServiceStub } from '../firestore-path-helper/firestore-path-helper.service.stub';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { FirestorePathHelperService } from '../firestore-path-helper/firestore-path-helper.service';
import { AngularFirestoreCollectionStub } from '../../../stubs/angular-firestore-collection.stub';
import { TaskFirestoreModel } from '../../model/firestore/task-firestore.model';
import { Subject } from 'rxjs';
import { ChecklistFirestoreModel } from '../../model/firestore/checklist-firestore.model';
import { waitForAsync } from '@angular/core/testing';
import { constant } from 'lodash-es';
import { DocumentChange, DocumentChangeAction } from '@angular/fire/compat/firestore/interfaces';
import { UserStatus } from '../../constants/user-status';
import * as ChecklistActions from '../../../features/checklists/store/checklist.actions';
import { ChecklistModel } from '../../../features/checklists/model/checklist.model';
import { TaskModel } from '../../../features/checklists/model/task.model';

describe('FirestoreSubscriptionsService', () => {
  let service: FirestoreSubscriptionsService;
  let dependencies: {
    db: AngularFirestoreStub;
    auth: AuthServiceStub;
    store: StoreSimpleStub<AppState>;
    pathHelper: FirestorePathHelperServiceStub;
  };
  let tasksCollection: AngularFirestoreCollectionStub;
  let checklistsCollection: AngularFirestoreCollectionStub;
  let taskAddSubject: Subject<Array<DocumentChangeAction<TaskFirestoreModel>>>;
  let taskRemoveSubject: Subject<Array<DocumentChangeAction<TaskFirestoreModel>>>;
  let checklistAddSubject: Subject<Array<DocumentChangeAction<ChecklistFirestoreModel>>>;
  let checklistRemoveSubject: Subject<Array<DocumentChangeAction<ChecklistFirestoreModel>>>;
  let userStatusSubject: Subject<UserStatus>;

  beforeEach(() => {
    dependencies = {
      db: new AngularFirestoreStub(),
      auth: new AuthServiceStub(),
      store: new StoreSimpleStub<AppState>(),
      pathHelper: new FirestorePathHelperServiceStub()
    };
    tasksCollection = new AngularFirestoreCollectionStub();
    checklistsCollection = new AngularFirestoreCollectionStub();
    userStatusSubject = new Subject<UserStatus>();

    dependencies.pathHelper.getTasksCollection.and.returnValues('tasksCollection');
    dependencies.pathHelper.getChecklistsCollection.and.returnValue('checklistsCollection');

    dependencies.store.select.and.returnValue(userStatusSubject);

    taskAddSubject = new Subject<Array<DocumentChangeAction<TaskFirestoreModel>>>();
    taskRemoveSubject = new Subject<Array<DocumentChangeAction<TaskFirestoreModel>>>();
    checklistAddSubject = new Subject<Array<DocumentChangeAction<ChecklistFirestoreModel>>>();
    checklistRemoveSubject = new Subject<Array<DocumentChangeAction<ChecklistFirestoreModel>>>();

    dependencies.db.collection.and.callFake((path: string) => {
      switch (path) {
        case 'tasksCollection':
          return tasksCollection;
        case'checklistsCollection':
          return checklistsCollection;
        default:
          throw new Error(`Shouldn't be here`);
      }
    });

    tasksCollection.stateChanges.and.callFake((eventType: Array<string>) => {
      switch (eventType[0]) {
        case 'added':
          return taskAddSubject;
        case 'removed':
          return taskRemoveSubject;
        default:
          throw new Error(`Shouldn't be here`);
      }
    });

    checklistsCollection.stateChanges.and.callFake((eventType: Array<string>) => {
      switch (eventType[0]) {
        case 'added':
          return checklistAddSubject;
        case 'removed':
          return checklistRemoveSubject;
        default:
          throw new Error(`Shouldn't be here`);
      }
    });

    service = new FirestoreSubscriptionsService(
      dependencies.db as Partial<AngularFirestore> as AngularFirestore,
      dependencies.auth as Partial<AuthService> as AuthService,
      dependencies.store as Partial<Store<AppState>> as Store<AppState>,
      dependencies.pathHelper as Partial<FirestorePathHelperService> as FirestorePathHelperService
    );
  });

  describe('when initialized', () => {
    beforeEach(() => {
      service.init();
    });

    describe('when user has logged in', () => {
      beforeEach(waitForAsync(() => {
        userStatusSubject.next(UserStatus.LOGGED_IN);
      }));

      it('should subscribe to database changes', () => {
        expect(taskAddSubject.observers.length).not.toBe(0);
        expect(taskRemoveSubject.observers.length).not.toBe(0);
        expect(checklistAddSubject.observers.length).not.toBe(0);
        expect(checklistRemoveSubject.observers.length).not.toBe(0);
      });

      describe('when checklist has been added', () => {
        beforeEach(() => {
          checklistAddSubject.next([{
            payload: {
              doc: {
                ref: {
                  id: 'checklistId'
                } as DocumentReference,
                data: constant<ChecklistFirestoreModel>({
                  name: 'checklistName',
                  x: 2,
                  y: 3,
                  color: 4,
                  width: 5,
                  height: 6,
                  created: new Date(10)
                })
              }
            } as Partial<DocumentChange<ChecklistFirestoreModel>> as DocumentChange<ChecklistFirestoreModel>
          } as Partial<DocumentChangeAction<ChecklistFirestoreModel>> as DocumentChangeAction<ChecklistFirestoreModel>
          ]);
        });

        it(`should dispatch 'checklist added' action`, () => {
          expect(dependencies.store.dispatch)
            .toHaveBeenCalledWith(new ChecklistActions.AddChecklist({ checklist: new ChecklistModel('checklistId', 'checklistName', 2, 3, 4, 6, 5) }));
        });
      });

      describe('when checklist without color set', () => {
        beforeEach(() => {
          checklistAddSubject.next([{
            payload: {
              doc: {
                ref: {
                  id: 'checklistId'
                } as DocumentReference,
                data: constant<ChecklistFirestoreModel>({
                  name: 'checklistName',
                  x: 2,
                  y: 3,
                  color: undefined,
                  width: 5,
                  height: 6,
                  created: new Date(10)
                })
              }
            } as Partial<DocumentChange<ChecklistFirestoreModel>> as DocumentChange<ChecklistFirestoreModel>
          } as Partial<DocumentChangeAction<ChecklistFirestoreModel>> as DocumentChangeAction<ChecklistFirestoreModel>
          ]);
        });

        it(`should dispatch 'checklist added' action with default color`, () => {
          expect(dependencies.store.dispatch)
            .toHaveBeenCalledWith(new ChecklistActions.AddChecklist({ checklist: new ChecklistModel('checklistId', 'checklistName', 2, 3, 0, 6, 5) }));
        });
      });

      describe('when checklist has been removed', () => {
        beforeEach(() => {
          checklistRemoveSubject.next([{
            payload: {
              doc: {
                ref: {
                  id: 'checklistId'
                } as DocumentReference
              }
            } as Partial<DocumentChange<ChecklistFirestoreModel>> as DocumentChange<ChecklistFirestoreModel>
          } as Partial<DocumentChangeAction<ChecklistFirestoreModel>> as DocumentChangeAction<ChecklistFirestoreModel>
          ]);
        });

        it(`should dispatch 'checklist removed' action`, () => {
          expect(dependencies.store.dispatch)
            .toHaveBeenCalledWith(new ChecklistActions.RemoveChecklist({ checklistId: 'checklistId' }));
        });
      });

      describe('when task has been added', () => {
        beforeEach(() => {
          taskAddSubject.next([{
              payload: {
                doc: {
                  ref: {
                    id: 'taskId'
                  } as DocumentReference,
                  data: constant<TaskFirestoreModel>({
                    checklistRef: {
                      id: 'checklistId'
                    } as DocumentReference<ChecklistFirestoreModel>,
                    checked: true,
                    message: 'task message',
                    created: new Date(10)
                  })
                }
              } as Partial<DocumentChange<TaskFirestoreModel>> as DocumentChange<TaskFirestoreModel>
            } as Partial<DocumentChangeAction<TaskFirestoreModel>> as DocumentChangeAction<TaskFirestoreModel>]
          );
        });

        it(`should dispatch 'task added' action`, () => {
          expect(dependencies.store.dispatch)
            .toHaveBeenCalledWith(new ChecklistActions.AddTask({
              checklistId: 'checklistId',
              task: new TaskModel('taskId', true, 'task message', new Date(10)),
            }));
        });
      });

      describe('when task has been removed', () => {
        beforeEach(() => {
          taskRemoveSubject.next([{
              payload: {
                doc: {
                  ref: {
                    id: 'taskId'
                  } as DocumentReference,
                  data: constant<Partial<TaskFirestoreModel>>({
                    checklistRef: {
                      id: 'checklistId'
                    } as DocumentReference<ChecklistFirestoreModel>
                  })
                }
              } as Partial<DocumentChange<TaskFirestoreModel>> as DocumentChange<TaskFirestoreModel>
            } as Partial<DocumentChangeAction<TaskFirestoreModel>> as DocumentChangeAction<TaskFirestoreModel>]
          );
        });

        it(`should dispatch 'task removed' action`, () => {
          expect(dependencies.store.dispatch)
            .toHaveBeenCalledWith(new ChecklistActions.RemoveTask({
              checklistId: 'checklistId',
              taskId: 'taskId',
            }));
        });
      });

      describe('when us has logged out', () => {
        beforeEach(waitForAsync(() => {
          userStatusSubject.next(UserStatus.LOGGED_OUT);
        }));

        it('should unsubscribe to database changes', () => {
          expect(taskAddSubject.observers.length).toBe(0);
          expect(taskRemoveSubject.observers.length).toBe(0);
          expect(checklistAddSubject.observers.length).toBe(0);
          expect(checklistRemoveSubject.observers.length).toBe(0);
        });
      });
    });
  });

  afterAll(() => {
    service = null;
    dependencies = null;
    tasksCollection = null;
    checklistsCollection = null;
    taskAddSubject = null;
    taskRemoveSubject = null;
    checklistAddSubject = null;
    checklistRemoveSubject = null;
    userStatusSubject = null;
  });
});

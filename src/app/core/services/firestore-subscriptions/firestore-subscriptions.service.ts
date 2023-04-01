import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { TaskModel } from '../../../features/checklists/model/task.model';
import { ChecklistModel } from '../../../features/checklists/model/checklist.model';
import * as ChecklistActions from '../../../features/checklists/store/checklist.actions';
import { TaskFirestoreModel } from '../../model/firestore/task-firestore.model';
import { ChecklistFirestoreModel } from '../../model/firestore/checklist-firestore.model';
import { FirestorePathHelperService } from '../firestore-path-helper/firestore-path-helper.service';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../../store/app/app.state';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore/collection/collection';
import { DocumentChangeAction, DocumentChangeType } from '@angular/fire/compat/firestore/interfaces';
import { filter, takeUntil } from 'rxjs/operators';
import { USER_SELECTORS } from '../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { UserStatus } from '../../constants/user-status';

@Injectable({ providedIn: 'root' })
export class FirestoreSubscriptionsService {
  private userLoggedOut$: Observable<UserStatus>;
  private userLoggedIn$: Observable<UserStatus>;

  constructor(private db: AngularFirestore,
              private auth: AuthService,
              private store: Store<AppState>,
              private pathHelper: FirestorePathHelperService) {
  }

  public init(): void {
    this.userLoggedOut$ = this.store.select<UserStatus>(USER_SELECTORS.userStatus)
      .pipe(filter((userStatus: UserStatus) => userStatus === UserStatus.LOGGED_OUT));
    this.userLoggedIn$ = this.store.select(USER_SELECTORS.userStatus)
      .pipe(filter((userStatus: UserStatus) => userStatus === UserStatus.LOGGED_IN));

    this.subscribeToFireBaseWhenUserLogged();
  }

  private subscribeToFireBaseWhenUserLogged(): void {
    this.userLoggedIn$
      .subscribe(() => {
        this.subscribeToChecklistsChanges();
        this.subscribeToTasksChanges();
      });
  }

  private async subscribeToChecklistsChanges(): Promise<void> {
    const checklistsCollection: AngularFirestoreCollection<ChecklistFirestoreModel>
      = this.db.collection<ChecklistFirestoreModel>(await this.pathHelper.getChecklistsCollection());

    this.subscribeToEvent<ChecklistFirestoreModel>(checklistsCollection,
      ['added'],
      (document: DocumentChangeAction<ChecklistFirestoreModel>) =>
        this.dispatchAddChecklist(document.payload.doc.ref.id, document.payload.doc.data()));

    this.subscribeToEvent<ChecklistFirestoreModel>(checklistsCollection,
      ['removed'],
      (document: DocumentChangeAction<ChecklistFirestoreModel>) =>
        this.dispatchRemoveChecklist(document.payload.doc.ref.id));
  }

  private async subscribeToTasksChanges(): Promise<void> {
    const tasksCollection: AngularFirestoreCollection<TaskFirestoreModel>
      = this.db.collection<TaskFirestoreModel>(await this.pathHelper.getTasksCollection());

    this.subscribeToEvent<TaskFirestoreModel>(tasksCollection,
      ['added'],
      (document: DocumentChangeAction<TaskFirestoreModel>) =>
        this.dispatchAddTask(document.payload.doc.ref.id, document.payload.doc.data()));

    this.subscribeToEvent<TaskFirestoreModel>(tasksCollection,
      ['removed'],
      (document: DocumentChangeAction<TaskFirestoreModel>) =>
        this.dispatchRemoveTasks(document.payload.doc.ref.id, document.payload.doc.data()));
  }

  private subscribeToEvent<T>(collection: AngularFirestoreCollection<T>,
                              eventTypes: Array<DocumentChangeType>,
                              onEvent: (document: DocumentChangeAction<T>) => void): void {
    collection.stateChanges(eventTypes)
      .pipe(takeUntil(this.userLoggedOut$))
      .subscribe((documents: Array<DocumentChangeAction<T>>) => {
          for (const document of documents) {
            onEvent(document);
          }
        }
      );
  }

  private dispatchAddChecklist(id: string, data: ChecklistFirestoreModel): void {
    this.store.dispatch(
      new ChecklistActions.AddChecklist({
        checklist: new ChecklistModel(id, data.name, data.x, data.y, data.color ?? 0, data.height, data.width)
      })
    );
  }

  private dispatchRemoveChecklist(checklistId: string): void {
    this.store.dispatch(new ChecklistActions.RemoveChecklist({ checklistId }));
  }

  private dispatchRemoveTasks(id: string, data: TaskFirestoreModel): void {
    this.store.dispatch(new ChecklistActions.RemoveTask({
        checklistId: data.checklistRef.id,
        taskId: id,
      })
    );
  }

  private dispatchAddTask(taskId: string, data: TaskFirestoreModel): void {
    this.store.dispatch(
      new ChecklistActions.AddTask({
        checklistId: data.checklistRef.id,
        task: new TaskModel(taskId, data.checked, data.message, data.created),
      })
    );
  }
}

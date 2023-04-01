import { Injectable } from '@angular/core';
import { ChecklistFirestoreModel } from '../../model/firestore/checklist-firestore.model';
import { AngularFirestore, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { FirestorePathHelperService } from '../firestore-path-helper/firestore-path-helper.service';
import { TaskFirestoreModel } from '../../model/firestore/task-firestore.model';
import { Point } from '../../model/Point';
import firebase from 'firebase/compat';
import { CollectionReference, QueryDocumentSnapshot } from '@angular/fire/compat/firestore/interfaces';
import WriteBatch = firebase.firestore.WriteBatch;

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private db: AngularFirestore,
              private pathHelper: FirestorePathHelperService) {
  }

  public async createChecklist(position: Point): Promise<void> {
    await this.db
      .collection<Partial<ChecklistFirestoreModel>>(await this.pathHelper.getChecklistsCollection())
      .add({ name: '', x: position.x, y: position.y, created: new Date() });
  }

  public async removeChecklist(id: string): Promise<void> {
    const batch: WriteBatch = this.db.firestore.batch();
    const checklistRef: DocumentReference<ChecklistFirestoreModel> = this.db
      .collection<ChecklistFirestoreModel>(await this.pathHelper.getChecklistsCollection())
      .doc(id).ref;

    batch.delete(checklistRef);

    const tasks: QuerySnapshot<TaskFirestoreModel> = await this.db
      .collection<TaskFirestoreModel>(await this.pathHelper.getTasksCollection(),
        (ref: CollectionReference<TaskFirestoreModel>) =>
          ref.where('checklistRef', '==', checklistRef)
      )
      .get()
      .toPromise();

    tasks.docs.forEach((doc: QueryDocumentSnapshot<TaskFirestoreModel>) => batch.delete(doc.ref));

    await batch.commit();
  }

  public async updateChecklistName(checklistId: string, name: string): Promise<void> {
    await this.db
      .doc<Partial<ChecklistFirestoreModel>>(await this.pathHelper.getChecklistDocument(checklistId))
      .update({ name });
  }

  public async createTask(checklistId: string): Promise<void> {
    await this.db
      .collection<Partial<TaskFirestoreModel>>(await this.pathHelper.getTasksCollection())
      .add({
        checklistRef: this.db.doc<ChecklistFirestoreModel>(await this.pathHelper.getChecklistDocument(checklistId)).ref,
        created: new Date()
      });
  }

  public async removeTask(taskId: string): Promise<void> {
    await this.db
      .doc<Partial<TaskFirestoreModel>>(await this.pathHelper.getTasksDocument(taskId))
      .ref.delete();
  }

  public async updateChecklistPosition(checklistId: string, newPosition: Point): Promise<void> {
    await this.db
      .doc<Partial<ChecklistFirestoreModel>>(await this.pathHelper.getChecklistDocument(checklistId))
      .update({ x: newPosition.x, y: newPosition.y });
  }

  public async updateChecklistColor(checklistId: string, color: number): Promise<void> {
    await this.db
      .doc<Partial<ChecklistFirestoreModel>>(await this.pathHelper.getChecklistDocument(checklistId))
      .update({ color });
  }

  public async updateChecklistSize(checklistId: string, width: number, height: number): Promise<void> {
    await this.db
      .doc<Partial<ChecklistFirestoreModel>>(await this.pathHelper.getChecklistDocument(checklistId))
      .update({ width, height });
  }

  public async updateTaskMessage(taskId: string, message: string): Promise<void> {
    await this.db.doc<Partial<TaskFirestoreModel>>(await this.pathHelper.getTasksDocument(taskId)).update({ message });
  }

  public async updateTaskStatus(taskId: string, checked: boolean): Promise<void> {
    await this.db.doc<Partial<TaskFirestoreModel>>(await this.pathHelper.getTasksDocument(taskId)).update({ checked });
  }
}

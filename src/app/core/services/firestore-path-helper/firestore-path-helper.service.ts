import { Injectable } from '@angular/core';
import { CHECKLISTS_PATH, TASKS_PATH } from '../../constants/firestore-paths';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class FirestorePathHelperService {

  constructor(private auth: AngularFireAuth) {
  }

  public async getChecklistDocument(checklistId: string): Promise<string> {
    return `${ await this.getChecklistsCollection() }/${ checklistId }`;
  }

  public async getTasksDocument(taskId: string): Promise<string> {
    return `${ await this.getTasksCollection() }/${ taskId }`;
  }

  public async getTasksCollection(): Promise<string> {
    return `${ await this.getCurrentUserUid() }/${ TASKS_PATH }`;
  }

  public async getChecklistsCollection(): Promise<string> {
    return `${ await this.getCurrentUserUid() }/${ CHECKLISTS_PATH }`;
  }

  private async getCurrentUserUid(): Promise<string> {
    return (await this.auth.currentUser).uid;
  }
}

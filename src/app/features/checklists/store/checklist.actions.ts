import { Action } from '@ngrx/store';
import { TaskModel } from 'src/app/features/checklists/model/task.model';
import { ChecklistModel } from 'src/app/features/checklists/model/checklist.model';

export const ADD_TASK: string = '[Checklist] Add checklists task';
export const REMOVE_TASK: string = '[Checklist] Remove checklists task';
export const ADD_CHECKLIST: string = '[Checklist] Add checklists';
export const REMOVE_CHECKLIST: string = '[Checklist] Remove checklists';

export class AddTask implements Action {
  public readonly type: string = ADD_TASK;

  constructor(public payload: { checklistId: string; task: TaskModel }) {
  }
}

export class RemoveTask implements Action {
  public readonly type: string = REMOVE_TASK;

  constructor(public payload: { checklistId: string; taskId: string }) {
  }
}

export class AddChecklist implements Action {
  public readonly type: string = ADD_CHECKLIST;

  constructor(public payload: { checklist: ChecklistModel }) {
  }
}

export class RemoveChecklist implements Action {
  public readonly type: string = REMOVE_CHECKLIST;

  constructor(public payload: { checklistId: string }) {
  }
}

export type ChecklistActions = AddTask | RemoveTask | AddChecklist | RemoveChecklist;

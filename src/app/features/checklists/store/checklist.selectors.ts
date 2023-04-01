import { MemoizedSelector } from '@ngrx/store/src/selector';
import { AppState } from '../../../core/store/app/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChecklistState } from './checklist.state';
import { ChecklistModel } from '../model/checklist.model';
import { TaskModel } from '../model/task.model';

const checklistState: MemoizedSelector<AppState, ChecklistState> = createFeatureSelector<ChecklistState>('checklists');
const checklists: MemoizedSelector<AppState, Array<ChecklistModel>> = createSelector(checklistState, ((state: ChecklistState) => state.checklists));
const tasks: MemoizedSelector<AppState, Map<string, Array<TaskModel>>> = createSelector(checklistState, ((state: ChecklistState) => state.tasks));

export const CHECKLIST_SELECTORS: { checklists: typeof checklists, tasks: typeof tasks } = { checklists, tasks };

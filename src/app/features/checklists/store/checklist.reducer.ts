import { TaskModel } from 'src/app/features/checklists/model/task.model';
import * as ChecklistActions from './checklist.actions';
import { AddTask, RemoveChecklist, RemoveTask } from './checklist.actions';
import { ChecklistState } from './checklist.state';
import { ChecklistModel } from '../model/checklist.model';

const initialState: ChecklistState = {
  tasks: new Map<string, Array<TaskModel>>(),
  checklists: [],
};

export function checklistReducer(
  state: ChecklistState = initialState,
  action: ChecklistActions.ChecklistActions
): ChecklistState {
  switch (action.type) {
    case ChecklistActions.ADD_TASK: {
      const allTasks: Map<string, Array<TaskModel>> = new Map<string, Array<TaskModel>>(state.tasks);
      const checklistTasks: Array<TaskModel> = state.tasks.get((action as AddTask).payload.checklistId) ?? [];

      allTasks.set((action as AddTask).payload.checklistId, [
        ...checklistTasks,
        (action as AddTask).payload.task,
      ]);

      return {
        ...state,
        tasks: allTasks
      };
    }
    case ChecklistActions.ADD_CHECKLIST: {
      return {
        ...state,
        checklists: [...state.checklists, (action as ChecklistActions.AddChecklist).payload.checklist],
      };
    }
    case ChecklistActions.REMOVE_CHECKLIST: {
      const tasks: Map<string, Array<TaskModel>> = new Map<string, Array<TaskModel>>(state.tasks);
      const checklists: Array<ChecklistModel> = state.checklists.filter(
        (list: ChecklistModel) => list.id !== (action as RemoveChecklist).payload.checklistId);

      tasks.delete((action as RemoveChecklist).payload.checklistId);

      return {
        ...state,
        tasks,
        checklists
      };
    }
    case ChecklistActions.REMOVE_TASK: {
      const allTasks: Map<string, Array<TaskModel>> = new Map<string, Array<TaskModel>>(state.tasks);
      const checklistTasks: Array<TaskModel> = state.tasks.get((action as RemoveTask).payload.checklistId);

      if (!checklistTasks) {   // when checklist has already been removed
        return state;
      }

      allTasks.set((action as RemoveTask).payload.checklistId,
        checklistTasks.filter((el: TaskModel): boolean => el.id !== (action as RemoveTask).payload.taskId));

      return {
        ...state,
        tasks: allTasks
      };
    }
    default:
      return state;
  }
}

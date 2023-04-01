import { TaskModel } from '../model/task.model';
import { ChecklistModel } from '../model/checklist.model';

export interface ChecklistState {
  tasks: Map<string, Array<TaskModel>>;
  checklists: Array<ChecklistModel>;
}

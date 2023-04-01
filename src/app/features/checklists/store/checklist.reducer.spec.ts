import { ChecklistState } from './checklist.state';
import { TaskModel } from '../model/task.model';
import { checklistReducer } from './checklist.reducer';
import * as ChecklistActions from '../../../features/checklists/store/checklist.actions';
import { ChecklistModel } from '../model/checklist.model';

describe('checklistReducer', () => {
  let resultState: ChecklistState;
  let emptyState: ChecklistState;

  beforeEach(() => {
    emptyState = {
      tasks: new Map<string, Array<TaskModel>>(),
      checklists: [],
    };
  });

  describe('when using initializing state', () => {
    beforeEach(() => {
      resultState = checklistReducer(undefined, {} as ChecklistActions.ChecklistActions);
    });

    it('should return empty state', () => {
      expect(resultState).toEqual(emptyState);
    });
  });

  describe('when adding a task to checklist with tasks', () => {
    beforeEach(() => {
      resultState = checklistReducer(undefined, new ChecklistActions.AddTask({
        checklistId: 'someChecklistId',
        task: {
          id: 'newTask'
        } as Partial<TaskModel> as TaskModel
      }));
    });

    it('should use default state', () => {
      const expectedTasks: Map<string, Array<TaskModel>> = new Map();
      expectedTasks.set('someChecklistId', [{
        id: 'newTask'
      } as Partial<TaskModel> as TaskModel]);

      expect(resultState).toEqual({
        checklists: [],
        tasks: expectedTasks
      } as Partial<ChecklistState> as ChecklistState);
    });
  });

  describe('when adding a task to existing checklist', () => {
    beforeEach(() => {
      const state: ChecklistState = { checklists: [], tasks: new Map<string, Array<TaskModel>>() };

      state.tasks.set('checklist', [{ id: 'task' } as Partial<TaskModel> as TaskModel]);
      resultState = checklistReducer(state, new ChecklistActions.AddTask({
        checklistId: 'checklist',
        task: {
          id: 'newTask'
        } as Partial<TaskModel> as TaskModel
      }));
    });

    it('should add task', () => {
      const expectedTasks: Map<string, Array<TaskModel>> = new Map();
      expectedTasks.set('checklist', [{
        id: 'task'
      } as Partial<TaskModel> as TaskModel, {
        id: 'newTask'
      } as Partial<TaskModel> as TaskModel]);

      expect(resultState).toEqual({
        checklists: [],
        tasks: expectedTasks
      });
    });
  });

  describe('when adding a checklist', () => {
    beforeEach(() => {
      resultState = checklistReducer(emptyState, new ChecklistActions.AddChecklist({
        checklist: {
          id: 'checklist'
        } as Partial<ChecklistModel> as ChecklistModel
      }));
    });

    it('should add checklist', () => {
      expect(resultState).toEqual({
        checklists: [{
          id: 'checklist'
        } as Partial<ChecklistModel> as ChecklistModel],
        tasks: new Map()
      });
    });
  });

  describe('when removing a checklist', () => {
    beforeEach(() => {
      resultState = checklistReducer({
          checklists: [{ id: 'checklist' } as Partial<ChecklistModel> as ChecklistModel],
          tasks: new Map<string, Array<TaskModel>>()
        },
        new ChecklistActions.RemoveChecklist({ checklistId: 'checklist' }));
    });

    it('should remove checklist', () => {
      expect(resultState).toEqual(emptyState);
    });
  });

  describe('when removing a task', () => {
    let state: ChecklistState;

    beforeEach(() => {
      state = {
        tasks: new Map<string, Array<TaskModel>>(),
        checklists: []
      };

      state.tasks.set('checklist', [{ id: 'task' } as Partial<TaskModel> as TaskModel]);
    });

    describe('when checklist associated with task has been already deleted', () => {
      beforeEach(() => {
        resultState = checklistReducer(state,
          new ChecklistActions.RemoveTask({ checklistId: 'notExistingChecklistId', taskId: 'task' }));
      });

      it('should not change the state', () => {
        expect(resultState).toBe(state);
      });
    });

    describe('when checklist associated exists', () => {
      beforeEach(() => {
        resultState = checklistReducer(state,
          new ChecklistActions.RemoveTask({ checklistId: 'checklist', taskId: 'task' }));
      });

      it('should remove task', () => {
        const expectedTasks: Map<string, Array<TaskModel>> = new Map();
        expectedTasks.set('checklist', []);

        expect(resultState).toEqual({
          checklists: [],
          tasks: expectedTasks
        });
      });

      afterAll(() => {
        state = null;
      });
    });
  });

  afterAll(() => {
    resultState = null;
    emptyState = null;
  });
});

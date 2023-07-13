import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ChecklistComponent } from './checklist.component';
import { FirestoreServiceStub } from '../../../../core/services/firestore/firestore.service.stub';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CHECKLIST_SELECTORS } from '../../store/checklist.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '../../../../core/store/app/app.state';
import { TaskModel } from '../../model/task.model';
import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { DebugElement } from '@angular/core';
import { ChecklistTaskComponentStub } from '../checklist-task/checklist-task.component.stub';
import { By } from '@angular/platform-browser';
import { ChecklistHeaderComponentStub } from '../checklist-header/checklist-header.component.stub';
import { ResizableDirectiveStub } from '../../../../core/directives/resizable/resizable.directive.stub';
import { ChecklistModel } from '../../model/checklist.model';
import { ResizeEvent } from '../../../../core/directives/resizable/interfaces/resize-event.interface';
import { Subscription } from 'rxjs';
import createSpy = jasmine.createSpy;

describe('ChecklistComponent', () => {
  let fixture: ComponentFixture<ChecklistComponent>;
  let dependencies: {
    firestore: FirestoreServiceStub;
  };
  let store: MockStore<AppState>;
  let tasksSelector: MemoizedSelector<AppState, Map<string, Array<TaskModel>>>;

  function getTasks(): Array<DebugElement> {
    return fixture.debugElement.queryAll(By.directive(ChecklistTaskComponentStub));
  }

  function getContainer(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklist-container'));
  }

  function getColorHandle(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklist-colorHandle'));
  }

  function getAddTaskButton(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklist-addTaskButton'));
  }

  function getHeader(): DebugElement {
    return fixture.debugElement.query(By.directive(ChecklistHeaderComponentStub));
  }

  function getComponent(): DebugElement {
    return fixture.debugElement;
  }

  function getResizableDirective(): ResizableDirectiveStub {
    return fixture.debugElement.query(By.directive(ResizableDirectiveStub)).injector.get(ResizableDirectiveStub);
  }

  function getCloseButton(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklist-deleteButton'));
  }

  beforeEach(async () => {
    dependencies = {
      firestore: new FirestoreServiceStub()
    };

    await TestBed.configureTestingModule({
      declarations: [
        ChecklistComponent,
        ChecklistTaskComponentStub,
        ChecklistHeaderComponentStub,
        ResizableDirectiveStub
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: CHECKLIST_SELECTORS.tasks, value: null }]
        }),
        { provide: FirestoreService, useValue: dependencies.firestore }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore) as MockStore<AppState>;
    fixture = TestBed.createComponent(ChecklistComponent);
    tasksSelector = store.overrideSelector(CHECKLIST_SELECTORS.tasks, new Map()) as MemoizedSelector<AppState, Map<string, Array<TaskModel>>>;
  });

  describe('when new tasks has been received', () => {
    beforeEach(waitForAsync(() => {
      const tasks: Map<string, Array<TaskModel>> = new Map();

      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
      } as Partial<ChecklistModel> as ChecklistModel;

      tasks.set('checklistId', [
        new TaskModel('task2id', false, 'message two', new Date(11)),
        new TaskModel('task1id', true, 'message one', new Date(10)),
        new TaskModel('task3id', true, 'message three', new Date(12))
      ]);
      tasks.set('checklistIdWrong', [
        new TaskModel('x', false, 'message', new Date(10)),
      ]);
      tasksSelector.setResult(tasks);

      fixture.detectChanges();
    }));

    it('should show the tasks in right other', () => {
      expect((getTasks()[0].componentInstance as ChecklistTaskComponentStub).appChecklistTaskChecked).toEqual(true);
      expect((getTasks()[1].componentInstance as ChecklistTaskComponentStub).appChecklistTaskChecked).toEqual(false);
      expect((getTasks()[2].componentInstance as ChecklistTaskComponentStub).appChecklistTaskChecked).toEqual(true);
      expect((getTasks()[0].componentInstance as ChecklistTaskComponentStub).appChecklistTaskId).toEqual('task1id');
      expect((getTasks()[1].componentInstance as ChecklistTaskComponentStub).appChecklistTaskId).toEqual('task2id');
      expect((getTasks()[2].componentInstance as ChecklistTaskComponentStub).appChecklistTaskId).toEqual('task3id');
      expect((getTasks()[0].componentInstance as ChecklistTaskComponentStub).appChecklistTaskMessage).toEqual('message one');
      expect((getTasks()[1].componentInstance as ChecklistTaskComponentStub).appChecklistTaskMessage).toEqual('message two');
      expect((getTasks()[2].componentInstance as ChecklistTaskComponentStub).appChecklistTaskMessage).toEqual('message three');
    });
  });

  describe('when height and width is set', () => {
    beforeEach(() => {
      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
        width: 25,
        height: 10
      } as Partial<ChecklistModel> as ChecklistModel;

      fixture.detectChanges();
    });

    it('should set size of the checklist container', () => {
      expect((getContainer().nativeElement as HTMLElement).style.width).toBe('25px');
      expect((getContainer().nativeElement as HTMLElement).style.height).toBe('10px');
    });
  });

  describe('when height is not set and width is set', () => {
    beforeEach(() => {
      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
        width: 25,
      } as Partial<ChecklistModel> as ChecklistModel;

      fixture.detectChanges();
    });

    it('should not set size of the checklist container', () => {
      expect((getContainer().nativeElement as HTMLElement).style.width).toBe('');
      expect((getContainer().nativeElement as HTMLElement).style.height).toBe('');
    });
  });

  describe('when height is not set and width is not set', () => {
    beforeEach(() => {
      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
      } as Partial<ChecklistModel> as ChecklistModel;

      fixture.detectChanges();
    });

    it('should not set size of the checklist container', () => {
      expect((getContainer().nativeElement as HTMLElement).style.width).toBe('');
      expect((getContainer().nativeElement as HTMLElement).style.height).toBe('');
    });
  });

  describe('when color is set', () => {
    beforeEach(() => {
      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
        color: 2
      } as Partial<ChecklistModel> as ChecklistModel;

      fixture.detectChanges();
    });

    it('should set color on component', () => {
      expect(getComponent().nativeElement).toHaveClass('isColor2');
    });

    describe('when clicked on change checklist color', () => {
      beforeEach(() => {
        (getColorHandle().nativeElement as HTMLElement).click();

        fixture.detectChanges();
      });

      it('should set next color on the component', () => {
        expect(getComponent().nativeElement).toHaveClass('isColor3');
      });

      it('should update color in database', () => {
        expect(dependencies.firestore.updateChecklistColor).toHaveBeenCalledWith('checklistId', 3);
      });
    });
  });

  describe('when a checklist name is set', () => {
    beforeEach(() => {
      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
        name: 'checklist name'
      } as Partial<ChecklistModel> as ChecklistModel;

      fixture.detectChanges();
    });

    it('should set checklist name on the header', () => {
      expect((getHeader().componentInstance as ChecklistHeaderComponentStub).appChecklistHeaderCardName).toEqual('checklist name');
    });

    describe('when changing checklist name', () => {
      beforeEach(waitForAsync(() => {
        (getHeader().componentInstance as ChecklistHeaderComponentStub).appChecklistHeaderOnNameChanged.next('new name');
      }));

      it('should update checklist name', () => {
        expect(dependencies.firestore.updateChecklistName).toHaveBeenCalledWith('checklistId', 'new name');
      });

      describe('when changing name fast, multiple times', () => {
        beforeEach(fakeAsync(() => {
          dependencies.firestore.updateChecklistName.calls.reset();

          (getHeader().componentInstance as ChecklistHeaderComponentStub).appChecklistHeaderOnNameChanged.next('new name 1');
          tick(100);
          (getHeader().componentInstance as ChecklistHeaderComponentStub).appChecklistHeaderOnNameChanged.next('new name 2');
          tick(499);
          (getHeader().componentInstance as ChecklistHeaderComponentStub).appChecklistHeaderOnNameChanged.next('new name 3');
          tick(501);
        }));

        it('should debounce name changes and update checklist name only once', () => {
          expect(dependencies.firestore.updateChecklistName.calls.count()).toBe(1);
          expect(dependencies.firestore.updateChecklistName).toHaveBeenCalledWith('checklistId', 'new name 3');
        });
      });
    });
  });

  describe('when checklist is initiated', () => {
    beforeEach(() => {
      fixture.componentInstance.appChecklistData = {
        id: 'checklistId',
      } as Partial<ChecklistModel> as ChecklistModel;

      fixture.detectChanges();
    });

    describe('when delete checklist button clicked', () => {
      beforeEach(() => {
        (getCloseButton().nativeElement as HTMLElement).click();

        fixture.detectChanges();
      });

      it('should mark checklist as being deleted', () => {
        expect(getComponent().nativeElement).toHaveClass('isDeleted');
      });

      it('should remove checklist from the database', () => {
        expect(dependencies.firestore.removeChecklist).toHaveBeenCalledWith('checklistId');
      });
    });

    describe('when checklist has been resized', () => {
      let subscription: Subscription;
      let checklistResizedSpy: jasmine.Spy;

      beforeEach(waitForAsync(() => {
        checklistResizedSpy = createSpy('checklistResizedSpy');
        subscription = (getComponent().componentInstance as ChecklistComponent).checklistResized$.subscribe((event: ResizeEvent) => {
          checklistResizedSpy(event);
        });

        getResizableDirective().appResizableOnEnded.emit({
          newWidth: 100,
          newHeight: 200
        });
      }));

      it('should update checklist size', () => {
        expect(dependencies.firestore.updateChecklistSize).toHaveBeenCalledWith('checklistId', 100, 200);
      });

      it('should emit to observable', () => {
        expect(checklistResizedSpy).toHaveBeenCalledWith({
          newWidth: 100,
          newHeight: 200
        });
      });

      afterAll(() => {
        subscription.unsubscribe();
        subscription = null;
        checklistResizedSpy = null;
      });
    });

    describe('when adding a task', () => {
      beforeEach(waitForAsync(() => {
        getAddTaskButton().nativeElement.click();
      }));

      it('should add task to the checklist', () => {
        expect(dependencies.firestore.createTask).toHaveBeenCalledWith('checklistId');
      });
    });

    describe('when the component is destroyed', () => {
      beforeEach(waitForAsync(() => {
        (getComponent().componentInstance as ChecklistComponent).ngOnDestroy();
      }));

      describe('when checklist has been resized', () => {
        beforeEach(waitForAsync(() => {
          getResizableDirective().appResizableOnEnded.emit({
            newWidth: 100,
            newHeight: 200
          });
        }));

        it('should not update checklist size', () => {
          expect(dependencies.firestore.updateChecklistSize).not.toHaveBeenCalled();
        });
      });

      describe('when changing checklist name', () => {
        beforeEach(waitForAsync(() => {
          (getHeader().componentInstance as ChecklistHeaderComponentStub).appChecklistHeaderOnNameChanged.next('new name');
        }));

        it('should not update checklist name', () => {
          expect(dependencies.firestore.updateChecklistName).not.toHaveBeenCalled();
        });
      });
    });
  });

  afterAll(() => {
    fixture = null;
    dependencies = null;
    store = null;
    tasksSelector = null;
  });
});

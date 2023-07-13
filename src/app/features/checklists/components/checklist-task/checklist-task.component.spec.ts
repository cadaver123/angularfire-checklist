import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ChecklistTaskComponent } from './checklist-task.component';
import { FirestoreServiceStub } from '../../../../core/services/firestore/firestore.service.stub';
import { ChecklistComponentStub } from '../checklist/checklist.component.stub';
import { ChecklistComponent } from '../checklist/checklist.component';
import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChecklistTaskComponent', () => {
  let dependencies: {
    firestore: FirestoreServiceStub;
    parentChecklist: ChecklistComponentStub;
  };
  let fixture: ComponentFixture<TestHostComponent>;

  function getTextarea(): DebugElement {
    return fixture.debugElement.query(By.css('textarea'));
  }

  function getComponent(): DebugElement {
    return fixture.debugElement.query(By.directive(ChecklistTaskComponent));
  }

  function getCheckbox(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklistTask-checkbox'));
  }

  @Component({
    template: `
      <app-checklist-task
        [appChecklistTaskId]="taskId"
        [appChecklistTaskChecked]="checked"
        [appChecklistTaskMessage]="message"
      >
      </app-checklist-task>`
  })
  class TestHostComponent {
    public taskId: string = 'taskId';
    public checked: boolean;
    public message: string = 'message';
  }

  beforeEach(waitForAsync(async () => {
    dependencies = {
      firestore: new FirestoreServiceStub(),
      parentChecklist: new ChecklistComponentStub()
    };

    spyOn(M, 'textareaAutoResize');

    await TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        ChecklistTaskComponent
      ],
      imports: [NoopAnimationsModule],
      providers: [
        { provide: FirestoreService, useValue: dependencies.firestore },
        { provide: ChecklistComponent, useValue: dependencies.parentChecklist }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  }));

  it('should resize the text area', () => {
    expect(M.textareaAutoResize).toHaveBeenCalledWith(getTextarea().nativeElement);
  });

  it('should display message', () => {
    expect(getTextarea().nativeElement.value).toEqual('message');
  });

  describe('when resizing the checklist', () => {
    beforeEach(fakeAsync(() => {
      (M.textareaAutoResize as jasmine.Spy).calls.reset();
      dependencies.parentChecklist.checklistResized$.next({ newHeight: 100, newWidth: 200 });

      tick();
      fixture.detectChanges();
    }));

    it('should resize the text area', () => {
      expect(M.textareaAutoResize).toHaveBeenCalledWith(getTextarea().nativeElement);
    });
  });

  describe('when a task marked as checked', () => {
    beforeEach(waitForAsync(() => {
      fixture.componentInstance.checked = true;

      fixture.detectChanges();
    }));

    it('should disable textarea', () => {
      expect(getTextarea().nativeElement.disabled).toBe(true);
    });

    it('should style the element', () => {
      expect(getComponent().nativeElement.classList).toContain('isChecked');
    });

    describe('when toggle the task', () => {
      beforeEach(waitForAsync(() => {
        (getCheckbox().nativeElement as HTMLElement).click();

        fixture.detectChanges();
      }));

      it('should show uncheck icon', () => {
        expect(getCheckbox().nativeElement.textContent.trim()).toEqual('check_box_outline_blank');
      });

      describe('when toggle the task again', () => {
        beforeEach(waitForAsync(() => {
          (getCheckbox().nativeElement as HTMLElement).click();

          fixture.detectChanges();
        }));

        it('should show checked icon', () => {
          expect(getCheckbox().nativeElement.textContent.trim()).toEqual('check_box');
        });
      });
    });
  });

  describe('when message has changed', () => {
    beforeEach(waitForAsync(() => {
      getTextarea().triggerEventHandler('input', {
        target: {
          value: 'new value'
        }
      });
    }));

    it('should update firestore', () => {
      expect(dependencies.firestore.updateTaskMessage).toHaveBeenCalledWith('taskId', 'new value');
    });

    describe('when changing message fast', () => {
      beforeEach(fakeAsync(() => {
        dependencies.firestore.updateTaskMessage.calls.reset();
        getTextarea().triggerEventHandler('input', {
          target: {
            value: 'new'
          }
        });

        tick(10);

        getTextarea().triggerEventHandler('input', {
          target: {
            value: 'new value'
          }
        });

        tick(20);

        getTextarea().triggerEventHandler('input', {
          target: {
            value: 'new value new'
          }
        });

        tick(350);
      }));

      it('should debounce changes firestore', () => {
        expect(dependencies.firestore.updateTaskMessage).toHaveBeenCalledOnceWith('taskId', 'new value new');
      });
    });
  });

  describe('when user has delete the message', () => {
    beforeEach(waitForAsync(() => {
      getTextarea().triggerEventHandler('input', {
        target: {
          value: ''
        }
      });
    }));

    it('should delete the task in firestore', () => {
      expect(dependencies.firestore.removeTask).toHaveBeenCalledWith('taskId');
    });
  });

  afterAll(() => {
    fixture = null;
    dependencies = null;
  });
});

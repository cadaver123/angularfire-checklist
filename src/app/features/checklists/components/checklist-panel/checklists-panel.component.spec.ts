import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChecklistsPanelComponent } from './checklists-panel.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CHECKLIST_SELECTORS } from '../../store/checklist.selectors';
import { AppState } from '../../../../core/store/app/app.state';
import { MemoizedSelector } from '@ngrx/store';
import { ChecklistModel } from '../../model/checklist.model';
import { ChecklistComponentStub } from '../checklist/checklist.component.stub';
import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { FirestoreServiceStub } from '../../../../core/services/firestore/firestore.service.stub';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CdkDrag, CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { constant } from 'lodash-es';

describe('ChecklistsPanelComponent', () => {
  let dependencies: {
    firestoreService: FirestoreServiceStub
  };
  let fixture: ComponentFixture<ChecklistsPanelComponent>;
  let store: MockStore<AppState>;
  let checklistsSelector: MemoizedSelector<AppState, Array<ChecklistModel>>;

  function getContainer(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklistPanel-container'));
  }

  function getChecklists(): Array<DebugElement> {
    return fixture.debugElement.queryAll(By.directive(ChecklistComponentStub));
  }

  function getCdkDragDirective(index: number): CdkDrag {
    return fixture.debugElement.queryAll(By.directive(CdkDrag))[index].injector.get(CdkDrag);
  }

  beforeEach(async () => {
    dependencies = {
      firestoreService: new FirestoreServiceStub()
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DragDropModule
      ],
      declarations: [
        ChecklistsPanelComponent,
        ChecklistComponentStub
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: CHECKLIST_SELECTORS.checklists, value: null }]
        }),
        {
          provide: FirestoreService,
          useValue: dependencies.firestoreService
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore) as MockStore<AppState>;
    fixture = TestBed.createComponent(ChecklistsPanelComponent);
    checklistsSelector = store.overrideSelector(CHECKLIST_SELECTORS.checklists, []) as MemoizedSelector<AppState, Array<ChecklistModel>>;
    fixture.detectChanges();
  });

  describe('when initialized', () => {
    let firstChecklist: Partial<ChecklistModel>;
    let secondChecklist: Partial<ChecklistModel>;

    beforeEach(waitForAsync(() => {
      firstChecklist = { x: 1, y: 2 };
      secondChecklist = { x: 3, y: 4 };

      checklistsSelector.setResult([firstChecklist as ChecklistModel, secondChecklist as ChecklistModel]);
      store.refreshState();

      fixture.detectChanges();
    }));

    it('should display checklists', () => {
      expect(getChecklists().length).toBe(2);
      expect(getChecklists()[0].componentInstance.appChecklistData).toBe(firstChecklist);
      expect(getCdkDragDirective(0).data).toBe(firstChecklist);
      expect(getCdkDragDirective(0).freeDragPosition).toEqual({ x: 1, y: 2 });
      expect(getChecklists()[1].componentInstance.appChecklistData).toBe(secondChecklist);
      expect(getCdkDragDirective(1).data).toBe(secondChecklist);
      expect(getCdkDragDirective(1).freeDragPosition).toEqual({ x: 3, y: 4 });
    });

    describe('when user drags checklists', () => {
      beforeEach(() => {
        getCdkDragDirective(0).ended.next({
          source: {
            data: {
              id: 'checklistId'
            },
            getFreeDragPosition: constant({ x: 10, y: 20 })
          } as Partial<CdkDrag> as CdkDrag
        } as CdkDragEnd);
      });

      it('should update position of checklist ', () => {
        expect(dependencies.firestoreService.updateChecklistPosition).toHaveBeenCalledWith('checklistId', {
          x: 10,
          y: 20
        });
      });
    });

    describe('when clicked on panel', () => {
      beforeEach(() => {
        getContainer().triggerEventHandler('mousedown', { offsetX: 25, offsetY: 30 });
      });

      it('should create a checklist', () => {
        expect(dependencies.firestoreService.createChecklist).toHaveBeenCalledWith({ x: 0, y: 5 });
      });
    });

    describe('when component destroyed', () => {
      beforeEach(waitForAsync(() => {
        fixture.componentInstance.ngOnDestroy();
      }));

      describe('when checklists change', () => {
        beforeEach(waitForAsync(() => {
          checklistsSelector.setResult([firstChecklist as ChecklistModel]);
          store.refreshState();

          fixture.detectChanges();
        }));

        it('should listen to changes and not change checklists', () => {
          expect(getChecklists().length).toBe(2);
        });
      });
    });
  });
});

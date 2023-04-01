import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { FirestoreService } from 'src/app/core/services/firestore/firestore.service';
import { ChecklistModel } from 'src/app/features/checklists/model/checklist.model';

import { checklistsPanelAnimation } from './checklists-panel.animation';
import { AppState } from '../../../../core/store/app/app.state';
import { takeUntil } from 'rxjs/operators';
import { Point } from 'src/app/core/model/Point';
import { CHECKLIST_SELECTORS } from '../../store/checklist.selectors';

@Component({
  selector: 'app-checklists-panel',
  templateUrl: './checklists-panel.component.html',
  styleUrls: ['./checklists-panel.component.scss'],
  animations: [checklistsPanelAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'AppChecklistPanel' }
})
export class ChecklistsPanelComponent implements OnInit, OnDestroy {
  public checklists: Array<ChecklistModel> = new Array<ChecklistModel>();

  private readonly componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    public selfRef: ElementRef,
    private store: Store<AppState>,
    private firestore: FirestoreService,
    private cdr: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.subscribeToStore();
  }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  public async createChecklist(event: MouseEvent): Promise<void> {
    await this.firestore.createChecklist({ x: event.offsetX - 25, y: event.offsetY - 25 } as Point);
  }

  public async onDragEnded(event: CdkDragEnd<ChecklistModel>): Promise<void> {
    const { x, y }: Point = event.source.getFreeDragPosition();

    await this.firestore.updateChecklistPosition(event.source.data.id, { x, y } as Point);
  }

  public trackByChecklistId(index: number, checklist: ChecklistModel): string {
    return checklist.id;
  }

  private subscribeToStore(): void {
    this.store.select(CHECKLIST_SELECTORS.checklists)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe((checklists: Array<ChecklistModel>) => {
        this.checklists = [...checklists];
        this.cdr.markForCheck();
      });
  }
}

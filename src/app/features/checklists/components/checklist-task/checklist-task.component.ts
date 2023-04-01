import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as M from 'materialize-css';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { ChecklistComponent } from '../checklist/checklist.component';
import { checklistTaskAnimation } from './checklist-task.animation';

@Component({
  selector: 'app-checklist-task',
  templateUrl: './checklist-task.component.html',
  styleUrls: ['./checklist-task.component.scss'],
  animations: [checklistTaskAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'AppChecklistTask' }
})
export class ChecklistTaskComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public appChecklistTaskId: string;

  @Input()
  @HostBinding('class.isChecked')
  public appChecklistTaskChecked: boolean;

  @Input()
  public appChecklistTaskMessage: string;

  @ViewChild('textarea')
  public checklistTaskTextarea: ElementRef;

  private readonly messageChanged: Subject<string> = new Subject<string>();
  private readonly componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private firestore: FirestoreService,
    private parentChecklist: ChecklistComponent
  ) {
  }

  public ngOnInit(): void {
    this.subscribeToTextChange();
    this.parentChecklist.checklistResized$
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(() => M.textareaAutoResize((this.checklistTaskTextarea.nativeElement as HTMLElement)));
  }

  public ngAfterViewInit(): void {
    M.textareaAutoResize(this.checklistTaskTextarea.nativeElement as HTMLElement);
  }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  public async toggle(): Promise<void> {
    this.appChecklistTaskChecked = !this.appChecklistTaskChecked;
    await this.firestore.updateTaskStatus(this.appChecklistTaskId, this.appChecklistTaskChecked);
  }

  public onMessageChanged(text: string): void {
    this.messageChanged.next(text);
  }

  private subscribeToTextChange(): Subscription {
    return this.messageChanged
      .pipe(takeUntil(this.componentDestroyed))
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((text: string) => {
        if (text) {
          this.firestore.updateTaskMessage(this.appChecklistTaskId, text);
        } else {
          this.firestore.removeTask(this.appChecklistTaskId);
        }
      });
  }
}

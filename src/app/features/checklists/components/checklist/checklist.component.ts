import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TaskModel } from 'src/app/features/checklists/model/task.model';

import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { ChecklistModel } from '../../model/checklist.model';
import { AppState } from '../../../../core/store/app/app.state';
import { CHECKLIST_SELECTORS } from '../../store/checklist.selectors';
import { ResizeEvent } from '../../../../core/directives/resizable/interfaces/resize-event.interface';

const COLORS_COUNT: number = 6;

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'AppChecklist' }
})
export class ChecklistComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  public appChecklistData: ChecklistModel;

  @ViewChild('container')
  public containerRef: ElementRef;

  @HostBinding('class')
  public get getColorClass(): string {
    return `isColor${ this.color }`;
  }

  @HostBinding('class.isDeleted')
  public isDeleted: boolean;

  public tasks: Array<TaskModel>;

  public checklistResized$: Observable<ResizeEvent>;

  private readonly checklistResizedSubject: Subject<ResizeEvent> = new Subject<ResizeEvent>();
  private color: number;
  private readonly nameChangedSubject: Subject<string> = new Subject<string>();
  private readonly componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private firestore: FirestoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.checklistResized$ = this.checklistResizedSubject.asObservable();
  }

  public ngOnInit(): void {
    this.subscribeToStore();
    this.subscribeToNameChange();
    this.subscribeToSizeChange();
    this.color = this.appChecklistData.color;
  }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  public ngAfterViewInit(): void {
    if (this.appChecklistData.width && this.appChecklistData.height) {
      (this.containerRef.nativeElement as HTMLElement).style.width = `${ this.appChecklistData.width }px`;
      (this.containerRef.nativeElement as HTMLElement).style.height = `${ this.appChecklistData.height }px`;
    }
  }

  public resizeEnded(event: ResizeEvent): void {
    this.checklistResizedSubject.next(event);
  }

  public async deleteChecklist(): Promise<void> {
    this.isDeleted = true;
    await this.firestore.removeChecklist(this.appChecklistData.id);
  }

  public changeCardName(name: string): void {
    this.nameChangedSubject.next(name);
  }

  public async createTask(): Promise<void> {
    await this.firestore.createTask(this.appChecklistData.id);
  }

  public async changeColor(): Promise<void> {
    this.color = (this.color + 1) % COLORS_COUNT;
    await this.firestore.updateChecklistColor(this.appChecklistData.id, this.color);
  }

  private subscribeToNameChange(): void {
    this.nameChangedSubject
      .pipe(takeUntil(this.componentDestroyed))
      .pipe(debounceTime(500),
        distinctUntilChanged())
      .subscribe((name: string) => {
        this.firestore.updateChecklistName(this.appChecklistData.id, name);
      });
  }

  private subscribeToStore(): void {
    this.store.select(CHECKLIST_SELECTORS.tasks)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe((tasks: Map<string, Array<TaskModel>>) => {
        this.setAndSortChecklistTasks(tasks);
        this.cdr.markForCheck();
      });
  }

  private setAndSortChecklistTasks(allTasks: Map<string, Array<TaskModel>>): void {
    const checklistTaks: Array<TaskModel> = allTasks.get(this.appChecklistData.id) ?? [];

    checklistTaks.sort((el1: TaskModel, el2: TaskModel) => (el1.created > el2.created ? 1 : -1));
    this.tasks = checklistTaks;
  }

  private subscribeToSizeChange(): void {
    this.checklistResizedSubject
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe((event: ResizeEvent) => {
        const {
          newWidth,
          newHeight,
        }: ResizeEvent = event;

        this.firestore.updateChecklistSize(this.appChecklistData.id, newWidth, newHeight);
      });
  }
}

import { Component, Input } from '@angular/core';
import { ChecklistModel } from '../../model/checklist.model';
import { Subject } from 'rxjs';
import { ResizeEvent } from '../../../../core/directives/resizable/interfaces/resize-event.interface';

@Component({
  selector: 'app-checklist',
  template: ''
})
export class ChecklistComponentStub {
  @Input()
  public appChecklistData: ChecklistModel;

  public checklistResized$: Subject<ResizeEvent> = new Subject<ResizeEvent>();
}

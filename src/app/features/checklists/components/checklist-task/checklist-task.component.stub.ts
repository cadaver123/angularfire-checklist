import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checklist-task',
  template: ''
})
export class ChecklistTaskComponentStub {
  @Input()
  public appChecklistTaskId: string;

  @Input()
  public appChecklistTaskChecked: boolean;

  @Input()
  public appChecklistTaskMessage: string;

}

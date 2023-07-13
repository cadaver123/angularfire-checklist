import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checklist-header',
  template: ''
})
export class ChecklistHeaderComponentStub {
  @Input()
  public appChecklistHeaderCardName: string;

  @Output()
  public appChecklistHeaderOnNameChanged: EventEmitter<string> = new EventEmitter<string>();
}

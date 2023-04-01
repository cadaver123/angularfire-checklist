import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checklist-header',
  template: ''
})
export class ChecklistHeaderComponentStub {
  @Input()
  public appChecklistHeaderCardName: string;

  @Output()
  public appChecklistHeaderOnDelete: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public appChecklistHeaderOnNameChanged: EventEmitter<string> = new EventEmitter<string>();
}

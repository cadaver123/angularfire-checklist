import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checklist-header',
  templateUrl: './checklist-header.component.html',
  styleUrls: ['./checklist-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'AppChecklistHeader' }
})
export class ChecklistHeaderComponent {
  @Input()
  public appChecklistHeaderCardName: string;

  @Output()
  public appChecklistHeaderOnNameChanged: EventEmitter<string> = new EventEmitter<string>();

  public changeCardName(changedName: string): void {
    this.appChecklistHeaderOnNameChanged.emit(changedName);
  }
}

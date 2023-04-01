import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChecklistTaskComponent } from './components/checklist-task/checklist-task.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { ChecklistsPanelComponent } from './components/checklist-panel/checklists-panel.component';
import { ResizableDirective } from '../../core/directives/resizable/resizable.directive';
import { ChecklistHeaderComponent } from './components/checklist-header/checklist-header.component';

@NgModule({
  declarations: [
    ChecklistsPanelComponent,
    ChecklistComponent,
    ChecklistTaskComponent,
    ChecklistHeaderComponent,
    ResizableDirective
  ],
  imports: [
    CommonModule,
    ChecklistsRoutingModule,
    DragDropModule
  ],
})
export class ChecklistsModule {
}

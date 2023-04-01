import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChecklistsPanelComponent } from './components/checklist-panel/checklists-panel.component';

const routes: Routes = [
  {
    path: '',
    component: ChecklistsPanelComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistsRoutingModule {
}

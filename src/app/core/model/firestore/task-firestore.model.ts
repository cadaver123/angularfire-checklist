import { DocumentReference } from '@angular/fire/compat/firestore';
import { ChecklistFirestoreModel } from './checklist-firestore.model';

export interface TaskFirestoreModel {
  checklistRef: DocumentReference<ChecklistFirestoreModel>;
  checked: boolean;
  message: string;
  created: Date;
}

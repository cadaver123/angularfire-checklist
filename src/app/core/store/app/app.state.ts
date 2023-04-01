import { ErrorState } from '../error/error.state';
import { UserState } from '../user/user.state';
import { ChecklistState } from '../../../features/checklists/store/checklist.state';

export interface AppState {
  checklists: ChecklistState;
  error: ErrorState;
  user: UserState;
}


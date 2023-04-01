import { MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { environment } from '../../../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { clearStateMetaReducer } from './app.reducer';

export const metaReducers: Array<MetaReducer<AppState>> =
  environment.production ? [clearStateMetaReducer] : [storeFreeze, clearStateMetaReducer];

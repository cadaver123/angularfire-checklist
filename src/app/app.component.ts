import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AppActions from './core/store/app/app.actions';
import { FirestoreSubscriptionsService } from './core/services/firestore-subscriptions/firestore-subscriptions.service';
import { ERROR_SELECTORS } from './core/store/error/error.selectors';
import { AuthService } from './core/services/auth/auth.service';
import { USER_SELECTORS } from './core/store/user/user.selectors';
import { Observable } from 'rxjs';
import { AppState } from './core/store/app/app.state';
import { UserStatus } from './core/constants/user-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'App' }
})
export class AppComponent implements OnInit, AfterViewInit {
  public currentUserStatus$: Observable<UserStatus>;
  public UserStatus: typeof UserStatus = UserStatus;

  constructor(public router: Router,
              public auth: AuthService,
              private store: Store<AppState>,
              private firestoreService: FirestoreSubscriptionsService) {
  }

  public ngOnInit(): void {
    this.firestoreService.init();
    this.currentUserStatus$ = this.store.select<UserStatus>(USER_SELECTORS.userStatus);
  }

  public ngAfterViewInit(): void {
    this.store.select(ERROR_SELECTORS.errorMsg).subscribe((msg: string) => {
      if (msg) {
        M.toast({ html: msg });
      }
    });
  }

  public async logout(): Promise<void> {
    this.store.dispatch(new AppActions.ClearStoreAction());
    await this.auth.signOut();
    await this.router.navigate(['login']);
  }
}

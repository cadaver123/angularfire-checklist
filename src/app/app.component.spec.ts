import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Location } from '@angular/common';
import { FirestoreSubscriptionsService } from './core/services/firestore-subscriptions/firestore-subscriptions.service';
import { FirestoreSubscriptionsServiceStub } from './core/services/firestore-subscriptions/firestore-subscriptions.service.stub';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { FakeRoutingComponentStub } from './stubs/fake-routing-component.stub';
import * as AppActions from './core/store/app/app.actions';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from './core/store/app/app.state';
import { ERROR_SELECTORS } from './core/store/error/error.selectors';
import { AuthService } from './core/services/auth/auth.service';
import { AuthServiceStub } from './core/services/auth/auth.service.stub';
import { USER_SELECTORS } from './core/store/user/user.selectors';
import { UserStatus } from './core/constants/user-status';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let dependencies: {
    auth: AuthServiceStub;
    firestoreService: FirestoreSubscriptionsServiceStub;
  };
  let store: MockStore<AppState>;
  let location: Location;
  let router: Router;
  let errorSelector: MemoizedSelector<AppState, string>;
  let userStatusSelector: MemoizedSelector<AppState, UserStatus>;

  function getSignInButton(): DebugElement {
    return fixture.debugElement.query(By.css('.App-SignInButton'));
  }

  function getSignUpButton(): DebugElement {
    return fixture.debugElement.query(By.css('.App-SignUpButton'));
  }

  function getLogoutButton(): DebugElement {
    return fixture.debugElement.query(By.css('.App-LogoutButton'));
  }

  beforeEach(async () => {
    dependencies = {
      auth: new AuthServiceStub(),
      firestoreService: new FirestoreSubscriptionsServiceStub()
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'signup', component: FakeRoutingComponentStub },
        { path: 'login', component: FakeRoutingComponentStub }
      ])],
      declarations: [
        AppComponent,
        FakeRoutingComponentStub
      ],
      providers: [
        provideMockStore({
            selectors: [{ selector: ERROR_SELECTORS.errorMsg, value: null }]
          }
        ),
        { provide: AuthService, useValue: dependencies.auth },
        { provide: FirestoreSubscriptionsService, useValue: dependencies.firestoreService }
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore) as MockStore<AppState>;
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);

    router.initialNavigation();

    fixture = TestBed.createComponent(AppComponent);
    errorSelector = store.overrideSelector(ERROR_SELECTORS.errorMsg, null) as MemoizedSelector<AppState, string>;
    userStatusSelector = store.overrideSelector(USER_SELECTORS.userStatus, null) as MemoizedSelector<AppState, UserStatus>;
    store.refreshState();
    fixture.detectChanges();
  });

  it('should initialize firestore', () => {
    expect(dependencies.firestoreService.init).toHaveBeenCalled();
  });

  describe('when the user is not logged in', () => {
    beforeEach(waitForAsync(() => {
      userStatusSelector.setResult(UserStatus.LOGGED_OUT);
      store.refreshState();
    }));

    describe('when the user is on sign-up page', () => {
      beforeEach(waitForAsync(async () => {
        await router.navigate(['/signup']);
        fixture.detectChanges();
      }));

      it('should show a sign-in button', () => {
        expect(getSignInButton()).not.toBeNull();
      });

      it('should hide a sign up button', () => {
        expect(getSignUpButton()).toBeNull();
      });

      it('should hide a logout button', () => {
        expect(getLogoutButton()).toBeNull();
      });

      describe('when the user click sign-in button', () => {
        beforeEach(waitForAsync(() => {
          (getSignInButton().nativeElement as HTMLElement).click();
        }));

        it(`should navigate to login page`, () => {
          expect(location.path()).toBe('/login');
        });
      });
    });

    describe('when the user is not on sign-up page', () => {
      beforeEach(waitForAsync(() => {
        fixture.detectChanges();
      }));

      it('should show a sign up button', () => {
        expect(getSignUpButton()).not.toBeNull();
      });

      it('should hide a sign-in button', () => {
        expect(getSignInButton()).toBeNull();
      });

      it('should hide a logout button', () => {
        expect(getLogoutButton()).toBeNull();
      });

      describe('when the user click sign-up button', () => {
        beforeEach(waitForAsync(() => {
          (getSignUpButton().nativeElement as HTMLElement).click();
        }));

        it(`should navigate to login page`, () => {
          expect(location.path()).toBe('/signup');
        });
      });
    });
  });

  describe('when the user is logged in', () => {
    beforeEach(waitForAsync(() => {
      userStatusSelector.setResult(UserStatus.LOGGED_IN);
      store.refreshState();

      fixture.detectChanges();
    }));

    it('should hide a sign in button', () => {
      expect(getSignInButton()).toBeNull();
    });

    it('should hide a sign up button', () => {
      expect(getSignUpButton()).toBeNull();
    });

    it('should show a logout button', () => {
      expect(getLogoutButton()).not.toBeNull();
    });

    describe('when user click logout button', () => {
      beforeEach(waitForAsync(() => {
        spyOn(store, 'dispatch');
        (getLogoutButton().nativeElement as HTMLElement).click();
      }));

      it(`should dispatch 'clear store' action`, () => {
        expect(store.dispatch).toHaveBeenCalledWith(new AppActions.ClearStoreAction());
      });

      it(`should sign-out from firestore`, () => {
        expect(dependencies.auth.signOut).toHaveBeenCalledWith();
      });

      it(`should navigate to login page`, () => {
        expect(location.path()).toBe('/login');
      });
    });
  });

  describe('when an error is dispatched', () => {
    describe('when the error is not empty', () => {
      beforeEach(waitForAsync(() => {
        spyOn(M, 'toast');
        errorSelector.setResult('an error');
        store.refreshState();
      }));

      it('should show a toast with the error', () => {
        expect(M.toast).toHaveBeenCalledWith({ html: 'an error' });
      });
    });

    describe('when there is no error message', () => {
      beforeEach(waitForAsync(() => {
        spyOn(M, 'toast');
        errorSelector.setResult(null);
        store.refreshState();
      }));

      it('should not show a toast message', () => {
        expect(M.toast).not.toHaveBeenCalled();
      });
    });
  });

  afterAll(() => {
    dependencies = null;
    fixture = null;
    store = null;
    location = null;
    router = null;
    errorSelector = null;
    userStatusSelector = null;
  });
});

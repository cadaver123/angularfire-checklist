import { waitForAsync } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireAuthStub } from 'src/app/stubs/angular-fire-auth.stub';
import firebase from 'firebase/compat';
import { Subject } from 'rxjs';
import { AppState } from '../../store/app/app.state';
import { Store } from '@ngrx/store';
import { StoreSimpleStub } from '../../../stubs/store-simple.stub';
import { SetUserStatusAction } from '../../store/user/user.actions';
import { UserStatus } from '../../constants/user-status';

describe('AuthService', () => {
  let service: AuthService;
  let dependencies: {
    angularFireAuth: AngularFireAuthStub;
    router: Router;
    store: StoreSimpleStub<AppState>;
  };
  let userSubject: Subject<firebase.User | null>;

  beforeEach(() => {
    userSubject = new Subject<firebase.User | null>();
    dependencies = {
      angularFireAuth: new AngularFireAuthStub(userSubject),
      router: {
        navigate: jasmine.createSpy('router.navigate')
      } as Partial<Router> as Router,
      store: new StoreSimpleStub<AppState>()
    };

    service = new AuthService(
      dependencies.angularFireAuth as Partial<AngularFireAuth> as AngularFireAuth,
      dependencies.router,
      dependencies.store as Partial<Store<AppState>> as Store<AppState>
    );
  });

  describe('when logging in by email', () => {
    let signInResolve: (value: null) => void;

    beforeEach(waitForAsync(() => {
      dependencies.angularFireAuth.signInWithEmailAndPassword.and.returnValue(new Promise((resolve: (value: null) => void) => {
        signInResolve = resolve;
      }));

      service.login('email@email', 'password');
    }));

    it('should log in', () => {
      expect(dependencies.angularFireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('email@email', 'password');
    });

    describe('when logged in', () => {
      beforeEach(waitForAsync(() => {
        signInResolve(null);
      }));

      it('should redirect to panel', () => {
        expect(dependencies.router.navigate).toHaveBeenCalledWith(['/panel']);
      });
    });

    afterAll(() => {
      signInResolve = null;
    });
  });

  describe('when logging in by gmail', () => {
    let signInResolve: (value: null) => void;

    beforeEach(waitForAsync(() => {
      dependencies.angularFireAuth.signInWithPopup.and.returnValue(
        new Promise((resolve: (value: null) => void) => {
          signInResolve = resolve;
        }));

      service.googleSignIn();
    }));

    describe('when logged in', () => {
      beforeEach(waitForAsync(() => {
        signInResolve(null);
      }));

      it('should redirect to panel', () => {
        expect(dependencies.router.navigate).toHaveBeenCalledWith(['/panel']);
      });
    });

    afterAll(() => {
      signInResolve = null;
    });
  });

  describe('when the user is logging out', () => {
    beforeEach(() => {
      service.signOut();
    });

    it('should sign out', () => {
      expect(dependencies.angularFireAuth.signOut).toHaveBeenCalled();
    });
  });

  describe('when signing up in by email', () => {
    let signUpResolve: (value: null) => void;

    beforeEach(waitForAsync(() => {
      dependencies.angularFireAuth.createUserWithEmailAndPassword.and.returnValue(
        new Promise((resolve: (value: null) => void) => {
          signUpResolve = resolve;
        }));

      service.signup('email@email', 'password');
    }));

    it('should log in', () => {
      expect(dependencies.angularFireAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith('email@email', 'password');
    });

    describe('when signed up', () => {
      beforeEach(waitForAsync(() => {
        signUpResolve(null);
      }));

      it('should redirect to panel', () => {
        expect(dependencies.router.navigate).toHaveBeenCalledWith(['/panel']);
      });
    });

    describe('when the user has logged in ', () => {
      describe('when it is a new log in', () => {
        beforeEach(waitForAsync(() => {
          userSubject.next({ uid: 'user' } as firebase.User);
        }));

        it('should change user status', () => {
          expect(dependencies.store.dispatch).toHaveBeenCalledWith(new SetUserStatusAction({ userStatus: UserStatus.LOGGED_IN }));
        });

        describe('when the same user is emitted by logging service', () => {
          beforeEach(waitForAsync(() => {
            dependencies.store.dispatch.calls.reset();
            userSubject.next({ uid: 'user' } as firebase.User);
          }));

          it('should not change user status', () => {
            expect(dependencies.store.dispatch).not.toHaveBeenCalled();
          });
        });

        describe('when the user has logged out', () => {
          beforeEach(waitForAsync(() => {
            userSubject.next(null);
          }));

          it('should change user status', () => {
            expect(dependencies.store.dispatch).toHaveBeenCalledWith(new SetUserStatusAction({ userStatus: UserStatus.LOGGED_OUT }));
          });
        });
      });
    });

    afterAll(() => {
      service = null;
      dependencies = null;
      userSubject = null;
    });
  });
});

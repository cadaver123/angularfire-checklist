import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, User } from '@angular/fire/auth';
import { distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app/app.state';
import { SetUserStatusAction } from '../../store/user/user.actions';
import { UserStatus } from '../../constants/user-status';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private store: Store<AppState>) {
    this.fireAuth.user
      .pipe(distinctUntilChanged((u1: User, u2: User) => u1?.uid === u2?.uid))
      .subscribe((user: User | null): void => {
        store.dispatch(new SetUserStatusAction({ userStatus: user ? UserStatus.LOGGED_IN : UserStatus.LOGGED_OUT }));
      });
  }

  public login(email: string, password: string): void {
    this.fireAuth.signInWithEmailAndPassword(email, password).then(this.redirectToPanel);
  }

  public googleSignIn(): void {
    this.fireAuth.signInWithPopup(new GoogleAuthProvider()).then(this.redirectToPanel);
  }

  public signup(email: string, password: string): void {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(this.redirectToPanel);
  }

  public async signOut(): Promise<void> {
    await this.fireAuth.signOut();
  }

  private redirectToPanel: () => Promise<boolean> = () => this.router.navigate(['/panel']);
}

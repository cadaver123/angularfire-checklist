import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import firebase from 'firebase/compat';
import { Stub } from './stub.type';

export class AngularFireAuthStub implements Partial<Stub<AngularFireAuth>> {
  public user: Observable<firebase.User | null>;
  public currentUser: Promise<firebase.User>;
  public signOut: jasmine.Spy = jasmine.createSpy('AngularFireAuthStub.signOut');
  public signInWithEmailAndPassword: jasmine.Spy = jasmine.createSpy('AngularFireAuthStub.signInWithEmailAndPassword');
  public signInWithPopup: jasmine.Spy = jasmine.createSpy('AngularFireAuthStub.signInWithPopup');
  public createUserWithEmailAndPassword: jasmine.Spy = jasmine.createSpy('AngularFireAuthStub.createUserWithEmailAndPassword');

  constructor(userSubject?: Subject<firebase.User | null>) {
    this.user = userSubject ? userSubject.asObservable() : new Observable<firebase.User | null>();
  }
}

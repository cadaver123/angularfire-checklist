import { Stub } from 'src/app/stubs/stub.type';
import { AuthService } from './auth.service';

export class AuthServiceStub implements Stub<AuthService> {
  public googleSignIn: jasmine.Spy = jasmine.createSpy('AuthService.googleSignIn');
  public login: jasmine.Spy = jasmine.createSpy('AuthService.login');
  public signOut: jasmine.Spy = jasmine.createSpy('AuthService.signOut');
  public signup: jasmine.Spy = jasmine.createSpy('AuthService.signup');
}

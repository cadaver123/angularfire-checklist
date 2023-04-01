import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { AuthServiceStub } from '../../core/services/auth/auth.service.stub';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let dependencies: {
    authService: AuthServiceStub;
  };
  let fixture: ComponentFixture<LoginComponent>;

  function getLoginButton(): DebugElement {
    return fixture.debugElement.query(By.css('[type=submit]'));
  }

  function getEmailInput(): DebugElement {
    return fixture.debugElement.query(By.css('[type=email]'));
  }

  function getPasswordInput(): DebugElement {
    return fixture.debugElement.query(By.css('[type=password]'));
  }

  function getGoogleButton(): DebugElement {
    return fixture.debugElement.query(By.css('.AppLogin-googleOauthContainer'));
  }

  beforeEach(waitForAsync(async () => {
    dependencies = {
      authService: new AuthServiceStub()
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: dependencies.authService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  }));

  describe('when valid email and password have been entered', () => {
    beforeEach(waitForAsync(() => {
      getEmailInput().nativeElement.value = 'email@email.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'passwo';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should enable the login button', () => {
      expect(getLoginButton().nativeElement.disabled).toBe(false);
    });

    describe('when login button has been clicked', () => {
      beforeEach(() => {
        getLoginButton().nativeElement.click();
      });

      it('should login with credentials', () => {
        expect(dependencies.authService.login).toHaveBeenCalledWith('email@email.com', 'passwo');
      });
    });
  });

  describe('when invalid email has been entered', () => {
    beforeEach(waitForAsync(() => {
      getEmailInput().nativeElement.value = 'emailemail.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'passwo';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should disable the login button', () => {
      expect(getLoginButton().nativeElement.disabled).toBe(true);
    });
  });

  describe('when invalid password been entered', () => {
    beforeEach(waitForAsync(() => {
      getEmailInput().nativeElement.value = 'email@email.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'passw';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should disable the login button', () => {
      expect(getLoginButton().nativeElement.disabled).toBe(true);
    });
  });

  describe('when clicked on login via google', () => {
    beforeEach(() => {
      getGoogleButton().nativeElement.click();
    });

    it('should login via google', () => {
      expect(dependencies.authService.googleSignIn).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    dependencies = null;
    fixture = null;
  });
});

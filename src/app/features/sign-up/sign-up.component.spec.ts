import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from '../../core/services/auth/auth.service';
import { AuthServiceStub } from '../../core/services/auth/auth.service.stub';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let dependencies: {
    authService: AuthServiceStub;
  };
  let fixture: ComponentFixture<SignUpComponent>;

  function getSignUpButton(): DebugElement {
    return fixture.debugElement.query(By.css('[type=submit]'));
  }

  function getEmailInput(): DebugElement {
    return fixture.debugElement.query(By.css('[type=email]'));
  }

  function getPasswordInput(): DebugElement {
    return fixture.debugElement.query(By.css('[name=password]'));
  }

  function getPasswordConfirmationInput(): DebugElement {
    return fixture.debugElement.query(By.css('[name=confirm-password]'));
  }

  beforeEach(waitForAsync(async () => {
    dependencies = {
      authService: new AuthServiceStub()
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        SignUpComponent
      ],
      providers: [
        { provide: AuthService, useValue: dependencies.authService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    fixture.detectChanges();
  }));

  describe('when valid email and password have been entered', () => {
    beforeEach(waitForAsync(() => {
      getEmailInput().nativeElement.value = 'email@email.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'passwo';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.value = 'passwo';
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should enable the sign up button', () => {
      expect(getSignUpButton().nativeElement.disabled).toBe(false);
    });

    describe('when sign up button has been clicked', () => {
      beforeEach(() => {
        getSignUpButton().nativeElement.click();
      });

      it('should login with credentials', () => {
        expect(dependencies.authService.signup).toHaveBeenCalledWith('email@email.com', 'passwo');
      });
    });
  });

  describe('when invalid email has been entered', () => {
    beforeEach(waitForAsync(() => {
      getEmailInput().nativeElement.value = 'emailemail.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'passwo';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.value = 'passwo';
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should disable the sign up button', () => {
      expect(getSignUpButton().nativeElement.disabled).toBe(true);
    });
  });

  describe('when a password is too short', () => {
    beforeEach(waitForAsync(() => {
      getEmailInput().nativeElement.value = 'email@email.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'passw';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.value = 'passw';
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should disable the sign up button', () => {
      expect(getSignUpButton().nativeElement.disabled).toBe(true);
    });
  });

  describe('when a passwords are mismatched', () => {
    beforeEach(waitForAsync(() => {
      spyOn(getPasswordConfirmationInput().nativeElement, 'setCustomValidity');
      getEmailInput().nativeElement.value = 'email@email.com';
      getEmailInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordInput().nativeElement.value = 'password';
      getPasswordInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.value = 'password1';
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));
      getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    }));

    it('should disable the sign up button', () => {
      expect(getSignUpButton().nativeElement.disabled).toBe(true);
    });

    it('should set the error message', () => {
      expect(getPasswordConfirmationInput().nativeElement.setCustomValidity).toHaveBeenCalledWith(`Passwords don't match`);
      expect(fixture.componentInstance.formRef.controls['confirm-password'].getError('nomatch')).toBeTruthy();
    });

    describe('when passwords start to match', () => {
      beforeEach(waitForAsync(() => {
        getPasswordConfirmationInput().nativeElement.setCustomValidity.calls.reset();
        getPasswordConfirmationInput().nativeElement.value = 'password';
        getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));
        getPasswordConfirmationInput().nativeElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();
      }));

      it('should enable the sign up button', () => {
        expect(getSignUpButton().nativeElement.disabled).toBe(false);
      });

      it('should hide the error message', () => {
        expect(getPasswordConfirmationInput().nativeElement.setCustomValidity).toHaveBeenCalledWith('');
        expect(fixture.componentInstance.formRef.controls['confirm-password'].getError('nomatch')).toBeNull();
      });
    });
  });

  afterAll(() => {
    dependencies = null;
    fixture = null;
  });
});

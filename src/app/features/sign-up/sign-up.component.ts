import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';

type SignUpFormType = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'AppSignUp' }
})
export class SignUpComponent {

  @ViewChild('passwordConfirm')
  public passwordConfirmRef: ElementRef<HTMLInputElement>;

  @ViewChild('signupForm')
  public formRef: NgForm;

  constructor(private authService: AuthService) {
  }

  public checkPasswords(): void {
    if (this.formRef.controls['confirm-password'].value !== this.formRef.controls.password.value) {
      this.passwordConfirmRef.nativeElement.setCustomValidity(`Passwords don't match`);
      this.formRef.controls['confirm-password'].setErrors({ nomatch: true });
    } else {
      this.passwordConfirmRef.nativeElement.setCustomValidity('');
      this.formRef.controls['confirm-password'].setErrors(null);
    }
  }

  public signup(form: NgForm): void {
    this.authService.signup((form.value as SignUpFormType).email, (form.value as SignUpFormType).password);
  }
}

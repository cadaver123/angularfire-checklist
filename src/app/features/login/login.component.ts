import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AuthService } from '../../core/services/auth/auth.service';

type LoginFormType = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'AppLogin' }
})
export class LoginComponent {
  constructor(private authService: AuthService) {
  }

  public emailSingIn(form: { value: LoginFormType }): void {
    this.authService.login(form.value.email, form.value.password);
  }

  public googleSignIn(): void {
    this.authService.googleSignIn();
  }
}

import { NgModule, Type } from '@angular/core';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { AuthPipe } from '@angular/fire/auth-guard/auth-guard';
import { LoginModule } from './features/login/login.module';
import { SignUpModule } from './features/sign-up/sign-up.module';
import { ChecklistsModule } from './features/checklists/checklists.module';

const redirectUnauthorizedToLoginPage: (redirect: string) => AuthPipe = () => redirectUnauthorizedTo('login');

// eslint-disable @typescript-eslint/typedef
const routes: Routes = [
  { path: '', redirectTo: '/panel', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m: { LoginModule: Type<LoginModule> }) => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./features/sign-up/sign-up.module').then((m: { SignUpModule: Type<SignUpModule> }) => m.SignUpModule),
  },
  {
    path: 'panel',
    loadChildren: () =>
      import('./features/checklists/checklists.module').then((m: { ChecklistsModule: Type<ChecklistsModule> }) => m.ChecklistsModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLoginPage }
  },
];

// eslint-enable

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

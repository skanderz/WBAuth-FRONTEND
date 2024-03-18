import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AccueilPrincipaleComponent } from './AccueilPrincipale/AccueilPrincipale.component'
import { AuthentificationComponent } from './AccueilPrincipale/Authentification/Authentification.component'
import { InscriptionComponent } from './AccueilPrincipale/Inscription/Inscription.component'
import { AuthentificationAppExterneComponent } from './AccueilApplicationExterne/Authentification/AuthentificationAppExterne.component'
import { InscriptionAppExterneComponent } from './AccueilApplicationExterne/Inscription/InscriptionAppExterne.component'
import { BarreHauteComponent } from './BarreHaute/BarreHaute.component'
import { BarreGaucheComponent } from './barre-gauche/barre-gauche.component'
import { AccueilComponent } from './Modules/Accueil/Accueil.component';
import { ApplicationComponent } from './Modules/Application/Application.component';
import { AjouterApplicationComponent } from './Modules/Application/Ajouter/AjouterApplication.component';
import { ModifierApplicationComponent } from './Modules/Application/Modifier/ModifierApplication.component';
import { FonctionComponent } from './Modules/Fonction/Fonction.component';
import { AjouterFonctionComponent } from './Modules/Fonction/Ajouter/AjouterFonction.component';
import { ModifierFonctionComponent } from './Modules/Fonction/Modifier/ModifierFonction.component';
import { PermissionComponent } from './Modules/Permission/Permission.component';
import { AjouterPermissionComponent } from './Modules/Permission/Ajouter/AjouterPermission.component';
import { ModifierPermissionComponent } from './Modules/Permission/Modifier/ModifierPermission.component';
import { RoleComponent } from './Modules/Role/Role.component';
import { AjouterRoleComponent } from './Modules/Role/Ajouter/AjouterRole.component';
import { ModifierRoleComponent } from './Modules/Role/Modifier/ModifierRole.component';
import { UtilisateurComponent } from './Modules/Utilisateur/Utilisateur.component';
import { AjouterUtilisateurComponent } from './Modules/Utilisateur/Ajouter/AjouterUtilisateur.component';
import { ModifierUtilisateurComponent } from './Modules/Utilisateur/Modifier/ModifierUtilisateur.component';
import { AccesComponent } from './Modules/Utilisateur/Acces/Acces.component';
import { ModifierAccesComponent } from './Modules/Utilisateur/Acces/ModifierAcces.component';
import { ActiviteComponent } from './Modules/Utilisateur/Activite/Activite.component';
import { ModifierProfilComponent } from './Modules/Utilisateur/Profil/ModifierProfil.component';
import { CellStyleDirective } from './Modules/Utilisateur/Acces/cell-style.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { UtilisateurService } from './Services/utilisateur.service';
import { JwtModule } from "@auth0/angular-jwt";
import { Chargement } from './AccueilPrincipale/Authentification/Chargement.component'
import { Chargement2 } from './AccueilPrincipale/Authentification/Chargement2.component'
import { ForgotPassword } from './AccueilPrincipale/Authentification/forgot-password.component'
import { TwoStepVerificationComponent } from './AccueilPrincipale/Authentification/two-step-verification.component'
import { ResetPasswordComponent } from './AccueilPrincipale/Authentification/reset-password.component'
import { EmailConfirmation } from './AccueilPrincipale/Authentification/EmailConfirmation.component'
import { LinkedInResponseComponent } from './../app/AccueilPrincipale/Authentification/LinkedInResponse.component'
import { ForgotPasswordAppExterne } from './AccueilApplicationExterne/Authentification/forgot-passwordAppExterne.component'
import { TwoStepVerificationAppExterneComponent } from './AccueilApplicationExterne/Authentification/two-step-verificationAppExterne.component'
import { ResetPasswordAppExterneComponent } from './AccueilApplicationExterne/Authentification/reset-passwordAppExterne.component'
import { EmailConfirmationAppExterne } from './AccueilApplicationExterne/Authentification/EmailConfirmationAppExterne.component'



export function tokenGetter() {  return localStorage.getItem("token");  }

@NgModule({
  declarations: [
    AppComponent, BarreHauteComponent, BarreGaucheComponent, AccueilComponent, FonctionComponent, ApplicationComponent, CellStyleDirective,
    PermissionComponent, RoleComponent, UtilisateurComponent, AjouterApplicationComponent, ModifierApplicationComponent, AjouterFonctionComponent,
    ModifierFonctionComponent, AjouterPermissionComponent, ModifierPermissionComponent, AjouterRoleComponent, ModifierRoleComponent, ModifierProfilComponent,
    AjouterUtilisateurComponent, ModifierUtilisateurComponent, AccesComponent, ModifierAccesComponent, ActiviteComponent, ForgotPassword, TwoStepVerificationComponent,
    AccueilPrincipaleComponent, AuthentificationComponent, InscriptionComponent, ResetPasswordComponent, EmailConfirmation, LinkedInResponseComponent,
    AuthentificationAppExterneComponent, InscriptionAppExterneComponent, ForgotPasswordAppExterne, TwoStepVerificationAppExterneComponent,
    ResetPasswordAppExterneComponent, EmailConfirmationAppExterne
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'Application/AjouterApplication', component: AjouterApplicationComponent, canActivate: [AuthGuard] },
      { path: 'Application/ModifierApplication/:id', component: ModifierApplicationComponent, canActivate: [AuthGuard] },
      { path: 'Fonction/AjouterFonction', component: AjouterFonctionComponent, canActivate: [AuthGuard] },
      { path: 'Fonction/ModifierFonction/:id', component: ModifierFonctionComponent, canActivate: [AuthGuard] },
      { path: 'Permission/AjouterPermission', component: AjouterPermissionComponent, canActivate: [AuthGuard] },
      { path: 'Permission/ModifierPermission/:id', component: ModifierPermissionComponent, canActivate: [AuthGuard] },
      { path: 'Role/AjouterRole', component: AjouterRoleComponent, canActivate: [AuthGuard] },
      { path: 'Role/ModifierRole/:id', component: ModifierRoleComponent, canActivate: [AuthGuard] },
      { path: 'Utilisateur/AjouterUtilisateur', component: AjouterUtilisateurComponent, canActivate: [AuthGuard] },
      { path: 'Utilisateur/ModifierUtilisateur/:idUtilisateur', component: ModifierUtilisateurComponent, canActivate: [AuthGuard] },
      { path: 'Utilisateur/Acces', component: AccesComponent, canActivate: [AuthGuard] },
      { path: 'Utilisateur/ModifierAcces/:id', component: ModifierAccesComponent, canActivate: [AuthGuard] },
      { path: 'Utilisateur/Activite', component: ActiviteComponent, canActivate: [AuthGuard] }
    ]),
    RouterModule.forRoot([
      { path: '', redirectTo: 'AccueilPrincipale', pathMatch: 'full' },
      { path: 'AccueilPrincipale', component: AccueilPrincipaleComponent },
      { path: 'Authentification', component: AuthentificationComponent },
      { path: 'Inscription', component: InscriptionComponent },
      { path: 'EmailConfirmation', component: EmailConfirmation },
      { path: 'ForgotPassword', component: ForgotPassword },
      { path: 'ResetPassword', component: ResetPasswordComponent },
      { path: 'TwoStepVerification', component: TwoStepVerificationComponent },
      { path: 'Chargement', component: Chargement },
      { path: 'Chargement2', component: Chargement2 },
      { path: 'LinkedIn', component: LinkedInResponseComponent },
      { path: 'Accueil', component: AccueilComponent, canActivate: [AuthGuard]},
      { path: 'Application', component: ApplicationComponent, canActivate: [AuthGuard]},
      { path: 'Fonction', component: FonctionComponent, canActivate: [AuthGuard]},
      { path: 'Permission', component: PermissionComponent, canActivate: [AuthGuard]},
      { path: 'Role', component: RoleComponent ,canActivate: [AuthGuard]},
      { path: 'Utilisateur', component: UtilisateurComponent, canActivate: [AuthGuard]},
      { path: 'Profil', component: ModifierProfilComponent, canActivate: [AuthGuard] },
      { path: 'AuthentificationAppExterne/:url', component: AuthentificationAppExterneComponent },
      { path: 'InscriptionAppExterne/:url', component: InscriptionAppExterneComponent },
      { path: 'EmailConfirmationAppExterne/:url', component: EmailConfirmationAppExterne },
      { path: 'ForgotPasswordAppExterne/:url', component: ForgotPasswordAppExterne },
      { path: 'ResetPasswordAppExterne/:url', component: ResetPasswordAppExterneComponent },
      { path: 'TwoStepVerificationAppExterne/:url', component: TwoStepVerificationAppExterneComponent },
      { path: '**', redirectTo: 'AccueilPrincipale' }
    ],{ enableTracing: false }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:44429", "localhost:44424"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [UtilisateurService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule{}



import { Component, NgModule, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { RoleService } from '../../Services/role.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from './../../auth/login.interface';
import { Response } from './../../auth/response.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilisateurApplicationService } from '../../Services/utilisateurapplication.service';
import { ApplicationService } from '../../Services/application.service';
import { JournalisationService } from '../../Services/journalisation.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from '../../../environments/environment';
import { Journalisation } from '../../Models/journalisation.model';
declare const FB: any;


@Component({
  selector: 'app-AuhtentificationAppExterne',
  templateUrl: './AuthentificationAppExterne.component.html',
})

export class AuthentificationAppExterneComponent implements OnInit {
  private googleClientId = environment.googleClientId;
  private linkedInClientId = environment.linkedInClientId;
  private urlCallback = "https://localhost:44429/LinkedIn";
  private journal: Journalisation = new Journalisation(); 
  loginForm!: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;
  urlAppExterne= "";


  constructor(private UAService: UtilisateurApplicationService, private RoleService: RoleService, private router: Router, private location: Location, private http: HttpClient
    ,private UtilisateurService: UtilisateurService, private route: ActivatedRoute, private ApplicationService: ApplicationService, private JournalisationService: JournalisationService){}



  ngOnInit(): void {
    const fullPath = this.location.path(); 
    const parts = fullPath.split('/'); 
    if (parts.length > 0) { this.urlAppExterne = parts[parts.length - 1]; }

    this.journal.application = this.urlAppExterne;
    this.journal.dateConnexion = new Date();

    this.loginForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      const renderOptions = { type: "icon", shape: "circle", theme: "outline", size: "large", width: "100%" };
      const targetElement = document.getElementById("cnx-google");
      if (targetElement) {
        targetElement.style.opacity = "0";
        targetElement.style.marginBottom = "-40px";
      }
      // @ts-ignore
      google.accounts.id.renderButton(targetElement, renderOptions);
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => { });
    }
  }

  redirectInscription() {
    this.router.navigate(['/InscriptionAppExterne/' + this.urlAppExterne]);
  }

  redirectForgotPassword() {
    this.router.navigate(['/ForgotPasswordAppExterne/' + this.urlAppExterne]);
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.ApplicationService.Recherche(this.urlAppExterne).subscribe((appdata) => {
      if (appdata[0].authGoogle === false) {
        this.showError = true;
        this.errorMessage = "l'authentification avec google est desactivé par l'administrateur pour cette application !"; this.ReseauSocialErreur();
      }
      else {
        this.UtilisateurService.LoginWithGoogle(response.credential).subscribe({
          next: (res: Response) => {
            localStorage.setItem("username", res.username);
            const username = localStorage.getItem("username");
            this.UtilisateurService.Recherche(username).subscribe((userdata) => {
              this.UAService.getListByUtilisateur(userdata[0].id).subscribe((uadata) => {
                this.ApplicationService.Recherche(this.urlAppExterne).subscribe((appdata) => {
                  let app = uadata.filter((uaApp) => uaApp.idApplication == appdata[0].id);
                  if (app.length < 1 || app.length == null) {
                    this.showError = true;
                    this.errorMessage = "Échec de l'authentification, vous n'êtes pas inscrit dans cette application !";
                    this.ReseauSocialErreur();
                    return;
                  }
                  if (app[0].acces === false || userdata[0].status === false || userdata[0].emailConfirmed === false ) {
                    this.showError = true;
                    if (userdata[0].status == false) { this.errorMessage = "Votre compte est désactivé !"; this.ReseauSocialErreur(); }
                    else if (app[0].acces == false) { this.errorMessage = "Vous n'avez pas l'autorisation d'accéder à cette application !"; this.ReseauSocialErreur(); }
                    else if (userdata[0].emailConfirmed === false) { this.errorMessage = "Veuillez confirmer votre inscription par email!"; this.ReseauSocialErreur(); }
                  }
                  else {
                    this.journal.guidUtilisateur = userdata[0].id;
                    this.JournalisationService.EnregistrementJournalisations(this.journal).subscribe({
                      next: () => {
                        window.location.href = "https://" + this.urlAppExterne + "?username=" + res.username + "&isAuthSuccessful=" + res.isAuthSuccessful + "&token=" + res.token;                            
                      },
                      error: (err: HttpErrorResponse) => {
                        this.errorMessage = `Échec de redirection vers ${this.urlAppExterne} ` + err.message + "! problème de journalisation !";
                        this.showError = true;
                        this.ReseauSocialErreur();
                      }
                    });
                  }
                });
              });
            });
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = `Échec de l'authentification ,les identifiants de votre compte google sont inexistants dans l'application !`;
            this.showError = true;
            this.ReseauSocialErreur();
          }
        });
      }
    });
  }


  cnxFacebook() {
    this.ApplicationService.Recherche(this.urlAppExterne).subscribe((appdata) => {
      if (appdata[0].authFacebook === false) {
        this.showError = true;
        this.errorMessage = "l'authentification avec facebook est desactivé par l'administrateur pour cette application!";
        this.ReseauSocialErreur();
      }
      else {
        FB.login((result: any) => {
          this.UtilisateurService.LoginWithFacebook(result.authResponse.accessToken).subscribe({
            next: (res: Response) => {
              localStorage.setItem("username", res.username);
              const username = localStorage.getItem("username");
              this.UtilisateurService.Recherche(username).subscribe((userdata) => {
                this.UAService.getListByUtilisateur(userdata[0].id).subscribe((uadata) => {
                  this.ApplicationService.Recherche(this.urlAppExterne).subscribe((appdata) => {
                    let app = uadata.filter((uaApp) => uaApp.idApplication == appdata[0].id);
                    if (app.length < 1 || app.length == null) {
                      this.showError = true;
                      this.errorMessage = "Échec de l'authentification, vous n'êtes pas inscrit dans cette application !";
                      this.ReseauSocialErreur();
                      return;
                    }
                    if (app[0].acces === false || userdata[0].status === false || userdata[0].emailConfirmed === false ) {
                      this.showError = true;
                      if (userdata[0].status == false) { this.errorMessage = "Votre compte est désactivé !"; this.ReseauSocialErreur(); }
                      else if (app[0].acces == false) { this.errorMessage = "Vous n'avez pas l'autorisation d'accéder à cette application !"; this.ReseauSocialErreur(); }
                      else if (userdata[0].emailConfirmed === false) { this.errorMessage = "Veuillez confirmer votre inscription par email!"; this.ReseauSocialErreur(); }
                    }
                    else {
                      this.journal.guidUtilisateur = userdata[0].id;
                      this.JournalisationService.EnregistrementJournalisations(this.journal).subscribe({ 
                        next: () => {
                          window.location.href = "https://" + this.urlAppExterne + "?username=" + res.username + "&isAuthSuccessful=" + res.isAuthSuccessful + "&token=" + res.token;                            
                        }, 
                        error: (err: HttpErrorResponse) => {
                           this.errorMessage = `Échec de redirection vers ${this.urlAppExterne} ` + err.message + "! problème de journalisation !";
                           this.showError = true;
                           this.ReseauSocialErreur();
                        }
                      });
                    }
                  });
                });
              });
            },
            error: (err: HttpErrorResponse) => {
              this.errorMessage = `Échec de l'authentification ,les identifiants de votre compte facebook sont inexistantes dans l'application !`;
              this.showError = true;
              this.ReseauSocialErreur();
            }
          })
          , { scope: 'email' }
        });
      }
    });
  }


  cnxLinkedIn() {
    this.ApplicationService.Recherche(this.urlAppExterne).subscribe((appdata) => {
      if (appdata[0].authLinkedIn === false) {
        this.showError = true;
        this.errorMessage = "l'authentification avec LinkedIn est desactivé par l'administrateur !";
        this.ReseauSocialErreur();
      }
      else {
        window.location.href = encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${this.linkedInClientId}&response_type=code&redirect_uri=${this.urlCallback}&scope=profile`);
      }
    });
  }


  ReseauSocialErreur = () => {
    const element = document.getElementById("userName") as HTMLInputElement;
    const element2 = document.getElementById('mdp') as HTMLInputElement;
    if (element && element2) { element.select(); element2.select(); element.select(); }
    this.UtilisateurService.clearCookies();
  }

  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)!.invalid && this.loginForm.get(controlName)!.touched
  }


  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)!.hasError(errorName)
  }


  loginUser = (loginFormValue : any) => {
    this.showError = false;
    const login = { ...loginFormValue };
    const userForAuth: Login = {
      userName: login.userName,
      password: login.password
    }
    this.UtilisateurService.login(userForAuth).subscribe({
      next: (res: Response) => {
          this.UtilisateurService.Recherche(login.userName).subscribe((userdata) => {
            localStorage.setItem("username", userdata[0].userName);          
            this.UAService.getListByUtilisateur(userdata[0].id).subscribe((uadata) => {
              this.ApplicationService.Recherche(this.urlAppExterne).subscribe((appdata) => {
                let app = uadata.filter((uaApp) => uaApp.idApplication == appdata[0].id);
                if (app.length < 1 || app.length == null) {
                  this.showError = true;
                  this.errorMessage = "Échec de l'authentification, vous n'êtes pas inscrit dans cette application !";
                  this.ReseauSocialErreur();
                  return;
                }
                if (app[0].acces === false || userdata[0].status === false || appdata[0].auth2FA === true || userdata[0].emailConfirmed === false) {
                  this.showError = true;
                  if (userdata[0].status === false) { this.errorMessage = "Votre compte est désactivé !"; }
                  else if (app[0].acces === false) { this.errorMessage = "Vous n'avez pas l'autorisation d'accéder à cette application !"; }
                  else if (userdata[0].emailConfirmed === false) { this.errorMessage = "Veuillez confirmer votre inscription par email!"; }
                  else if (appdata[0].auth2FA) {
                    this.router.navigate(['/TwoStepVerificationAppExterne/' + this.urlAppExterne],
                      { queryParams: { returnUrl: "/" + this.urlAppExterne, provider: "Email", email: userForAuth.userName } })
                  }
                }                
                else {
                  this.journal.guidUtilisateur = userdata[0].id;
                  this.JournalisationService.EnregistrementJournalisations(this.journal).subscribe({
                    next: () => {
                      window.location.href = "https://" + this.urlAppExterne + "?username=" + userdata[0].userName + "&isAuthSuccessful=" + res.isAuthSuccessful + "&token=" + res.token;                            
                    },
                    error: (err: HttpErrorResponse) => {
                      this.errorMessage = `Échec de redirection vers ${this.urlAppExterne} ` + err.message + "! problème de journalisation !";
                      this.showError = true;
                      this.ReseauSocialErreur();
                    }
                  });
                }
              });
            });
          });
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
        }
      })
  }





}



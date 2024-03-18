import { HttpErrorResponse } from '@angular/common/http';
import { IResetPassword } from '../../auth/resetPassword.interface';
import { UtilisateurService } from './../../Services/utilisateur.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasswordConfirmationValidatorService } from './../../auth/password-confirmation-validator.service';
import { JournalisationService } from '../../Services/journalisation.service';
import { ActionService } from '../../Services/action.service';
import { Action } from '../../Models/action.model';
import { Location } from '@angular/common';


@Component({
  selector: 'app-reset-passwordAppExterne',
  templateUrl: './reset-passwordAppExterne.component.html'
})

export class ResetPasswordAppExterneComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  showSuccess!: boolean;
  showError!: boolean;
  errorMessage!: string;
  private token!: string;
  private email!: string;
  urlAppExterne = "";

  constructor(private UtilisateurService: UtilisateurService, private passConfValidator: PasswordConfirmationValidatorService, private router: Router,
    private route: ActivatedRoute, private JournalisationService: JournalisationService, private ActionService: ActionService, private location: Location){}


  ngOnInit(): void {
    const fullPath = this.location.path();
    const parts = fullPath.split('/');
    if (parts.length > 0) { this.urlAppExterne = parts[parts.length - 1]; }

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.resetPasswordForm.get('confirm')!.setValidators([Validators.required,
    this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password')!)]);
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }


  validateControl = (controlName: string) => {
     return this.resetPasswordForm.get(controlName)!.invalid && this.resetPasswordForm.get(controlName)!.touched
  }

  hasError = (controlName: string, errorName: string) => {
     return this.resetPasswordForm.get(controlName)!.hasError(errorName)
  }

  redirectConnexion() {
    this.router.navigate(['/AuthentificationAppExterne/' + this.urlAppExterne]);
  }

  resetPassword = (resetPasswordFormValue: any) => {
    this.showError = this.showSuccess = false;
    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto: IResetPassword = {
       password: resetPass.password,
       confirmPassword: resetPass.confirm,
       token: this.token,
       email: this.email
    }
        this.UtilisateurService.resetPassword(resetPassDto).subscribe({
          next: (res: Response) => {
            this.showSuccess = true;
            const resetPasswordBtn = document.getElementById('resetPasswordBtn') as HTMLButtonElement;
            resetPasswordBtn.disabled = true;
            resetPasswordBtn.style.backgroundColor = 'lightgray';
            resetPasswordBtn.style.borderColor = '#111';
            resetPasswordBtn.style.color = '#100564';
            resetPasswordBtn.style.cursor = 'not-allowed';
            this.EnregistrerAction();
            window.location.href = "https://" + this.urlAppExterne
          },
          error: () => {
            if (resetPass.password.length < 6) {
              this.showError = true;
              this.errorMessage = "Le mot de passe doit contenir au moin 6 caractère !";
            }
            else { 
            this.showError = true;
            this.errorMessage = "Le lien de réinitialisation du mot de passe est expiré. Veuillez effectuer une nouvelle demande de réinitialisation si nécessaire.";
            }
          }
        });        
  }


  EnregistrerAction() {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a consulter la liste des applications `,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      })
    })
  }



}

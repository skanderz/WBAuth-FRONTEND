import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { IForgotPassword } from '../../auth/forgotPassword.interface';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-ForgotPasswordAppExterne',
  templateUrl: './forgot-passwordAppExterne.component.html',
})

export class ForgotPasswordAppExterne implements OnInit {
  forgotPasswordForm!: FormGroup;
  successMessage!: string;
  errorMessage!: string;
  showSuccess!: boolean;
  showError!: boolean;
  urlAppExterne = "";

  constructor(private UtilisateurService: UtilisateurService, private router: Router, private location: Location){}

  ngOnInit(): void {
    const fullPath = this.location.path();
    const parts = fullPath.split('/');
    if (parts.length > 0) { this.urlAppExterne = parts[parts.length - 1]; }

    this.forgotPasswordForm = new FormGroup({  email: new FormControl("", [Validators.required])   })
  }


  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.get(controlName)!.invalid && this.forgotPasswordForm.get(controlName)!.touched
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.get(controlName)!.hasError(errorName)
  }

  redirectConnexion() {
    this.router.navigate(['/AuthentificationAppExterne/' + this.urlAppExterne]);
  }


  public forgotPassword = (forgotPasswordFormValue: any) => {
    this.showError = this.showSuccess = false;
    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: IForgotPassword = {
      email: forgotPass.email,
      clientURI: 'https://localhost:44429/ResetPasswordAppExterne/' + this.urlAppExterne
    }  
    this.UtilisateurService.forgotPassword(forgotPassDto).subscribe({
        next: (_) => {
          this.showSuccess = true;
          this.successMessage = 'Le lien a été envoyé, veuillez vérifier votre courrier électronique pour réinitialiser votre mot de passe.';
            const forgotPasswordBtn = document.getElementById('forgotPasswordBtn') as HTMLButtonElement;
              forgotPasswordBtn.disabled = true;
              forgotPasswordBtn.style.backgroundColor = 'lightgray';
              forgotPasswordBtn.style.borderColor = '#111';
              forgotPasswordBtn.style.color = '#100564';
              forgotPasswordBtn.style.cursor = 'not-allowed';
        },
        error: (err: HttpErrorResponse) => {
          this.showError = true;
          this.errorMessage = "Veuillez saisir un email valide !";
        }
    })
  }




}


import { HttpErrorResponse } from '@angular/common/http';
import { Response } from '../../auth/response.interface';
import { TwoFactor } from '../../auth/twoFactor.interface';
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
  selector: 'app-two-step-verificationAppExterne',
  templateUrl: './two-step-verificationAppExterne.component.html'
})

export class TwoStepVerificationAppExterneComponent implements OnInit {
  private provider!: string;
  private email!: string;
  private returnUrl!: string;
  twoStepForm!: FormGroup;
  showError!: boolean;
  showSuccess!: boolean;
  errorMessage!: string;
  urlAppExterne = "";

  constructor(private UtilisateurService: UtilisateurService, private passConfValidator: PasswordConfirmationValidatorService, private router: Router,
    private route: ActivatedRoute, private JournalisationService: JournalisationService, private ActionService: ActionService, private location: Location){}


  ngOnInit(): void {
    const fullPath = this.location.path();
    const parts = fullPath.split('/');
    if (parts.length > 0) { this.urlAppExterne = parts[parts.length - 1]; }

    this.twoStepForm = new FormGroup({
      twoFactorCode: new FormControl('', [Validators.required]),
    });
    this.provider = this.route.snapshot.queryParams['provider'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.UtilisateurService.Recherche(this.route.snapshot.queryParams['email']).subscribe((data) => {
      this.email = data[0].email;
    })
  }

  validateControl = (controlName: string) => {
    return this.twoStepForm.get(controlName)!.invalid && this.twoStepForm.get(controlName)!.touched
  }

  hasError = (controlName: string, errorName: string) => {
    return this.twoStepForm.get(controlName)!.hasError(errorName)
  }

  loginUser = (twoStepFormValue : any) => {
    this.showError = false;
    const formValue = { ...twoStepFormValue };
    let twoFactorDto: TwoFactor = {
      email: this.email,
      provider: this.provider,
      code: formValue.twoFactorCode
    }
    this.UtilisateurService.twoStepLogin(twoFactorDto).subscribe({
      next: (res: Response) => {
          this.showSuccess = true;
          window.location.href = "https://" + this.urlAppExterne + "?username=" + res.username + "&isAuthSuccessful=" + res.isAuthSuccessful + "&token=" + res.token;                            
        },
      error: (err: HttpErrorResponse) => {
          this.errorMessage = "Vérification du code échouée !";
          this.showError = true;
        }
      })
  }




}





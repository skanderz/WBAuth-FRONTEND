import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule ,Location } from '@angular/common';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { Utilisateur } from '../../Models/utilisateur.model';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Response } from './../../auth/response.interface';


@Component({
  selector: 'app-InscriptionAppExterne',
  templateUrl: './InscriptionAppExterne.component.html',
})

export class InscriptionAppExterneComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  showError!: boolean;
  urlAppExterne = "";


  constructor(private authService: UtilisateurService, private router: Router, private location: Location){}

  ngOnInit(): void {
    this.authService.clearCookies();

    this.registerForm = new FormGroup({
      Nom: new FormControl('', [Validators.required]),
      Prenom: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      Confirm: new FormControl('' , [Validators.required]),
    });

    const fullPath = this.location.path();
    const parts = fullPath.split('/');
    if (parts.length > 0) {  this.urlAppExterne = parts[parts.length - 1]; }
  }


  redirectAuthentification() {
    this.router.navigate(['/AuthentificationAppExterne/' + this.urlAppExterne]);
  }

  public validateControl = (controlName: string) => {
     return this.registerForm.get(controlName)!.invalid && this.registerForm.get(controlName)!.touched
  }

  public comparePassword = (mdp: string, confirm: string) => {
    return (this.registerForm.get(mdp)!.value != this.registerForm.get(confirm)!.value) && this.registerForm.get(confirm)!.touched
  }
  

  public hasError = (controlName: string, errorName: string) => {
     return this.registerForm.get(controlName)!.hasError(errorName)
  }


  public registerUser = (registerFormValue: any) => {
    const formValues = { ...registerFormValue };
    if (formValues.Nom && formValues.Prenom && formValues.Email) {
      if (formValues.Confirm == formValues.Password) {
        const user: any = {
          nom: formValues.Nom,
          prenom: formValues.Prenom,
          email: formValues.Email,
          Password: formValues.Password,
          userName: formValues.userName,
          dateInscription: new Date(),
          status: true,
        };
        this.authService.InscriptionAppExterne(user, this.urlAppExterne).subscribe({
          next: () => {
            this.redirectAuthentification();
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = err.message;
            this.showError = true;
          }
        });
      }
      else alert('Confirmation de mot de passe incorrecte');
    }
    else alert('Registration failed');
  }




}



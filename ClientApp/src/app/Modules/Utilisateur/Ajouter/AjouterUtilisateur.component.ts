import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../../Models/utilisateur.model';
import { UtilisateurApplicationService } from '../../../Services/utilisateurapplication.service';
import { UtilisateurApplication } from '../../../Models/utilisateurapplication.model';
import { Application } from '../../../Models/application.model';
import { ApplicationService } from '../../../Services/application.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { JournalisationService } from '../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';



@Component({
  selector: 'app-AjouterUtilisateur',
  templateUrl: './AjouterUtilisateur.component.html'
})
export class AjouterUtilisateurComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  showError!: boolean;

  constructor(private UtilisateurService: UtilisateurService, private UAService: UtilisateurApplicationService, private ActionService: ActionService
    ,private ApplicationService: ApplicationService, private router: Router, private authService: UtilisateurService, private JournalisationService: JournalisationService){} 


  ngOnInit(): void {
    this.registerForm = new FormGroup({
      Nom: new FormControl('', [Validators.required]),
      Prenom: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      Confirm: new FormControl('', [Validators.required]),
    });
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


  EnregistrerAction(nomUtilisateur: string | null ,email:string | null) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a ajouter l'utilisateur '${nomUtilisateur}' avec l'email '${email}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
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
        console.log(user);
        this.authService.Inscription(user).subscribe({
          next: (res: Response) => {
            this.router.navigate(['/Utilisateur']);
            alert('Ajout de l\'utilisateur effectuée avec succès!');
            this.EnregistrerAction(user.userName ,user.email);
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

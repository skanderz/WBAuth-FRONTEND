import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FonctionService } from '../../../Services/fonction.service';
import { Fonction } from '../../../Models/fonction.model';
import { ApplicationService } from '../../../Services/application.service'; 
import { Application } from '../../../Models/application.model';
import { JournalisationService } from '../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';



@Component({
  selector: 'app-AjouterFonction',
  templateUrl: './AjouterFonction.component.html'
})
export class AjouterFonctionComponent implements OnInit{
  public fonction: Fonction = new Fonction();
  public applications: Application[] = []; 
  public IdApp: number = 0;
  public rech: string = "";
  errorMessage: string = '';
  showError: boolean = false;

  constructor(private FonctionService: FonctionService, private applicationService: ApplicationService ,private router: Router
  ,private JournalisationService: JournalisationService, private ActionService: ActionService, private UtilisateurService: UtilisateurService){}


  ngOnInit(): void {  this.loadApplications()  }


  loadApplications() {
    this.applicationService.getApplications().subscribe((data) => { this.applications = data; },
      (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
  }


  getSelectedApplicationId(): any {
    const selectedApplication = this.applications.find((app) => app.nom === this.rech); 
    if (selectedApplication) return selectedApplication.id; else return 0; 
  }


  EnregistrerAction(IdApp: number ,type: string | null ,nom: string | null){
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a ajouter une fonction ${type} avec le nom '${nom}' de l'application avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      })
    })
  }


  onSubmit(){
    this.showError = false;  
    this.IdApp = this.getSelectedApplicationId();
    this.fonction.idApplication = this.IdApp;
    this.FonctionService.Recherche(this.fonction.nom, this.IdApp).subscribe((data) => {
      if(data.length != 0){
        this.errorMessage = "Une fonction avec ce nom existe déjà dans l'application choisit !";
        this.showError = true;  
      }
      else {
        this.showError = false;  
        this.FonctionService.addFonction(this.fonction, this.IdApp).subscribe((response) => {
          if (response) {
            this.router.navigate(['/Fonction']);
            this.EnregistrerAction(this.IdApp, this.fonction.type ,this.fonction.nom);
          }
        });
      }
    });
  }



}

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../../../Services/role.service';
import { Role } from '../../../Models/role.model';
import { ApplicationService } from '../../../Services/application.service';
import { Application } from '../../../Models/application.model';
import { JournalisationService } from '../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';


@Component({
  selector: 'app-AjouterRole',
  templateUrl: './AjouterRole.component.html'
})
export class AjouterRoleComponent implements OnInit{
  public Role: Role = new Role();
  public applications: Application[] = [];
  public IdApp: number = 0;
  public rech: string = "";
  errorMessage: string = '';
  showError: boolean = false;
  constructor(private RoleService: RoleService, private applicationService: ApplicationService, private router: Router, private ActionService: ActionService
     ,private JournalisationService: JournalisationService , private UtilisateurService: UtilisateurService){}



  ngOnInit(): void { this.loadApplications(); this.Role.niveau = 1; }


  loadApplications() {
    this.applicationService.getApplications().subscribe((data) => { this.applications = data; },
      (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
  }


  getSelectedApplicationId(): any {
    const selectedApplication = this.applications.find((app) => app.nom === this.rech);
    console.log(selectedApplication);
    if (selectedApplication) return selectedApplication.id; else return 0;
  }


  EnregistrerAction(IdApp: number, nomRole: string | null){
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a ajouter le role '${nomRole}' dans l'application avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


  onSubmit() {
    this.IdApp = this.getSelectedApplicationId();
    this.Role.idApplication = this.IdApp;
    this.RoleService.Recherche(this.Role.nom, this.IdApp).subscribe((data) => {
      if (data.length != 0) {
        this.errorMessage = "Un role avec ce nom existe déjà dans l'application choisit !";
        this.showError = true;
      }
      else {
        this.showError = false;
        this.RoleService.addRole(this.Role).subscribe((response) => {
          if (response) {
            this.router.navigate(['/Role']);
            this.EnregistrerAction(this.IdApp, this.Role.nom);
          }
        });
        console.log(this.Role);
      }
    });
  }




}

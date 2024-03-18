import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PermissionService } from '../../../Services/permission.service';
import { Permission } from '../../../Models/permission.model';
import { ApplicationService } from '../../../Services/application.service';
import { Application } from '../../../Models/application.model';
import { Role } from '../../../Models/role.model';
import { Fonction } from '../../../Models/fonction.model';
import { FonctionService } from '../../../Services/fonction.service';
import { RoleService } from '../../../Services/role.service';
import { JournalisationService } from './../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';


@Component({
  selector: 'app-AjouterPermission',
  templateUrl: './AjouterPermission.component.html'
})
export class AjouterPermissionComponent implements OnInit{
   permission: Permission = new Permission();
   applications: Application[] = [];
   application: Application = new Application();
   roles: Role[] = [];
   role: Role = new Role();
   fonctions: Fonction[] = [];
   fonction: Fonction = new Fonction();
   IdApp: number = 0;
   IdFonction: number = 0;
   IdRole: number = 0;
   rechApp: string = "";
   rechFonction: string = "";
   rechRole: string = "";
   errorMessage: string = '';
   showError: boolean = false;

  constructor(private PermissionService: PermissionService, private fonctionService: FonctionService, private roleService: RoleService,
    private applicationService: ApplicationService, private router: Router, private JournalisationService: JournalisationService, private ActionService: ActionService,
    private UtilisateurService: UtilisateurService){}



  ngOnInit(): void { this.loadApplications() }


  loadApplications() {
    this.applicationService.getApplications().subscribe((data) => { this.applications = data;  },
      (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
  }


  getSelectedApplicationId(): any {
    const selectedApplication = this.applications.find((app) => app.nom === this.rechApp);
    if (selectedApplication) {
      this.IdApp = selectedApplication.id;
      this.fonctionService.getFonctions(this.IdApp).subscribe((data) => { this.fonctions = data; },
        (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
      this.roleService.getRoles(this.IdApp).subscribe((data) => { this.roles = data; },
        (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
      return selectedApplication.id;
    } else return 0;
  }

  
  getSelectedFonctionId(): any {
    const selectedFonction = this.fonctions.find((fn) => fn.nom === this.rechFonction);
    if (selectedFonction) return selectedFonction.id; else return 0;
  }

  getSelectedRoleId(): any {
    const selectedRole = this.roles.find((r) => r.nom === this.rechRole);
    if (selectedRole) return selectedRole.id; else return 0;
  }


  EnregistrerAction(IdApp: number, nomApp:string ,nomRole: string) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a ajouter une permission du role '${nomRole}' dans l'application '${nomApp}' avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


  onSubmit() {
    this.permission.idFonction = this.getSelectedFonctionId();
    this.permission.idRole = this.getSelectedRoleId();
    this.PermissionService.RechFonctionUnique(this.permission.nom, this.IdApp, this.permission.idRole).subscribe((PermUniqueList) => {
      this.PermissionService.RechMultiFonction(this.permission.nom, this.IdApp, this.permission.idRole).subscribe((PermMultiList) => {
        if (PermUniqueList.length != 0 || PermMultiList.length != 0) {
          this.errorMessage = "Une permission avec ce nom existe déjà dans l'application " + this.rechApp + " avec le role " + this.rechRole + " !";
          this.showError = true;
        }
        else {
          this.PermissionService.addPermission(this.permission).subscribe((response) => {
            if (response) {
              this.router.navigate(['/Permission']);
              this.EnregistrerAction(this.IdApp ,this.rechApp ,this.rechRole);
            }
          });
          console.log(this.permission);
        }
      });
    });
  }







}

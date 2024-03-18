import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationService } from '../../Services/application.service';
import { Application } from '../../Models/application.model';
import { RoleService } from '../../Services/role.service';
import { Role } from '../../Models/role.model';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from './../../Services/utilisateur.service';
import { JournalisationService } from '../../Services/journalisation.service';
import { ActionService } from '../../Services/action.service';
import { Action } from '../../Models/action.model';
import { PermissionService } from '../../Services/permission.service';
import { Permission } from '../../Models/permission.model';


@Component({
  selector: 'app-Application',
  templateUrl: './Application.component.html'
})

export class ApplicationComponent implements OnInit {
  read: boolean = true;
  modify: boolean = false;
  add: boolean = false;
  delete: boolean = false;
  applications: any[] = [];
  application: Application = new Application();
  rech: string = '';
  AppParDefaut: any = {
    nom: "WBAuth", url: "www.wbauth.com", auth2FA: true, authGoogle: true, authFacebook: true, authLinkedIn: true,
  }
  RoleParDefaut: any = {
    nom: "Utilisateur", niveau: 1, idApplication: 0
  }


  constructor(private roleService: RoleService, private applicationService: ApplicationService, private JournalisationService: JournalisationService
    ,private router: Router, private route: ActivatedRoute, private ActionService: ActionService, private UtilisateurService: UtilisateurService
    ,private PermissionService: PermissionService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
    this.loadApplications();
  }


  setPermissionsByRole() {
    this.applicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        let role = localStorage.getItem("role");
        this.roleService.Recherche(role, dataApp[0].id).subscribe((dataRole) => {
          if (dataRole && dataRole.length == 1) {
            this.PermissionService.getListeMultiFonction(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Gestion des applications") {
                  if (perm.status[0] === "0") { this.read = false; }
                  if (perm.status[1] === "1") { this.add = true; }
                  if (perm.status[2] === "1") { this.modify = true; }
                  if (perm.status[3] === "1") { this.delete = true; }
                }
              }
            })
          }
        })
      }
    });
  }


  loadApplications() {
    this.applicationService.getApplications().subscribe((data) => {
      this.applications = data;
      const app = this.applications.filter(app => app.url.toLowerCase() === 'www.wbauth.com');
      if (app.length == 0) {
        this.applicationService.addApplication(this.AppParDefaut).subscribe(() => { 
          this.applicationService.Recherche("www.wbauth.com").subscribe((data) => {
            this.RoleParDefaut.idApplication = data[0].id;
            this.roleService.addRole(this.RoleParDefaut).subscribe(() => {});
          });
        });
      }
    },
    (error) => { console.error('Erreur lors de la récupération des applications : ', error);});
  }


  Recherche(){
    if (this.rech === "") { this.loadApplications(); }
    else {
      this.applicationService.getApplications().subscribe((data) => {
        this.applications = data;
        this.applications = this.applications.filter(app => {
          return app.nom.toLowerCase().includes(this.rech.toLowerCase()) || app.url.toLowerCase().includes(this.rech.toLowerCase());
        });
      });
    }
  }


  onModifierClick(id: number) { this.router.navigate(['Application/ModifierApplication', id]); }


  deleteApplication(id: number) {
    this.applicationService.getApplication(id).subscribe((data) => {
      if (data.url.toLowerCase() == "www.wbauth.com") {
        alert("l'application WBAuth est insupprimable ,car c'est l'application elle-même en cours d'utilisation");
      }
      else {
        if (confirm('Voulez-vous vraiment supprimer cette application ?')) {
          this.applicationService.deleteApplication(id).subscribe(() => {
            this.loadApplications();
            this.EnregistrerAction(id);
          });
        }
      }
   });
  }


  EnregistrerAction(IdApp : number) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a supprimer l'application avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      })
    })
  }


}



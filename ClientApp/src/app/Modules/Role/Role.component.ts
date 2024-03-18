import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../Models/role.model';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../Services/role.service';
import { Application } from '../../Models/application.model';
import { ApplicationService } from '../../Services/application.service';
import { JournalisationService } from '../../Services/journalisation.service';
import { UtilisateurService } from './../../Services/utilisateur.service';
import { ActionService } from '../../Services/action.service';
import { Action } from '../../Models/action.model';
import { PermissionService } from '../../Services/permission.service';
import { Permission } from '../../Models/permission.model';


@Component({
  selector: 'app-Role',
  templateUrl: './Role.component.html'
})
export class RoleComponent {
  Roles: any[] = [];
  applications: any[] = [];
  rech: string = '';
  IdApp: number = 0;
  read: boolean = true;
  modify: boolean = false;
  add: boolean = false;
  delete: boolean = false;

  constructor(private RoleService: RoleService, private ApplicationService: ApplicationService, private router: Router, private route: ActivatedRoute
    ,private ActionService: ActionService, private JournalisationService: JournalisationService, private UtilisateurService: UtilisateurService
    ,private PermissionService: PermissionService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
    this.ApplicationService.getApplications().subscribe((data) => {
      this.applications = data
      if (this.applications && this.applications.length > 0) {
        this.IdApp = this.applications[0].id;
        this.loadRoles();
      }
    },
      (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
  }


  setPermissionsByRole() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        let role = localStorage.getItem("role");
        this.RoleService.Recherche(role, dataApp[0].id).subscribe((dataRole) => {
          if (dataRole && dataRole.length == 1) {
            this.PermissionService.getListeMultiFonction(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Gestion des roles") {
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


  loadRoles() {
    if (this.applications.length > 0) {
      this.RoleService.getRoles(this.IdApp).subscribe((data) => { this.Roles = data; },
        (error) => { console.error('Erreur lors de la récupération des Roles : ', error); });
    }
  }



  Recherche() {
    if (this.rech == "") { this.loadRoles(); }
    else {
      this.RoleService.getRoles(this.IdApp).subscribe((data) => {
        this.Roles = data;
        this.Roles = this.Roles.filter(r => { return r.nom.toLowerCase().includes(this.rech.toLowerCase()); });
      });
    }
  }


  onModifierClick(id: number) { this.router.navigate(['Role/ModifierRole', id]); }


  deleteRole(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce Role ?')) {
      this.RoleService.deleteRole(id, this.IdApp).subscribe(() => {
        this.loadRoles();
        this.EnregistrerAction(id,this.IdApp);
      });
    }
  }


  EnregistrerAction(id:number ,IdApp:number) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a supprimer le role avec l'id '${id}' dans l'application avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }



}






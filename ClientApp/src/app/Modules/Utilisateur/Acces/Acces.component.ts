import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../../Models/utilisateur.model';
import { Role } from '../../../Models/role.model';
import { Application } from '../../../Models/application.model';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../../Services/utilisateur.service';
import { RoleService } from '../../../Services/role.service';
import { ApplicationService } from '../../../Services/application.service';
import { UtilisateurApplicationService } from '../../../Services/utilisateurapplication.service';
import { UtilisateurApplication } from '../../../Models/utilisateurapplication.model';
import { PermissionService } from '../../../Services/permission.service';


@Component({
  selector: 'app-Acces',
  templateUrl: './Acces.component.html'
})
export class AccesComponent implements OnInit {
  Utilisateurs: any[] = [];
  IdApp: number = 0;
  applications: any[] = [];
  UtilisateurApp: UtilisateurApplication = new UtilisateurApplication();
  UtilisateurApps: UtilisateurApplication[] = [];
  application: Application = new Application();
  accesTable: { guid: string, userName: string, acces: boolean, role: string }[] = [];
  rechTable: { guid: string, userName: string, acces: boolean, role: string }[] = [];
  AltTable: { guid: string, userName: string, acces: boolean, role: string }[] = [];
  userAppList: any[] = [];
  utilisateurs: any[] = [];
  roles: any[] = [];
  rech: string = "";
  read: boolean = true;
  modify: boolean = true;

  constructor(private UAService: UtilisateurApplicationService, private ApplicationService: ApplicationService, private RoleService: RoleService,
    private UtilisateurService: UtilisateurService, private router: Router, private route: ActivatedRoute, private PermissionService: PermissionService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
    this.ApplicationService.getApplications().subscribe((data) => {
      this.applications = data
      if (this.applications && this.applications.length > 0) {
        this.IdApp = this.applications[0].id;
        this.loadUtilisateursByIdApp(this.IdApp);
        this.loadUtilisateurs();
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
            this.PermissionService.getListeFonctionUnique(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Consulter la liste des accès utilisateurs") {
                  if (perm.status === "0") { this.read = false; }
                }
                if (perm.nom == "Modifier la liste des accès d'un utilisateur") {
                  if (perm.status === "0") { this.modify = false; }
                }
              }
            })
          }
        })
      }
    });
  }


  loadUtilisateurs() {
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      this.Utilisateurs = data; // userlist
      for (const user of this.Utilisateurs) { // chaque user
        this.UAService.getListByUtilisateur(user.id).subscribe((UAdata) => {
          this.ApplicationService.getApplications().subscribe((AppData) => {
            this.applications = AppData; // App list 
            for (const app of this.applications) {
              if (app.url === "www.wbauth.com") {
                this.UtilisateurApps = UAdata;  // userApp list
                const result = this.UtilisateurApps.filter((ua) => (ua.guidUtilisateur === user.id) && (ua.idApplication === app.id));
                if (result.length === 0) {
                  this.UtilisateurApp.idRole = null;
                  this.UtilisateurApp.idApplication = app.id;
                  this.UtilisateurApp.guidUtilisateur = user.id;
                  this.UAService.AddUtilisateurApplication(this.UtilisateurApp).subscribe((response) => {
                    if (response) { console.log(this.UtilisateurApp); }
                  });
                }
              }
            }
          });
        });
      }
    }, (error) => { console.error('Erreur lors de la récupération des Utilisateur : ', error); });
  }


  loadUtilisateursByIdApp(id: number) {
    this.accesTable = [];
    this.UAService.getListByApplication(id).subscribe((UAdata) => {
      this.userAppList = UAdata;
      for (const ua of this.userAppList) {
        this.UtilisateurService.getUtilisateur(ua.guidUtilisateur).subscribe((UserData) => {
          if (ua.idRole == null) {
            this.accesTable.push({ guid: UserData.id, userName: UserData.userName, acces: ua.acces, role: "non effectuée" });
          }
          else {
            this.RoleService.getRole(ua.idRole).subscribe((RoleData) => {
              this.accesTable.push({ guid: UserData.id, userName: UserData.userName, acces: ua.acces, role: RoleData.nom  });
            })
          };
        });
      }
    });
  }


  Recherche(){
    if (this.rech == "") {  this.loadUtilisateursByIdApp(this.IdApp);  }
    else {
      if (this.AltTable.length == 0) this.AltTable = this.accesTable;
      this.rechTable = this.AltTable.filter(ua => {
        return ua.userName.toLowerCase().includes(this.rech.toLowerCase()) || ua.guid.toLowerCase().includes(this.rech.toLowerCase());
      });
      this.accesTable = [];
      this.accesTable = this.accesTable.concat(this.rechTable);
      this.rechTable = [];
    }     
  }


  onModifierClick(id: string) { this.router.navigate(['Utilisateur/ModifierAcces', id]); }




}


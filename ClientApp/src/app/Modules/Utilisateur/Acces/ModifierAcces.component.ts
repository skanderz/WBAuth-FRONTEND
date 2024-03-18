import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { JournalisationService } from '../../../Services/journalisation.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';

@Component({
  selector: 'app-ModifierAcces',
  templateUrl: './ModifierAcces.component.html'
})

export class ModifierAccesComponent implements OnInit {
  Role: Role = new Role();
  User: Utilisateur = new Utilisateur();
  UserApp: UtilisateurApplication = new UtilisateurApplication();
  UserApps: any[] = [];
  utilisateurs: any[] = [];
  tabRoles: any[] = [];
  applications: any[] = [];
  rechRole: string = "";
  SelectedRoleChange?: any;
  accesTable: {
    idUA:any ,idApp: number, nomApplication: string, url: string, acces: any, nomRole: string;
    roles: { id: number, nom: string, niveau?: number | null }[];
  }[] = [];

  constructor(private UAService: UtilisateurApplicationService, private ApplicationService: ApplicationService, private route: ActivatedRoute,
    private RoleService: RoleService, private UtilisateurService: UtilisateurService, private router: Router,
    private ActionService: ActionService, private JournalisationService: JournalisationService){}


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam != null) {
      const guid = idParam;
      if (guid != null) {
        this.UtilisateurService.getUtilisateur(guid).subscribe((UserData) => {
          this.User = UserData
          this.loadUtilisateursByIdUser(guid);
        });
      }  else { console.error('La valeur du paramètre "id" n\'est pas une valeur valide.'); }
    }  else { console.error('Le paramètre "id" est manquant dans l\'URL.'); }
  }


  loadUtilisateursByIdUser(idUser: string) {
    this.accesTable = [];
    this.UAService.getListByUtilisateur(idUser).subscribe((UAdata) => {
      this.UserApps = UAdata;
      for (const ua of this.UserApps) {
        if (ua.idRole == null) {
          this.ApplicationService.getApplication(ua.idApplication).subscribe((AppData) => {
            this.RoleService.getRoles(ua.idApplication).subscribe((RoleData) => {
                const nvElement = {
                  idUA: ua.id ,idApp: AppData.id, nomApplication: AppData.nom, url: AppData.url, acces: ua.acces,
                  roles: [] as any ,nomRole: "Rôle non effectué"
                }
              for (const r of RoleData) {
                nvElement.roles.push({ id: r.id,  nom: r.nom, niveau: r.niveau });
              }
              this.accesTable.push(nvElement);
            });
          });
        }

        else {
          this.ApplicationService.getApplication(ua.idApplication).subscribe((AppData) => {
            this.RoleService.getRole(ua.idRole).subscribe((RoleData) => {
              this.RoleService.getRoles(ua.idApplication).subscribe((TRoleData) => {
                const nvElement = {
                  idUA: ua.id, idApp: AppData.id, nomApplication: AppData.nom, url: AppData.url, acces: ua.acces,
                  roles: [] as any[] ,nomRole:RoleData.nom
                }
                for (const r of TRoleData) {
                  if (r.nom == nvElement.nomRole) { ;}
                  nvElement.roles.push({ id: r.id, nom: r.nom, niveau: r.niveau });
                }
                this.accesTable.push(nvElement);
              });
            });
          });
        }

      }
    });
  }


  EnregistrerAction() {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a modifié l'accès/role de l'utilisateur '${this.User.userName}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }

  onRoleSelect(event: Event, selectedRow: any) {
    const selectedRoleId = parseInt((event.target as HTMLSelectElement).value, 10);
    if (selectedRoleId) {
      this.UserApp.id = selectedRow.idUA;
      this.UserApp.idApplication = selectedRow.idApp;
      this.UserApp.guidUtilisateur = this.User.id;
      this.UserApp.idRole = selectedRoleId;
      this.UserApp.acces = selectedRow.acces;
      this.UtilisateurService.getUtilisateur(this.UserApp.guidUtilisateur).subscribe((userdata) => {
        if (localStorage.getItem("username") == userdata.userName) {
          if (confirm('C\'est votre compte ,Êtes-vous sûr(e) de changer votre rôle ?')) {
            this.UAService.updateUtilisateurApplication(this.UserApp).subscribe(() => {
              this.RoleService.getRole(this.UserApp.idRole).subscribe((roledata) => {
                localStorage.setItem("role" ,roledata.nom);
                this.EnregistrerAction();
                location.reload();
              })
            });
          }
        }
      })
    }
  }


  onAccesSelect(event: Event, selectedRow: any) {
    console.log(selectedRow);
    const target = event.target as HTMLElement;
    const span = target.querySelector('span');
    if (span?.textContent === '✔' && selectedRow.acces == true) { selectedRow.acces = '✖'; target.style.backgroundColor = 'red'; }
    else if (span?.textContent === '✖' && selectedRow.acces == false) { selectedRow.acces = '✔'; target.style.backgroundColor = '#128d3a'; }
    this.UAService.getUtilisateurApplication(selectedRow.idUA).subscribe((data) => {
      this.UserApp = data;
      if (selectedRow) {
        let uaData: UtilisateurApplication = new UtilisateurApplication();
        uaData.id = selectedRow.idUA;
        uaData.idApplication = selectedRow.idApp;
        uaData.guidUtilisateur = this.User.id;
        uaData.idRole = this.UserApp.idRole;
        this.UtilisateurService.getUtilisateur(uaData.guidUtilisateur).subscribe((userdata) => {
          if (localStorage.getItem("username") == userdata.userName) {
            if (confirm('C\'est votre compte ,Êtes-vous sûr(e) de changer votre accès a l\'application ' + selectedRow.url + ' !')) {
              if (selectedRow.acces == '✖') uaData.acces = false; else if (selectedRow.acces == '✔') uaData.acces = true;
              for (let t of this.accesTable) {
                if (t.idApp == uaData.idApplication) {
                  if (uaData.acces == false) t.acces = false; else if (uaData.acces == true) t.acces = true;
                }
              }
              this.UAService.updateUtilisateurApplication(uaData).subscribe(() => {
                if (uaData.acces === false && selectedRow.url == "www.wbauth.com") {
                  this.UtilisateurService.logout();
                  location.reload();
                }
                this.EnregistrerAction();
              });
            }
          }
          else {
            if (selectedRow.acces == '✖') uaData.acces = false; else if (selectedRow.acces == '✔') uaData.acces = true;
            for (let t of this.accesTable) {
              if (t.idApp == uaData.idApplication) {
                if (uaData.acces == false) t.acces = false; else if (uaData.acces == true) t.acces = true;
              }
            }
            this.UAService.updateUtilisateurApplication(uaData).subscribe(() => {  this.EnregistrerAction();  });
          }
        });
      }
    });
  }










}



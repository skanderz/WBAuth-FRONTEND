import { NgZone ,ChangeDetectorRef ,Component, Inject, ElementRef, ViewChild, AfterViewInit ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../Models/role.model';
import { RoleService } from '../../Services/role.service';
import { Application } from '../../Models/application.model';
import { ApplicationService } from '../../Services/application.service';
import { Permission } from '../../Models/permission.model';
import { PermissionService } from '../../Services/permission.service';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalisationService } from '../../Services/journalisation.service';
import { UtilisateurService } from './../../Services/utilisateur.service';
import { ActionService } from '../../Services/action.service';
import { Action } from '../../Models/action.model';
import { FonctionService } from '../../Services/fonction.service';
import { Fonction } from '../../Models/fonction.model';


@Component({
  selector: 'app-Permission',
  templateUrl: './Permission.component.html'
})
export class PermissionComponent implements OnInit {
  @ViewChild('table2', { static: false }) table2: ElementRef | undefined;
  @ViewChild('table1', { static: false }) table1: ElementRef | undefined;
  permission: Permission = new Permission();
  roles: any[] = [];
  applications: any[] = [];
  multiPermissions: any[] = [];
  uniquePermissions: any[] = [];
  rechApp: string = '';
  rechRole: string = '';
  rechFonctionMulti: string = '';
  rechFonctionUnique: string = '';
  IdApp: number = 0;
  IdRole: number = 0;
  i: number = 0;
  listePermissionsPredefini: any[] = [];
  read: boolean = true;
  modify: boolean = false;
  add: boolean = false;
  delete: boolean = false;

  constructor(private PermissionService: PermissionService, private RoleService: RoleService, private route: ActivatedRoute, private router: Router,
    private ApplicationService: ApplicationService, private JournalisationService: JournalisationService, private ActionService: ActionService,
    private UtilisateurService: UtilisateurService, private FonctionService: FonctionService, private cdr: ChangeDetectorRef, private ngZone: NgZone){}


  ngOnInit(): void {
    this.ajouterListePermissionsPredefini();
    this.setPermissionsByRole();
    this.ApplicationService.getApplications().subscribe((data) => {
      this.applications = data;
      if (this.applications && this.applications.length > 0) {
        this.IdApp = this.applications[0].id;
        this.rechApp = this.applications[0].nom;
        this.RoleService.getRoles(this.IdApp).subscribe((data) => {
          this.roles = data;
          this.IdRole = this.roles[0].id;
          this.rechRole = this.roles[0].nom;
          this.loadPermissions();
        })
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
                if (perm.nom == "Gestion des permissions") {
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


  loadApplications(){
    this.ApplicationService.getApplications().subscribe((data) => { this.applications = data; },
      (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
  }


  getSelectedApplicationId(): any {
    const selectedApplication = this.applications.find((app) => app.nom === this.rechApp);
    if (selectedApplication) {
      this.IdApp = selectedApplication.id;
      this.RoleService.getRoles(this.IdApp).subscribe((data) => {
        this.roles = data;
        this.IdRole = this.roles[0].id;
        this.rechRole = this.roles[0].nom;
        this.loadPermissions();
      },
        (error) => { console.error('Erreur lors de la récupération des roles : ', error); });
      return selectedApplication.id;
    } else return 0;
  }

  getSelectedRoleId(): any {
    const selectedRole = this.roles.find((r) => r.nom === this.rechRole);
    if (selectedRole) {
      this.IdRole = selectedRole.id;
      this.loadPermissions();
      return selectedRole.id;
    } else return 0;
  }

  loadPermissions() {
    if (this.applications.length > 0 && this.roles.length > 0){
      this.PermissionService.getListeMultiFonction(this.IdApp, this.IdRole).subscribe((data) => { this.multiPermissions = data; },
        (error) => { console.error('Erreur lors de la récupération des Permissions : ', error); });
      this.PermissionService.getListeFonctionUnique(this.IdApp, this.IdRole).subscribe((data) => { this.uniquePermissions = data; },
        (error) => { console.error('Erreur lors de la récupération des Permissions : ', error); });
    }
  }


  RechMultiFonction(){
    if (this.rechFonctionMulti == "") this.loadPermissions();
    else {
      this.PermissionService.getListeMultiFonction(this.IdApp, this.IdRole).subscribe((data) => {
        this.multiPermissions = data;
        this.multiPermissions = this.multiPermissions.filter(perm => {
          return perm.nom.toLowerCase().includes(this.rechFonctionMulti.toLowerCase());
        });
      });
    }
  }


  RechFonctionUnique() {
    if (this.rechFonctionUnique == "") this.loadPermissions();
    else {
      this.PermissionService.getListeFonctionUnique(this.IdApp, this.IdRole).subscribe((data) => {
        this.uniquePermissions = data;
        this.uniquePermissions = this.uniquePermissions.filter(perm => {
          return perm.nom.toLowerCase().includes(this.rechFonctionUnique.toLowerCase());
        });
      });
    }
  }


  onModifierAccesFonctionMulti(index: number, perm: Permission, event: Event): void {
    if (!this.modify) {
      const cells = document.querySelectorAll('td.acces');
      cells.forEach(cell => {
        if (cell.classList.contains('acces')) {
          const htmlCell = cell as HTMLTableCellElement;
          htmlCell.classList.add("no-select");
          htmlCell.style.cursor = "not-allowed";
        }
      });
    }
    else {
      this.i = index;
      const target = event.target as HTMLElement;
      const span = target.querySelector('span');
      if (span?.textContent === '✔') { span.textContent = '✖'; target.style.backgroundColor = 'red'; }
      else if (span?.textContent === '✖') { span.textContent = '✔'; target.style.backgroundColor = '#128d3a'; }
      this.PermissionService.ModifierAcces(this.IdApp, this.i, perm).subscribe(() => {
        this.loadPermissions();
        this.EnregistrerAction(this.IdApp, this.IdRole, "MultiFonction", perm);
      });
    }
  }


  onModifierAccesFonctionUnique(perm: Permission, event: Event): void {
    if (!this.modify) {
      const cells = document.querySelectorAll('td.acces');
      cells.forEach(cell => {
        if (cell.classList.contains('acces')) {
          const htmlCell = cell as HTMLTableCellElement;
          htmlCell.classList.add("no-select");
          htmlCell.style.cursor = "not-allowed";
        }
      });
    }
    else {
      const target = event.target as HTMLElement;
      const span = target.querySelector('span');
      if (span?.textContent === '✔' && perm.status == "1") { span.textContent = '✖'; target.style.backgroundColor = 'red'; }
      else if (span?.textContent === '✖' && perm.status == "0") { span.textContent = '✔'; target.style.backgroundColor = '#128d3a'; }
      this.PermissionService.ModifierAcces(this.IdApp, this.i, perm).subscribe(() => {
        this.loadPermissions();
        this.EnregistrerAction(this.IdApp, this.IdRole, "Fonction Unique", perm);
      });
    }
  }


  onModifierClick(id: number) { this.router.navigate(['Permission/ModifierPermission', id]); }


  EnregistrerActionSupp(id: number) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a supprimer la permission avec l'id '${id}' du role '${this.rechRole}' dans l'application '${this.rechApp}' avec l'id '${this.IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


  deletePermission(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce Permission ?')) {
      this.PermissionService.deletePermission(id).subscribe(() => {
        this.loadPermissions();
        this.EnregistrerActionSupp(id);
      });
    }
  }


  scrollToTable2() {  if (this.table2) { this.table2.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
  scrollToTable1() {  if (this.table1) { this.table1.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}



  EnregistrerAction(IdApp: number ,IdRole: number ,type: string ,perm: Permission){
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        if (type === "MultiFonction"){
          const action: Action = {
            id: 0, application: "www.wbauth.com", date: new Date(),
            description: `l'utilisateur ${username} a modifier la permission '${perm.nom}' du role avec l'id '${IdRole}' de l'application avec l'id '${IdApp}'  `,
            idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
          }
          this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
        }
        else if (type === "Fonction Unique"){
          const action: Action = {
            id: 0, application: "www.wbauth.com", date: new Date(),
            description: `l'utilisateur ${username} a modifier la permission '${perm.nom}' du role avec l'id '${IdRole}' de l'application avec l'id '${IdApp}'  `,
            idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
          }
          this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
        }
      })
    })
  }


  ajouterListePermissionsPredefini() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        this.RoleService.getRoles(dataApp[0].id).subscribe((dataRoles) => {
          for (const role of dataRoles) {
            if (role.nom == "Utilisateur" || role.nom == "utilisateur") {
              this.listePermissionsPredefini = [];
              this.listePermissionsPredefini.push(
                new Permission(0, 'Gestion des applications', '100000', role.id, role, 0, null),
                new Permission(0, 'Gestion des fonctions', '100000', role.id, role, 0, null),
                new Permission(0, 'Gestion des roles', '100000', role.id, role, 0, null),
                new Permission(0, 'Gestion des permissions', '100000', role.id, role, 0, null),
                new Permission(0, 'Gestion des utilisateurs', '100000', role.id, role, 0, null),
                new Permission(0, 'Consulter la liste des accès utilisateurs', '0', role.id, role, 0, null),
                new Permission(0, 'Modifier la liste des accès d\'un utilisateur', '0', role.id, role, 0, null),
                new Permission(0, 'Consulter la journalisation d\'un utilisateur', '0', role.id, role, 0, null),
                new Permission(0, 'Éditer les informations du compte', '1', role.id, role, 0, null),
              );
              for (const perm of this.listePermissionsPredefini) {
                if (perm.status.length > 2) {
                  this.PermissionService.RechMultiFonction(perm.nom, dataApp[0].id, role.id).subscribe((dataPermission) => {
                    if (dataPermission && dataPermission.length < 1) {
                      this.FonctionService.Recherche(perm.nom, dataApp[0].id).subscribe((dataFonction) => {
                        perm.idFonction = dataFonction[0].id;
                        perm.Fonction = dataFonction[0];
                        this.PermissionService.addPermission(perm).subscribe(() => { });
                      });
                    }
                  });
                }
                else if (perm.status.length < 2) {
                  this.PermissionService.RechFonctionUnique(perm.nom, dataApp[0].id, role.id).subscribe((dataPermission) => {
                    if (dataPermission && dataPermission.length < 1) {
                      this.FonctionService.Recherche(perm.nom, dataApp[0].id).subscribe((dataFonction) => {
                        perm.idFonction = dataFonction[0].id;
                        perm.Fonction = dataFonction[0];
                        this.PermissionService.addPermission(perm).subscribe(() => { });
                      });   
                    }    
                  });  
                }   
              }    
            }

            else if (role.nom == "Administrateur" || role.nom == "administrateur") {
              this.listePermissionsPredefini = [];
              this.listePermissionsPredefini.push(
                new Permission(0, 'Gestion des applications', '100000', role.id, role, 0, null),
                new Permission(0, 'Gestion des fonctions', '100011', role.id, role, 0, null),
                new Permission(0, 'Gestion des roles', '100011', role.id, role, 0, null),
                new Permission(0, 'Gestion des permissions', '100011', role.id, role, 0, null),
                new Permission(0, 'Gestion des utilisateurs', '111111', role.id, role, 0, null),
                new Permission(0, 'Consulter la liste des accès utilisateurs', '1', role.id, role, 0, null),
                new Permission(0, 'Modifier la liste des accès d\'un utilisateur', '1', role.id, role, 0, null),
                new Permission(0, 'Consulter la journalisation d\'un utilisateur', '1', role.id, role, 0, null),
                new Permission(0, 'Éditer les informations du compte', '1', role.id, role, 0, null),
              );
              for (const perm of this.listePermissionsPredefini) {
                if (perm.status.length > 2) {
                  this.PermissionService.RechMultiFonction(perm.nom, dataApp[0].id, role.id).subscribe((dataPermission) => {
                    if (dataPermission && dataPermission.length < 1) {
                      this.FonctionService.Recherche(perm.nom, dataApp[0].id).subscribe((dataFonction) => {
                        perm.idFonction = dataFonction[0].id;
                        perm.Fonction = dataFonction[0];
                        this.PermissionService.addPermission(perm).subscribe(() => { });
                      });
                    }
                  });
                }
                else if (perm.status.length < 2) {
                  this.PermissionService.RechFonctionUnique(perm.nom, dataApp[0].id, role.id).subscribe((dataPermission) => {
                    if (dataPermission && dataPermission.length < 1) {
                      this.FonctionService.Recherche(perm.nom, dataApp[0].id).subscribe((dataFonction) => {
                        perm.idFonction = dataFonction[0].id;
                        perm.Fonction = dataFonction[0];
                        this.PermissionService.addPermission(perm).subscribe(() => { });
                      });
                    }
                  });
                }
              }
            }

            else if (role.nom == "Super-Administrateur" || role.nom == "Super-administrateur" || role.nom == "super-administrateur"
              || role.nom == "Super Administrateur" || role.nom == "Super administrateur" || role.nom == "super administrateur") {
              this.listePermissionsPredefini = [];
              this.listePermissionsPredefini.push(
                new Permission(0, 'Gestion des applications', '111111', role.id, role, 0, null),
                new Permission(0, 'Gestion des fonctions', '111111', role.id, role, 0, null),
                new Permission(0, 'Gestion des roles', '111111', role.id, role, 0, null),
                new Permission(0, 'Gestion des permissions', '111111', role.id, role, 0, null),
                new Permission(0, 'Gestion des utilisateurs', '111111', role.id, role, 0, null),
                new Permission(0, 'Consulter la liste des accès utilisateurs', '1', role.id, role, 0, null),
                new Permission(0, 'Modifier la liste des accès d\'un utilisateur', '1', role.id, role, 0, null),
                new Permission(0, 'Consulter la journalisation d\'un utilisateur', '1', role.id, role, 0, null),
                new Permission(0, 'Éditer les informations du compte', '1', role.id, role, 0, null),
              );
              for (const perm of this.listePermissionsPredefini) {
                if (perm.status.length > 2) {
                  this.PermissionService.RechMultiFonction(perm.nom, dataApp[0].id, role.id).subscribe((dataPermission) => {
                    if (dataPermission && dataPermission.length < 1) {
                      this.FonctionService.Recherche(perm.nom, dataApp[0].id).subscribe((dataFonction) => {
                        perm.idFonction = dataFonction[0].id;
                        perm.Fonction = dataFonction[0];
                        this.PermissionService.addPermission(perm).subscribe(() => { });
                      });
                    }
                  });
                }
                else if (perm.status.length < 2) {
                  this.PermissionService.RechFonctionUnique(perm.nom, dataApp[0].id, role.id).subscribe((dataPermission) => {
                    if (dataPermission && dataPermission.length < 1) {
                      this.FonctionService.Recherche(perm.nom, dataApp[0].id).subscribe((dataFonction) => {
                        perm.idFonction = dataFonction[0].id;
                        perm.Fonction = dataFonction[0];
                        this.PermissionService.addPermission(perm).subscribe(() => { });
                      });
                    }
                  });
                }
              }
            }

          }   
        });  
      }    
    });  
  }






}

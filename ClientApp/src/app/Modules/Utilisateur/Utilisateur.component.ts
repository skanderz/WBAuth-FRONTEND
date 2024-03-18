import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { UtilisateurApplicationService } from '../../Services/utilisateurapplication.service';
import { UtilisateurApplication } from '../../Models/utilisateurapplication.model';
import { ApplicationService } from '../../Services/application.service';
import { JournalisationService } from '../../Services/journalisation.service';
import { ActionService } from '../../Services/action.service';
import { Action } from '../../Models/action.model';
import { PermissionService } from '../../Services/permission.service';
import { Permission } from '../../Models/permission.model';
import { RoleService } from '../../Services/role.service';


@Component({
  selector: 'app-Utilisateur',
  templateUrl: './Utilisateur.component.html'
})
export class UtilisateurComponent {
  Utilisateurs: any[] = [];
  rech: string = "";
  IdApp: number = 0;
  applications: any[] = [];
  UtilisateurApp: UtilisateurApplication = new UtilisateurApplication(); 
  UtilisateurApps: UtilisateurApplication[] = [];
  read: boolean = true;
  modify: boolean = false;
  add: boolean = false;
  delete: boolean = false;

  constructor(private UAService: UtilisateurApplicationService, private ApplicationService: ApplicationService
    ,private UtilisateurService: UtilisateurService, private router: Router, private route: ActivatedRoute,private RoleService: RoleService
    ,private ActionService: ActionService, private JournalisationService: JournalisationService ,private PermissionService: PermissionService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
    this.loadUtilisateur();
  }

  setPermissionsByRole() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        let role = localStorage.getItem("role");
        this.RoleService.Recherche(role, dataApp[0].id).subscribe((dataRole) => {
          if (dataRole && dataRole.length == 1) {
            this.PermissionService.getListeMultiFonction(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Gestion des utilisateurs") {
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

  loadUtilisateur(){
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      this.Utilisateurs = data;   
    }, (error) => { console.error('Erreur lors de la récupération des Utilisateur : ', error); });
  }
  

  Recherche(){
    if (this.rech == "") this.loadUtilisateur();
    else {
      this.UtilisateurService.getUtilisateurs().subscribe((data) => {
        this.Utilisateurs = data;
        this.Utilisateurs = this.Utilisateurs.filter(user => {
          return user.userName.toLowerCase().includes(this.rech.toLowerCase()) ||
                 user.email.toLowerCase().includes(this.rech.toLowerCase()) ||
                 user.id.toLowerCase().includes(this.rech.toLowerCase());
        });
      });
    }
  }


  onModifierClick(id:string) { this.router.navigate(['Utilisateur/ModifierUtilisateur', id]); }


  deleteUtilisateur(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce utilisateur ?')) {
      this.UtilisateurService.getUtilisateur(id).subscribe((data) => {
        if (localStorage.getItem("username") == data.userName) {
          if(confirm('C\'est votre compte ,Êtes-vous sûr(e) de vouloir le supprimer ?')){ 
            this.UtilisateurService.deleteUtilisateur(id).subscribe(() => {
              this.UtilisateurService.logout();
              this.router.navigate(['/AccueilPrincipale']);
            });
          }
        }
        else {
          this.UtilisateurService.deleteUtilisateur(id).subscribe(() => {
            this.loadUtilisateur();
            this.EnregistrerAction(id);
          });
        }
      });
    }
  }


  EnregistrerAction(id:string) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a supprimer l'utilisateur avec l'id '${id}' de tout les applications`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


}






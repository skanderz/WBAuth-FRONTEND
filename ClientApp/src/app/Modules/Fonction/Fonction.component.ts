import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fonction } from '../../Models/fonction.model';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FonctionService } from '../../Services/fonction.service';
import { Application } from '../../Models/application.model';
import { ApplicationService } from '../../Services/application.service';
import { JournalisationService } from '../../Services/journalisation.service';
import { UtilisateurService } from './../../Services/utilisateur.service';
import { ActionService } from '../../Services/action.service';
import { Action } from '../../Models/action.model';
import { PermissionService } from '../../Services/permission.service';
import { Permission } from '../../Models/permission.model';
import { RoleService } from '../../Services/role.service';
import { Role } from '../../Models/role.model';


@Component({
  selector: 'app-Fonction',
  templateUrl: './Fonction.component.html'
})
export class FonctionComponent {
  perm: Permission = new Permission();
  fonctions: any[] = [];
  applications: any[] = []; 
  rech: string = '';
  IdApp: number = 0;
  listeFonctionsPredefini: any[] = [];
  read: boolean = true;
  modify: boolean = false;
  add: boolean = false;
  delete: boolean = false;


  constructor(private FonctionService: FonctionService, private ApplicationService: ApplicationService, private router: Router, private route: ActivatedRoute
             ,private JournalisationService: JournalisationService, private ActionService: ActionService, private UtilisateurService: UtilisateurService
             ,private PermissionService: PermissionService, private RoleService: RoleService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
    this.ApplicationService.getApplications().subscribe((data) => {
      this.applications = data
      if (this.applications && this.applications.length > 0) {
        this.IdApp = this.applications[0].id;
        this.ajouterListeFonctionsPredefini();
        this.loadFonctions();
      }
    },
      (error) => {  console.error('Erreur lors de la récupération des applications : ', error);});
  }

  setPermissionsByRole() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        let role = localStorage.getItem("role");
        this.RoleService.Recherche(role, dataApp[0].id).subscribe((dataRole) => {
          if (dataRole && dataRole.length == 1) {
            this.PermissionService.getListeMultiFonction(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Gestion des fonctions") {
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

  loadFonctions() {
    if (this.applications.length > 0) {
      this.FonctionService.getFonctions(this.IdApp).subscribe((data) => {
        this.fonctions = data;
      },
      (error) => { console.error('Erreur lors de la récupération des Fonctions : ', error); }); }
  }


  Recherche(){
    if (this.rech == "") { this.loadFonctions(); }
    else {
      this.FonctionService.getFonctions(this.IdApp).subscribe((data) => {
        this.fonctions = data;
        this.fonctions = this.fonctions.filter(fonc => { return fonc.nom.toLowerCase().includes(this.rech.toLowerCase()); });
      });
    }
  }


  onModifierClick(id: number) { this.router.navigate(['Fonction/ModifierFonction', id]); }


  deleteFonction(id: number){
    if (confirm('Voulez-vous vraiment supprimer cette Fonction ?')) {
      this.FonctionService.deleteFonction(id, this.IdApp).subscribe(() => {
        this.loadFonctions();
        this.EnregistrerAction(this.IdApp, id);
      });
    }
  }


  EnregistrerAction(IdApp: number ,IdFonction: number ) {
  let username = localStorage.getItem("username");
  this.UtilisateurService.Recherche(username).subscribe((data) => {
    this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
      let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
      const action: Action = {
         id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a supprimer la fonction avec l'id '${IdFonction}' de l'application avec l'id '${IdApp}'`,
         idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
      }
      this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      })
    })
  }


  ajouterListeFonctionsPredefini() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        this.listeFonctionsPredefini.push(
          new Fonction(0, 'Gestion des applications', 'Multifonctions', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Gestion des fonctions', 'Multifonctions', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Gestion des roles', 'Multifonctions', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Gestion des permissions', 'Multifonctions', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Gestion des utilisateurs', 'Multifonctions', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Consulter la liste des accès utilisateurs', 'Fonction Unique', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Modifier la liste des accès d\'un utilisateur', 'Fonction Unique', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Consulter la journalisation d\'un utilisateur', 'Fonction Unique', '', this.perm, dataApp[0].id, dataApp[0]),
          new Fonction(0, 'Éditer les informations du compte', 'Fonction Unique', '', this.perm, dataApp[0].id, dataApp[0]),
        );
        for (const fonction of this.listeFonctionsPredefini) {
          this.FonctionService.Recherche(fonction.nom, dataApp[0].id).subscribe((data) => {
            if (data && data.length < 1) {
              this.FonctionService.addFonction(fonction, dataApp[0].id).subscribe(() => { });
            }
          });
        }
      }
    })
  }


}


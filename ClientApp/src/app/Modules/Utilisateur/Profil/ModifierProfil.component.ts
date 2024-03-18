import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../../Services/utilisateur.service';
import { Utilisateur } from '../../../Models/utilisateur.model';
import { JournalisationService } from '../../../Services/journalisation.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';
import { PermissionService } from '../../../Services/permission.service';
import { RoleService } from '../../../Services/role.service';
import { ApplicationService } from '../../../Services/application.service';


@Component({
  selector: 'app-ModifierProfil',
  templateUrl: './ModifierProfil.component.html'
})

export class ModifierProfilComponent implements OnInit {
  Utilisateur: Utilisateur = new Utilisateur();
  Utilisateurs: any[] = [];
  UserUpdate!: {
    userName: string | null;
    nom: string | null;
    prenom: string | null;
    email: string | null;
    status: boolean | null;
  }; 
  choix: number = 1;
  errorMessage: string = '';
  showError: boolean = false;
  oldEmail: string | null = "";
  oldUserName: string | null = "";
  read: boolean = true;

  constructor(private UtilisateurService: UtilisateurService, private router: Router, private route: ActivatedRoute, private PermissionService: PermissionService, 
    private ActionService: ActionService, private JournalisationService: JournalisationService, private ApplicationService: ApplicationService,
    private RoleService: RoleService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
    const username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.Utilisateurs = data;
      this.Utilisateur = this.Utilisateurs[0];
      this.oldEmail = this.Utilisateur.email;
      this.oldUserName = this.Utilisateur.userName;
      this.UserUpdate = { userName: "", nom: "", prenom: "", email: "", status: true };
    });
  }


  setPermissionsByRole() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        let role = localStorage.getItem("role");
        this.RoleService.Recherche(role, dataApp[0].id).subscribe((dataRole) => {
          if (dataRole && dataRole.length == 1) {
            this.PermissionService.getListeFonctionUnique(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Éditer les informations du compte") {
                  if (perm.status === "0") { this.read = false; }
                }
              }
            })
          }
        })
      }
    });
  }


  EnregistrerAction(nomUtilisateur: string | null, email: string | null) {
    let desc = "";
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        if (nomUtilisateur != this.oldUserName && email != this.oldEmail) { desc = `l'utilisateur ${username} a modifié son nom d'utilisateur de '${this.oldUserName}' à ${nomUtilisateur} et son email de '${this.oldEmail}' à '${email}'}` }
        else if (nomUtilisateur != this.oldUserName) { desc = `l'utilisateur ${username} a modifié son nom d'utilisateur de '${this.oldUserName}' à ${nomUtilisateur}` }
        else if (email != this.oldEmail) { desc = `l'utilisateur ${username} a modifié son email de '${this.oldEmail}' à '${email}'` }
        else if (nomUtilisateur == this.oldUserName && email == this.oldEmail) { desc = `l'utilisateur ${username} son nom et/ou son prenom` }
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: desc, idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


  onSubmit() {
    this.showError = false;
    this.UserUpdate.userName = this.Utilisateur.userName;
    this.UserUpdate.email = this.Utilisateur.email;
    this.UserUpdate.nom = this.Utilisateur.nom;
    this.UserUpdate.prenom = this.Utilisateur.prenom;
    this.UserUpdate.status = this.Utilisateur.status;
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      const checkEmail = data.find((user) => { return user.email.toLowerCase() === this.UserUpdate.email!.toLowerCase(); });
      const checkUserName = data.find((user) => { return user.userName.toLowerCase() === this.UserUpdate.userName!.toLowerCase(); });
      console.log(checkEmail);
      if (checkEmail != null && this.UserUpdate.email != this.oldEmail) {
        this.errorMessage = "Un utilisateur avec l'email '" + this.UserUpdate.email + "' existe déjà dans l'application !";
        this.showError = true;
      }
      else if (checkUserName != null && this.UserUpdate.userName != this.oldUserName) {
        this.errorMessage = "Un utilisateur avec le nom d'utilisateur '" + this.UserUpdate.userName + "' existe déjà dans l'application !";
        this.showError = true;
      }
      else {
        this.UtilisateurService.updateUtilisateur(this.Utilisateur.id, this.UserUpdate).subscribe((response) => {
          if (response) {
            if (this.UserUpdate.userName) localStorage.setItem("username", this.UserUpdate.userName);
            this.router.navigate(['/Chargement']);            
            this.EnregistrerAction(this.UserUpdate.nom, this.UserUpdate.email);
          }
        });
      }
    });
  }



}



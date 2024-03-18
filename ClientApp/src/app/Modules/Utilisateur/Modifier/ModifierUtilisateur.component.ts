import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from '../../../Models/utilisateur.model';
import { RoleService } from '../../../Services/role.service';
import { ApplicationService } from '../../../Services/application.service';
import { Role } from '../../../Models/role.model';
import { Application } from '../../../Models/application.model';
import { JournalisationService } from '../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';

@Component({
  selector: 'app-ModifierUtilisateur',
  templateUrl: './ModifierUtilisateur.component.html'
})

export class ModifierUtilisateurComponent implements OnInit {
  Utilisateur: Utilisateur = new Utilisateur();
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

  constructor(private UtilisateurService: UtilisateurService, private router: Router, private route: ActivatedRoute,
    private ActionService: ActionService, private JournalisationService: JournalisationService){}


  ngOnInit(): void {
    this.UserUpdate = { userName: null, nom: null, prenom: null, email: null, status: null }
    console.log(this.route.snapshot.params);
    const idParam = this.route.snapshot.paramMap.get('idUtilisateur');
    if (idParam != null) {
      const guid = idParam;
      if (guid != null) {
        this.UtilisateurService.getUtilisateur(guid).subscribe((data) => {
          if (data) {
            this.Utilisateur = data;
            this.oldEmail = this.Utilisateur.email;
          }
        });
      }
      else { console.error('La valeur du paramètre "id" n\'est pas un nombre valide.'); }
    }
    else { console.error('Le paramètre "id" est manquant dans l\'URL.'); }
  }


  EnregistrerAction(nomUtilisateur: string | null, email: string | null) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a modifié l'utilisateur '${nomUtilisateur}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }

  onSubmit() {
    this.showError = false;
    if (this.choix == 1) this.Utilisateur.status = true;
    if (this.choix == 0) this.Utilisateur.status = false;
    this.UserUpdate.userName = this.Utilisateur.userName;
    this.UserUpdate.email = this.Utilisateur.email;
    this.UserUpdate.nom = this.Utilisateur.nom;
    this.UserUpdate.prenom = this.Utilisateur.prenom;
    this.UserUpdate.status = this.Utilisateur.status;
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      const user = data.find((user) => { return user.email.toLowerCase() === this.UserUpdate.email!.toLowerCase(); });
      if (user != null && this.UserUpdate.email != this.oldEmail) {
        this.errorMessage = "Un utilisateur avec l'email '" + this.UserUpdate.email + "' existe déjà dans l'application !";
        this.showError = true;
      }
      else {
        this.UtilisateurService.updateUtilisateur(this.Utilisateur.id, this.UserUpdate).subscribe((response) => {
          if (response) { 
            this.router.navigate(['/Utilisateur']);
            this.EnregistrerAction(this.UserUpdate.nom, this.UserUpdate.email);
          }
        });
      }
    });
  }




}



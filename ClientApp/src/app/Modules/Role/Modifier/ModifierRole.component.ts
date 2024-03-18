import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../Services/role.service';
import { ApplicationService } from '../../../Services/application.service';
import { Role } from '../../../Models/role.model';
import { Application } from '../../../Models/application.model';
import { JournalisationService } from '../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';

@Component({
  selector: 'app-ModifierRole',
  templateUrl: './ModifierRole.component.html'
})

export class ModifierRoleComponent implements OnInit {
  public Role: Role = new Role();
  public application: Application = new Application();
  IdApp: number = 0;
  oldRole: string | null = "";
  errorMessage: string = '';
  showError: boolean = false;
  constructor(private RoleService: RoleService, private ApplicationService: ApplicationService, private router: Router, private route: ActivatedRoute,
  private ActionService: ActionService, private JournalisationService: JournalisationService , private UtilisateurService: UtilisateurService){}


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (!isNaN(id)) {
        this.RoleService.getRole(id).subscribe((data) => {
          if (data) { this.Role = data; console.log(data); this.oldRole = this.Role.nom }
          this.ApplicationService.getApplication(this.Role.idApplication).subscribe((data) => { if (data) { this.application = data; console.log(data); } });
        });
      }
      else { console.error('La valeur du paramètre "id" n\'est pas un nombre valide.'); }
    }
    else { console.error('Le paramètre "id" est manquant dans l\'URL.'); }
  }


  EnregistrerAction(IdApp: number, nomApp:string | null ,nomRole: string | null ,oldRole: string | null) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a modifié le role '${oldRole}' à '${nomRole}' dans l'application '${nomApp}' avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


  onSubmit() {
    this.showError = false;
    this.RoleService.Recherche(this.Role.nom, this.application.id).subscribe((data) => {
      if (data.length != 0 && this.Role.nom != this.oldRole) {
        this.errorMessage = "Un role avec ce nom existe déjà dans l'application " + this.application.nom + " !";
        this.showError = true;
      }
      else {
        this.RoleService.updateRole(this.Role.idApplication, this.Role).subscribe((response) => {
          if (response) {
            this.router.navigate(['/Role']);
            this.EnregistrerAction(this.application.id, this.application.nom, this.Role.nom, this.oldRole);
          }
        });
      }
    });
  }






}



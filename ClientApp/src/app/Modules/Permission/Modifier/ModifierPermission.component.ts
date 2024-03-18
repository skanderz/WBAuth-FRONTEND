import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../Services/permission.service';
import { FonctionService } from '../../../Services/fonction.service';
import { ApplicationService } from '../../../Services/application.service';
import { RoleService } from '../../../Services/role.service';
import { Permission } from '../../../Models/permission.model';
import { Fonction } from '../../../Models/fonction.model';
import { Role } from '../../../Models/role.model';
import { Application } from '../../../Models/application.model';
import { JournalisationService } from './../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';


@Component({
  selector: 'app-ModifierPermission',
  templateUrl: './ModifierPermission.component.html'
})
export class ModifierPermissionComponent implements OnInit {
  public permission: any;
  public role: Role = new Role();
  public fonction: Fonction = new Fonction();
  public application: Application = new Application();
  oldPermission: string | null = "";
  errorMessage: string = '';
  showError: boolean = false;
  constructor(private PermissionService: PermissionService, private FonctionService: FonctionService, private RoleService:RoleService
     ,private ApplicationService: ApplicationService, private router: Router, private route: ActivatedRoute, private JournalisationService: JournalisationService,
      private ActionService: ActionService, private UtilisateurService: UtilisateurService){}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (!isNaN(id)) {
        this.PermissionService.getMultiFonction(id).subscribe((data) => {
          if (data) {
            this.permission = data;
            this.oldPermission = this.permission.nom;
            this.FonctionService.getFonction(this.permission.idFonction).subscribe((data) => {
              if (data) { this.fonction = data; }
              this.ApplicationService.getApplication(this.fonction.idApplication).subscribe((data) => {
                if (data) {
                  this.application = data;
                  this.RoleService.getRole(this.permission.idRole).subscribe((data) => {
                    this.role = data;
                  });
                }
              });
            });
          }
          else {
            this.PermissionService.getFonctionUnique(id).subscribe((data) => {
              if (data) {
                this.permission = data;
                this.oldPermission = this.permission.nom;
                this.FonctionService.getFonction(this.permission.idFonction).subscribe((data) => {
                  if (data) { this.fonction = data; }
                  this.ApplicationService.getApplication(this.fonction.idApplication).subscribe((data) => {
                    if (data) {
                      this.application = data;
                      this.RoleService.getRole(this.permission.idRole).subscribe((data) => {
                        this.role = data;
                      });
                    }
                  });
                });
              }
            });
          }
        });
      }
      else { console.error('La valeur du paramètre "id" n\'est pas un nombre valide.'); }
    }
    else { console.error('Le paramètre "id" est manquant dans l\'URL.'); }
  }


  EnregistrerAction(IdApp: number, nomApp: string | null, nomRole: string | null) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a modifié la permission du role '${nomRole}' dans l'application '${nomApp}' avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      });
    });
  }


  onSubmit() {
    this.PermissionService.RechFonctionUnique(this.permission.nom, this.application.id, this.permission.idRole).subscribe((PermUniqueList) => {
      this.PermissionService.RechMultiFonction(this.permission.nom, this.application.id, this.permission.idRole).subscribe((PermMultiList) => {
        if (PermUniqueList.length != 0 && this.oldPermission || PermMultiList.length != 0 && this.permission.nom != this.oldPermission) {
          this.errorMessage = "Une permission avec ce nom existe déjà avec le role " + this.role.nom + " !";
          this.showError = true;
        }
        else {
          this.PermissionService.updatePermission(this.permission).subscribe((response) => {
            if (response) {
              console.log(this.permission);
              this.router.navigate(['/Permission']);
              this.EnregistrerAction(this.application.id, this.application.nom, this.role.nom);
            }
          });
        }
      });
    });
  }






}



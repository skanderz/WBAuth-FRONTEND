import { Component, Inject, ElementRef, ViewChild ,OnInit } from '@angular/core';
import { Utilisateur } from '../../../Models/utilisateur.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../../Services/utilisateur.service';
import { JournalisationService } from '../../../Services/journalisation.service';
import { ActionService } from '../../../Services/action.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PermissionService } from '../../../Services/permission.service';
import { RoleService } from '../../../Services/role.service';
import { ApplicationService } from '../../../Services/application.service';


@Component({
  selector: 'app-Activite',
  templateUrl: './Activite.component.html'
})
export class ActiviteComponent implements OnInit {
  @ViewChild('tab2', { static: false }) tab2: ElementRef | undefined;
  @ViewChild('tab1', { static: false }) tab1: ElementRef | undefined;
  rechUtilisateur: string = "";
  rechJournalisation: string = "";
  rechAction: string = "";
  Utilisateur: Utilisateur = new Utilisateur();
  Journalisations: any[] = [];
  JournalisationsActions: any[] = [];
  JournalisationsActionsRech: any[] = [];
  Actions: any[] = [];
  read: boolean = true;

  constructor(private JournalisationService: JournalisationService, private UtilisateurService: UtilisateurService, private ActionService: ActionService,
    private router: Router, private route: ActivatedRoute, private PermissionService: PermissionService, private ApplicationService: ApplicationService,
    private RoleService: RoleService){}


  ngOnInit(): void {
    this.setPermissionsByRole();
  }


  setPermissionsByRole() {
    this.ApplicationService.Recherche("www.wbauth.com").subscribe((dataApp) => {
      if (dataApp[0].url == "www.wbauth.com") {
        let role = localStorage.getItem("role");
        this.RoleService.Recherche(role, dataApp[0].id).subscribe((dataRole) => {
          if (dataRole && dataRole.length == 1) {
            this.PermissionService.getListeFonctionUnique(dataApp[0].id, dataRole[0].id).subscribe((dataPermission) => {
              for (const perm of dataPermission) {
                if (perm.nom == "Consulter la journalisation d'un utilisateur") {
                  if (perm.status === "0") { this.read = false; }
                }
              }
            })
          }
        })
      }
    });
  }


  loadJournalisation(){
    this.JournalisationService.getJournalisations(this.Utilisateur.id).subscribe((data) => {
      this.Journalisations = data;
    });
  }

  RechercheJournalisation() {
    this.Journalisations = []
    this.JournalisationService.getJournalisations(this.Utilisateur.id).subscribe((data) => {
      this.Journalisations = data;
      this.Journalisations = this.Journalisations.filter(j => {
        return j.dateConnexion.toLowerCase().includes(this.rechJournalisation.toLowerCase()) ||
          j.application.toLowerCase().includes(this.rechJournalisation.toLowerCase());
      });
    });
  }


  loadActions() {
    this.Actions = [];
    this.JournalisationsActions = [];
    this.JournalisationService.getJournalisations(this.Utilisateur.id).subscribe((data) => {
      this.JournalisationsActionsRech = data;
      this.JournalisationsActionsRech.forEach((journalisation) => {
        this.ActionService.getActions(journalisation.id).subscribe((dataActions) => {
          journalisation.actions = dataActions;
          this.JournalisationsActions = this.JournalisationsActionsRech.filter(j => { return j.actions && j.actions.length !== 0 });
        });
      });
    });
  }


  RechercheAction() {
    this.Actions = [];
    this.JournalisationsActions = [];
    this.JournalisationService.getJournalisations(this.Utilisateur.id).subscribe((data) => {
      this.JournalisationsActionsRech = data;
      this.JournalisationsActionsRech.forEach((journalisation) => {
        this.ActionService.getActions(journalisation.id).subscribe((dataActions) => {
          journalisation.actions = dataActions.filter(j => {
            return j.date.toLowerCase().includes(this.rechAction.toLowerCase()) ||
              j.application.toLowerCase().includes(this.rechAction.toLowerCase()) ||
              j.description.toLowerCase().includes(this.rechAction.toLowerCase());
          });
          this.JournalisationsActions = this.JournalisationsActionsRech.filter(j => { return j.actions && j.actions.length !== 0 });
        });
      });
    });
  }


  RechercheUtilisateur() {
    this.Journalisations = []
    this.Utilisateur.dateInscription = null;
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      for (const user of data) {
        if (this.rechUtilisateur === user.userName) {
          this.Utilisateur = user;
          this.loadJournalisation();
          this.loadActions();
        }
      }
    });
  }





  scrollToTab2(){ if (this.tab2) { this.tab2.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
  scrollToTab1(){ if (this.tab1) { this.tab1.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
}




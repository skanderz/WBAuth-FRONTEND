import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FonctionService } from '../../../Services/fonction.service';
import { ApplicationService } from '../../../Services/application.service';
import { Fonction } from '../../../Models/fonction.model';
import { Application } from '../../../Models/application.model';
import { JournalisationService } from '../../../Services/journalisation.service';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';


@Component({
  selector: 'app-ModifierFonction',
  templateUrl: './ModifierFonction.component.html'
})
export class ModifierFonctionComponent implements OnInit {
  public fonction: Fonction = new Fonction();
  public application: Application = new Application();
  oldName: string | null = "";
  errorMessage: string = '';
  showError: boolean = false;

  constructor(private FonctionService: FonctionService ,private ApplicationService: ApplicationService ,private router: Router, private route: ActivatedRoute
    ,private JournalisationService: JournalisationService, private ActionService: ActionService, private UtilisateurService: UtilisateurService){}


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (!isNaN(id)) {
        this.FonctionService.getFonction(id).subscribe((data) => {
          if (data) {
            this.fonction = data; console.log(data);
            this.oldName = this.fonction.nom;
            if (this.fonction.type === 'Multifonctions') { this.fonction.type = 'Multifonctions'; } else { this.fonction.type = 'Fonction Unique'; }
            this.ApplicationService.getApplication(this.fonction.idApplication).subscribe((data) => { if (data) { this.application = data; console.log(data); } });
          }
        });
      }
      else { console.error('La valeur du paramètre "id" n\'est pas un nombre valide.'); }
    }
    else { console.error('Le paramètre "id" est manquant dans l\'URL.'); }
  }


  EnregistrerAction(IdApp: number ,IdFonction: number ,nomApp :string | null) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a modifié une fonction avec l'id '${IdApp}' de l'application '${nomApp}' avec l'id '${IdApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      })
    })
  }


  onSubmit(){
    this.showError = false;
    this.FonctionService.Recherche(this.fonction.nom, this.application.id).subscribe((data) => {
      if (data.length != 0 && this.fonction.nom != this.oldName) {
        this.errorMessage = "Une fonction avec ce nom existe déjà dans l'application " + this.application.nom + " !";
        this.showError = true;
      }
      else {
        this.FonctionService.updateFonction(this.fonction.idApplication, this.fonction).subscribe((response) => {
          if (response) {
            this.router.navigate(['/Fonction']);
            this.EnregistrerAction(this.application.id, this.fonction.id, this.application.nom);
          }
        });
      }
    });
  }






}



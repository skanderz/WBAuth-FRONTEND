import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from './../Services/utilisateur.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-AccueilPrincipale',
  templateUrl: './AccueilPrincipale.component.html',
})
export class AccueilPrincipaleComponent implements OnInit {
  public isUserAuthenticated!: boolean;

  constructor(private UtilisateurService: UtilisateurService ,private router: Router){}

  ngOnInit(): void {
    if (this.UtilisateurService.isUserAuthenticated()) this.router.navigate(['/Accueil']);
    else if (!this.UtilisateurService.isUserAuthenticated()) this.UtilisateurService.clearCookies();
    this.UtilisateurService.authChanged.subscribe(res => { this.isUserAuthenticated = res; })
  }



}



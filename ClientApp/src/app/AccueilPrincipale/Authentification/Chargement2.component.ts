import { Component, NgModule, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { UtilisateurApplicationService } from '../../Services/utilisateurapplication.service';
import { UtilisateurApplication } from '../../Models/utilisateurapplication.model';
import { ApplicationService } from '../../Services/application.service';
import { Application } from '../../Models/application.model';
import { RoleService } from '../../Services/role.service';


@Component({
  selector: 'app-Chargement2',
  templateUrl: './Chargement2.component.html',
})

export class Chargement2 implements OnInit {


  constructor(private roleService: RoleService, private applicationService: ApplicationService, private UtilisateurService: UtilisateurService,
      private router: Router, private route: ActivatedRoute, private UAService: UtilisateurApplicationService){}


  ngOnInit(): void {
      setTimeout(() => { this.router.navigate(['/Accueil']); }, 500);
      const hasReloaded = localStorage.getItem('hasReloaded');
      if (!hasReloaded) {
        localStorage.setItem('hasReloaded', 'true');
        location.reload();
      }    
  }



  ngOnDestroy(): void { localStorage.removeItem('hasReloaded');  }


}


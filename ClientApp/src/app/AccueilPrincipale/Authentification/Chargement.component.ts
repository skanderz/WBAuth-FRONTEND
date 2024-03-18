import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { UtilisateurApplicationService } from '../../Services/utilisateurapplication.service';
import { UtilisateurApplication } from '../../Models/utilisateurapplication.model';
import { ApplicationService } from '../../Services/application.service';
import { Application } from '../../Models/application.model';
import { RoleService } from '../../Services/role.service';
import { Journalisation } from '../../Models/journalisation.model';


@Component({
  selector: 'app-Chargement',
  templateUrl: './Chargement.component.html',
})

export class Chargement implements OnInit {
  journal: Journalisation = new Journalisation(); 
  Utilisateurs: any[] = [];
  IdApp: number = 0;
  applications: any[] = [];
  UtilisateurApp: UtilisateurApplication = new UtilisateurApplication();
  UtilisateurApps: UtilisateurApplication[] = [];
  application: Application = new Application();
  rech: string = '';
  AppParDefaut: any = {  nom: "WBAuth", url: "www.wbauth.com", auth2FA: true, authGoogle: true, authFacebook: true, authLinkedIn: true  }
  RoleParDefaut: any = {  nom: "Utilisateur", niveau: 1, idApplication: 0  }
  errorMessage: string = '';
  showError!: boolean;


  constructor(private roleService: RoleService, private applicationService: ApplicationService, private UtilisateurService: UtilisateurService,
      private router: Router, private route: ActivatedRoute, private UAService: UtilisateurApplicationService){}


  ngOnInit(): void {
    this.verifierConfirmationEmail();
    this.ChargerApp();
    this.loadUtilisateurs();
    setTimeout(() => { this.router.navigate(['/Chargement2']); }, 2000);
  }



  verifierConfirmationEmail(){
    const dateNow = new Date();
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      for (const user of data) {
        const dateInscription = new Date(user.dateInscription);
        const differenceEnMilliseconds = Math.abs(dateInscription.getTime() - dateNow.getTime());
        const differenceEnJours = differenceEnMilliseconds / (1000 * 3600 * 24); // Conversion en jours
        if (differenceEnJours > 1 && user.emailConfirmed === false) {
          this.UtilisateurService.deleteUtilisateur(user.id).subscribe(() => { });
        }
      }
    })
  }


  ChargerApp(){
    this.applicationService.getApplications().subscribe((data) => {
      this.applications = data;
      const app = this.applications.filter(app => app.url.toLowerCase() === 'www.wbauth.com');
      if (app.length == 0) {
        this.applicationService.addApplication(this.AppParDefaut).subscribe(() => {
          this.applicationService.Recherche("www.wbauth.com").subscribe((data) => {
            this.RoleParDefaut.idApplication = data[0].id;
            this.roleService.addRole(this.RoleParDefaut).subscribe(() => {
            });
          });
        });
      }
    },
      (error) => { console.error('Erreur lors de la récupération des applications : ', error); });
  }


  loadUtilisateurs() {
    this.UtilisateurService.getUtilisateurs().subscribe((data) => {
      this.Utilisateurs = data; // userlist
      for (const user of this.Utilisateurs) { // chaque user
        this.UAService.getListByUtilisateur(user.id).subscribe((UAdata) => {
          this.applicationService.getApplications().subscribe((AppData) => {
            this.applications = AppData; // App list 
            for (const app of this.applications) {
              if (app.url === "www.wbauth.com") {
                this.UtilisateurApps = UAdata;  // userApp list
                const result = this.UtilisateurApps.filter((ua) => (ua.guidUtilisateur === user.id) && (ua.idApplication === app.id));
                if (result.length === 0) {
                  this.UtilisateurApp.idRole = null;
                  this.UtilisateurApp.idApplication = app.id;
                  this.UtilisateurApp.guidUtilisateur = user.id;
                  this.UAService.AddUtilisateurApplication(this.UtilisateurApp).subscribe((response) => {
                    if (response) { console.log(this.UtilisateurApp); }
                  });
                }
              }
            }
          });
        });
      }
    }, (error) => { console.error('Erreur lors de la récupération des Utilisateur : ', error); });
  }





}


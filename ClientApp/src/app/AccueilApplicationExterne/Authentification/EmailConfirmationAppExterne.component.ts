import { Component, NgModule, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilisateurService } from './../../Services/utilisateur.service';


@Component({
  selector: 'app-EmailConfirmationAppExterne',
  templateUrl: './EmailConfirmationAppExterne.component.html',
})

export class EmailConfirmationAppExterne implements OnInit {
  showSuccess!: boolean;
  showError!: boolean;
  errorMessage!: string;

  constructor(private UtilisateurService: UtilisateurService, private router: Router ,private _route: ActivatedRoute){}

  ngOnInit(): void {
    if (this.UtilisateurService.isUserAuthenticated()) this.router.navigate(['/Accueil']);
    else if (!this.UtilisateurService.isUserAuthenticated()) this.UtilisateurService.clearCookies();
    this.confirmEmail();
  }

  private confirmEmail = () => {
    this.showError = this.showSuccess = false;
    const token = this._route.snapshot.queryParams['token'];
    const email = this._route.snapshot.queryParams['email'];

    this.UtilisateurService.confirmEmail(token, email).subscribe({
        next: (_) => this.showSuccess = true,
        error: (err: HttpErrorResponse) => {
          this.showError = true;
          this.errorMessage = err.message;
        }
      })
  }



}









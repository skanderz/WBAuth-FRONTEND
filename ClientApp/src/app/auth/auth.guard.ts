import { UtilisateurService } from '../Services/utilisateur.service'; 
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private UtilisateurService: UtilisateurService){}


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.UtilisateurService.isUserAuthenticated()) {  return true; }
    this.router.navigate(['/AccueilPrincipale'], { queryParams: { returnUrl: state.url } });
    return false;
  }



}










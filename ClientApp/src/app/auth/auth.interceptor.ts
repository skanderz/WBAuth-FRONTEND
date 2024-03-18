import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from 'rxjs';
import { catchError ,tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class AuthInterceptor implements HttpInterceptor{
  constructor(private router: Router){}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe( catchError((error: HttpErrorResponse) => {
          let errorMessage = this.handleError(error);
          return throwError(() => new Error(errorMessage));
        })
      )
  }

  private handleError = (error: HttpErrorResponse): string => {
    if (error.status === 404) { return this.handleNotFound(error); }
    else if (error.status === 401) { return this.handleUnauthorized(error); }
    else if (error.status === 400) { return this.handleBadRequest(error); }
    else if (error.status != 404 && error.status != 401 && error.status != 400 ) { console.log(error); }
    return 'Une erreur inattendue s\'est produite.';
  }


  private handleUnauthorized = (error: HttpErrorResponse): string => {
    if (this.router.url === '/Authentification' || this.router.url.includes('/Inscription')) {
      return error.error.errorMessage;
    }
    else {
      this.router.navigate(['/Authentification']);
      return error.message;
    }
  }


  private handleNotFound = (error: HttpErrorResponse): string => {
    return error.message;
  }


  private handleBadRequest = (error: HttpErrorResponse): string => {
    if (this.router.url === '/ForgotPassword') {
      let values: any = Object.values(error.error.errors);
      return values[0];
    }
    else if (this.router.url === '/Inscription' ||this.router.url === '/Utilisateur/AjouterUtilisateur') {
      let message = '';
      let values: any = Object.values(error.error.errors);
      for (let i = 0; i < values.length; i++) {
        message = message + values[i].description + " ";
      }
      return message;
    }
    return "Requete échouée! Erreur 400";
  };






}

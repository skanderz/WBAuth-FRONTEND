import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilisateurApplication } from '../Models/utilisateurapplication.model';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurApplicationService {
  private apiUrl = environment.apiUrl + 'UtilisateurApplication'; 

  constructor(private http: HttpClient) { }

  AddUtilisateurApplication(UtilisateurApplication: any) : Observable<any> {
    return this.http.post<any>(this.apiUrl + "/ajouter", UtilisateurApplication);
  }

  getListByApplication(IdApplication:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListByApplication/${IdApplication}`);
  }

  getListByUtilisateur(idUtilisateur: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListByUtilisateur/${idUtilisateur}`);
  }

  getUtilisateurApplication(Id:number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/Get/${Id}`);
  }

  updateUtilisateurApplication(UtilisateurApplication:any): Observable<any> {
    return this.http.put<any>(this.apiUrl + "/modifierAccesRole", UtilisateurApplication);
  }




}

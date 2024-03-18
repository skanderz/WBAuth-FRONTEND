import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FonctionService {
  private apiUrl = environment.apiUrl + 'Fonction'; 

  constructor(private http: HttpClient) { }

  getFonctions(IdApplication :number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/List/${IdApplication}`);
  }

  Recherche(rech: string | null, IdApplication: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${rech}/${IdApplication}`);
  }

  getFonction(id:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Get/${id}`);
  }

  addFonction(Fonction: any ,IdApplication: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajouter/${IdApplication}`, Fonction);
  }

  updateFonction(IdApplication: number, Fonction: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifier/${IdApplication}`, Fonction);
  }

  deleteFonction(id: number ,IdApplication: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer?id=${id}&IdApplication=${IdApplication}`);
  }



}

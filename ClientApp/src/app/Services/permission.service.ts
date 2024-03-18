import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = environment.apiUrl + 'Permission';
  private apiUrlDAO = environment.apiUrl + 'PermissionControllerDAO';

  constructor(private http: HttpClient) { }

  getListeMultiFonction(IdApplication:number ,IdRole: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListeMultiFonction/${IdApplication}/${IdRole}`);
  }

  getListeFonctionUnique(IdApplication: number, IdRole: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListeFonctionUnique/${IdApplication}/${IdRole}`);
  }

  getFonctionUnique(Id:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/RechercheFonctionUnique/Get/${Id}`);
  }

  getMultiFonction(Id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/RechercheMultiFonction/Get/${Id}`);
  }

  RechFonctionUnique(rech: string | null, IdApplication: number, IdRole: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlDAO}/RechercheFonctionUnique/${rech}/${IdApplication}/${IdRole}`);
  }

  RechMultiFonction(rech :string | null, IdApplication: number, IdRole: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlDAO}/RechercheMultiFonction/${rech}/${IdApplication}/${IdRole}`);
  }

  addPermission(Permission: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/ajouter", Permission);
  }

  updatePermission(Permission: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + "/modifier", Permission);
  }

  ModifierAcces(IdApplication: number ,i: number ,Permission: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifierAcces?idApplication=${IdApplication}&i=${i}`,Permission);
  }

  deletePermission(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer?id=${id}`);
  }




}

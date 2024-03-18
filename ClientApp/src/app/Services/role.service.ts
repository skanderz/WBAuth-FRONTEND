import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = environment.apiUrl + 'Role'; 

  constructor(private http: HttpClient) { }

  getRoles(IdApplication: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/List/${IdApplication}`);
  }

  getRole(Id: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Get/${Id}`);
  }

  Recherche(rech: string | null, IdApplication: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${rech}/${IdApplication}`);
  }

  addRole(Role: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/ajouter", Role);
  }

  updateRole(id: number, Role: any): Observable<any> {
    return this.http.put<any>(this.apiUrl +"/modifier", Role);
  }

  deleteRole(id: number, IdApplication: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer?id=${id}&IdApplication=${IdApplication}`);
  }



}

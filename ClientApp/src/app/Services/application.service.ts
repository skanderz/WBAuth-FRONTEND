import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = environment.apiUrl + 'Application'; 

  constructor(private http: HttpClient) { }

  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/List`);
  }

  getApplication(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Get/${id}`);
  }

  Recherche(rech: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${rech}`);
  }

  addApplication(Application: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/ajouter", Application);
  }

  updateApplication(Application: any): Observable<any>{
    return this.http.put<any>(this.apiUrl + "/modifier", Application);
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer?id=${id}`);
  }




}

import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private apiUrl = environment.apiUrl + 'Action';

  constructor(private http: HttpClient){}

  getActions(IdJournalisation: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/List/${IdJournalisation}`);
  }

  getAction(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Get/${id}`);
  }

  Recherche(rech: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recherche/${rech}`);
  }

  EnregistrementActions(Action: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/EnregistrementActions`, Action);
  }

  Clear(IdJournalisation: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear?IdJournalisation=${IdJournalisation}`);
  }




}

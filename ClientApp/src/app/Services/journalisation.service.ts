import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JournalisationService {
  private apiUrl = environment.apiUrl + 'Journalisation'; 

  constructor(private http: HttpClient){}

  getJournalisations(IdUtilisateur: string | null): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/List/${IdUtilisateur}`);
  }

  getJournalisation(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Get/${id}`);
  }

  Recherche(rech:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${rech}`);
  }

  EnregistrementJournalisations(Journalisation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/EnregistrementJournalisations`, Journalisation);
  }

  deleteJournalisation(IdUtilisateur: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear?IdUtilisateur=${IdUtilisateur}`);
  }



}

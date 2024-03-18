import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from './application.service';
import { RoleService } from './role.service';
import { CustomEncoder } from '../auth/customEncoder';
import { TwoFactor } from '../auth/twoFactor.interface';


@Injectable({  providedIn: 'root',})
export class UtilisateurService {
  private apiUrl = environment.apiUrl + 'Utilisateur';
  private apiUrl2 = environment.apiUrl + 'Service';
  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private route: ActivatedRoute, private router: Router){}


  Inscription(Utilisateur: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + "/inscription" ,Utilisateur);
  }

  InscriptionAppExterne(Utilisateur: any, urlApplication: string): Observable<any> {
    return this.http.post<any>(this.apiUrl2 + "/inscriptionApplication" + `/${urlApplication}`, Utilisateur);
  }

  login(login: any): Observable<any>{
    return this.http.post(this.apiUrl + "/login", login);
  }

  redirectConnexionReussi(urlApplication: string, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/redirectConnexionReussi/${urlApplication}/${token}`);
  }

  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(this.apiUrl + "/LoginWithGoogle", JSON.stringify(credentials), { headers: header, withCredentials: true });
  }

  LoginWithFacebook(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(this.apiUrl + "/LoginWithFacebook", JSON.stringify(credentials), { headers: header, withCredentials: true });
  }

  LoginWithLinkedIn(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(this.apiUrl + "/LoginWithLinkedIn", JSON.stringify(credentials), { headers: header, withCredentials: true });
  }

  logout = () => {  this.clearCookies();  }

  clearCookies = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.sendAuthStateChangeNotification(false);
  }

  twoStepLogin(body: TwoFactor): Observable<any> {
    return this.http.post(this.apiUrl + "/TwoStepVerification", body);
  }

  public confirmEmail = (token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('token', token);
    params = params.append('email', email);
    return this.http.get(this.apiUrl + "/emailConfirmation", { params: params });
  }


  forgotPassword(ForgotPassword : any): Observable<any> {
    return this.http.post(this.apiUrl + "/forgotPassword", ForgotPassword);
  }

  resetPassword(ResetPassword: any): Observable<any> {
    return this.http.post(this.apiUrl + "/resetPassword", ResetPassword);
  }

  checkPassword(email:string ,passwordToCheck:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkPassword/${email}/${passwordToCheck}`);
  }

  sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    let bool!: boolean;
    if (token && !this.jwtHelper.isTokenExpired(token)) { bool = true; } else bool = false;
    console.log("token : " + bool);
    return bool;
  }

  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/List");
  }

  getUtilisateur(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Get/${id}`);
  }

  Recherche(rech: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recherche/${rech}`);
  }

  addUtilisateur(Utilisateur: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/ajouter", Utilisateur);
  }

  updateUtilisateur(id:string | null ,Utilisateur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifier/${id}`, Utilisateur);
  }

  deleteUtilisateur(Id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer/${Id}`);
  }




}

import { Component, NgModule, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Response } from './../../auth/response.interface';


@Component({
  selector: 'app-LinkedInResponse',
  templateUrl: './LinkedInResponse.component.html',
})


export class LinkedInResponseComponent implements OnInit {
  private apiUrl = environment.apiUrl + 'Utilisateur'; 
  private linkedInToken = "";

  constructor(private router: Router, private http: HttpClient ,private UtilisateurService: UtilisateurService, private route: ActivatedRoute ){}


  ngOnInit(): void {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    this.UtilisateurService.LoginWithLinkedIn(this.linkedInToken).subscribe({
      next: (res: Response) => {
        console.log(res);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }






}



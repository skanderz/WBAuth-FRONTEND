import { Component, OnInit ,OnDestroy } from '@angular/core';
import { UtilisateurService } from './../Services/utilisateur.service';
import { RoleService } from './../Services/role.service';
import { Utilisateur } from './../Models/utilisateur.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurApplicationService } from '../Services/utilisateurapplication.service';


@Component({
  selector: 'app-BarreHaute',
  templateUrl: './BarreHaute.component.html',
  styleUrls: ['./BarreHaute.component.css']
})
export class BarreHauteComponent implements OnInit {
  public isUserAuthenticated!: boolean;
  isDropdownOpen: boolean = false;
  usernamebar!: string | null;
  rolebar!: string | null;
  private dropdownTimer: any;

  constructor(private UAService: UtilisateurApplicationService, private RoleService: RoleService, private router: Router,
    private UtilisateurService: UtilisateurService, private route: ActivatedRoute){}


  ngOnInit(): void {
    this.UtilisateurService.authChanged.subscribe(res => {
      this.isUserAuthenticated = res;
      this.UtilisateurService.Recherche(localStorage.getItem("username")).subscribe((userdata) => {
        this.UAService.getListByUtilisateur(userdata[0].id).subscribe((uadata) => {
          this.RoleService.getRole(uadata[0].idRole).subscribe((roledata) => {
            localStorage.setItem("role", roledata.nom);
          });
        });
      });
    })
    this.usernamebar = localStorage.getItem("username")!.toUpperCase();
    this.rolebar = localStorage.getItem("role")!.toUpperCase();
  }



  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    if (this.isDropdownOpen) {
      setTimeout(() => { this.isDropdownOpen = false }, 10000);
    }
  }


  logout = () => {
    this.UtilisateurService.logout();
    this.isDropdownOpen = false ;
    this.router.navigate(["/"]);
  }


  profil = () => {
    this.isDropdownOpen = false;
    this.router.navigate(["/Profil"]);
  }



}







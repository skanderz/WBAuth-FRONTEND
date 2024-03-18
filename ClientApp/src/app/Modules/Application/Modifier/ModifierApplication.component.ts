import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../Services/application.service';
import { Application } from '../../../Models/application.model';
import { UtilisateurService } from './../../../Services/utilisateur.service';
import { JournalisationService } from '../../../Services/journalisation.service';
import { ActionService } from '../../../Services/action.service';
import { Action } from '../../../Models/action.model';


@Component({
  selector: 'app-ModifierApplication',
  templateUrl: './ModifierApplication.component.html'
})


export class ModifierApplicationComponent implements OnInit{
  public application: Application = new Application();
  auth2FA: boolean | null = null;
  authGoogle: boolean | null = null;
  authFacebook: boolean | null = null;
  authLinkedIn: boolean | null = null;
  oldUrl: string | null = "";
  errorMessage: string = '';
  showError: boolean = false;

  constructor(private applicationService: ApplicationService, private JournalisationService: JournalisationService, private router: Router,
    private route: ActivatedRoute, private ActionService: ActionService, private UtilisateurService: UtilisateurService){}


  ngOnInit(): void{
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (!isNaN(id)) {
        this.applicationService.getApplication(id).subscribe((data) => {
          if (data) {
            this.application = data;
            this.oldUrl = this.application.url
            console.log(data);
            const checkDiv = document.querySelector('.check');
            const auth2faText = document.querySelector('.auth2fa') as HTMLElement;;
            const checkDiv2 = document.querySelector('.check2');
            const checkDiv3 = document.querySelector('.check3');
            const checkDiv4 = document.querySelector('.check4');
            if (checkDiv && this.application.auth2FA == false) {
              const icon = checkDiv.querySelector('i');
              if (icon) {
                if (icon.classList.contains('fa-times')) {
                  checkDiv.classList.toggle('clicked');
                  if (auth2faText) auth2faText.style.color = 'red';
                }
              }
            }
            if (checkDiv2 && this.application.authGoogle == false) {
              const icon = checkDiv2.querySelector('i');
              if (icon) { if (icon.classList.contains('fa-times')) { checkDiv2.classList.toggle('clicked2');  } }
            }
            if (checkDiv3 && this.application.authFacebook == false) {
              const icon = checkDiv3.querySelector('i');
              if (icon) { if (icon.classList.contains('fa-times')) { checkDiv3.classList.toggle('clicked3'); } }
            }
            if (checkDiv4 && this.application.authLinkedIn == false) {
              const icon = checkDiv4.querySelector('i');
              if (icon) { if (icon.classList.contains('fa-times')) { checkDiv4.classList.toggle('clicked4'); } }
            }

          }

        });
        const hasReloaded = localStorage.getItem('hasReloaded');
        if (!hasReloaded) {
          localStorage.setItem('hasReloaded', 'true');
          location.reload();
        }
      } else { console.error('La valeur du paramètre "id" n\'est pas un nombre valide.'); }
    }
    else { console.error('Le paramètre "id" est manquant dans l\'URL.'); }
  }

  ngOnDestroy(): void { localStorage.removeItem('hasReloaded'); }


  EnregistrerAction(idApp:number) {
    let username = localStorage.getItem("username");
    this.UtilisateurService.Recherche(username).subscribe((data) => {
      this.JournalisationService.getJournalisations(data[0].id).subscribe((dataJournalisations) => {
        let idJournalisation = dataJournalisations[dataJournalisations.length - 1].id;
        const action: Action = {
          id: 0, application: "www.wbauth.com", date: new Date(), description: `l'utilisateur ${username} a modifié l'application avec l'id '${idApp}'`,
          idJournalisation: idJournalisation, journalisation: dataJournalisations[dataJournalisations.length - 1]
        }
        this.ActionService.EnregistrementActions(action).subscribe(() => { console.log(action); });
      })
    })
  }


  toggleAuth2FA() {
    const checkDiv = document.querySelector('.check');
    if (checkDiv) {
      const icon = checkDiv.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-check')) { this.auth2FA = false; }
        else if (icon.classList.contains('fa-times')) { this.auth2FA = true; }
      }
    }
  }


  toggleAuthGoogle() {
    const checkDiv = document.querySelector('.check2');
    if (checkDiv) {
      const icon = checkDiv.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-check')) { this.authGoogle = false; }
        else if (icon.classList.contains('fa-times')) { this.authGoogle = true; }
      }
    }
  }


  toggleAuthFacebook() {
    const checkDiv = document.querySelector('.check3');
    if (checkDiv) {
      const icon = checkDiv.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-check')) { this.authFacebook = false; }
        else if (icon.classList.contains('fa-times')) { this.authFacebook = true; }
      }
    }
  }


  toggleAuthLinkedIn() {
    const checkDiv = document.querySelector('.check4');
    if (checkDiv) {
      const icon = checkDiv.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-check')) { this.authLinkedIn = false; }
        else if (icon.classList.contains('fa-times')) { this.authLinkedIn = true; }
      }
    }
  }

  estUneURL(url: string | null): boolean {
    if (url != null) {
      if (url!.includes('localhost:')) return true 
      const expression = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\.[a-zA-Z]{2,})$/;
      return expression.test(url);
    }
    else return false;  
  }


  onSubmit() {
    this.showError = false;
    this.applicationService.Recherche(this.application.url).subscribe((data) => {
      if (data.length != 0 && this.application.url != this.oldUrl) {
        this.errorMessage = "Une application avec cette url existe déjà !";
        this.showError = true;
      }
      else if (!this.estUneURL(this.application.url)) { 
        this.errorMessage = "Veuillez saisir une URL correcte !";
        this.showError = true;
      }
      else {
        if (this.auth2FA != null) this.application.auth2FA = this.auth2FA;
        if (this.authGoogle != null) this.application.authGoogle = this.authGoogle;
        if (this.authFacebook != null) this.application.authFacebook = this.authFacebook;
        if (this.authLinkedIn != null) this.application.authLinkedIn = this.authLinkedIn;
        this.applicationService.updateApplication(this.application).subscribe((response) => {
          if (response) {
            this.router.navigate(['/Application']);
            this.EnregistrerAction(this.application.id);
          }
        });
      }
    });
  }


  onFileSelected(event: any){
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const extension: any = file.name.split('.').pop();
      if (file) {
        const allowedExtensions = ["png", "jpg", "jpeg", "gif", "bmp"];
        if (allowedExtensions.indexOf(extension) === -1) {
          alert("Extension de fichier non autorisée. Veuillez sélectionner un fichier avec une extension .png, .jpg, .jpeg, .gif ou .bmp.");
        }
      }
    }
  }





}



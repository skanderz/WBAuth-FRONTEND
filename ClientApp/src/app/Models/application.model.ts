import { Fonction } from "./fonction.model";
import { Role } from "./role.model";
import { UtilisateurApplication } from "./utilisateurapplication.model";

export class Application {
  id: number;
  nom: string | null;
  description: string | null;
  url: string | null;
  logo: string | null;
  auth2FA: boolean | null;
  authGoogle: boolean | null;
  authFacebook: boolean | null;
  authLinkedIn: boolean | null;
  utilisateurApplication: UtilisateurApplication[] | null; 
  fonctions: Fonction[] | null;
  role: Role[] | null;


  constructor() {
    this.id = 0;
    this.nom = null;
    this.description = null;
    this.url = null;
    this.logo = null;
    this.auth2FA = null;
    this.authGoogle = null;
    this.authFacebook = null;
    this.authLinkedIn = null;
    this.utilisateurApplication = null;
    this.fonctions = null;
    this.role = null;
  }



}

import { UtilisateurApplication } from "./utilisateurapplication.model";

export class Utilisateur {
  id: string | null;
  userName: string | null;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  Password: string | null;
  dateInscription: Date | null;
  status: boolean;
  emailConfirmed: boolean | null;
  twoFactorEnabled: boolean | null;
  clientURI: any;
  utilisateurApplication: UtilisateurApplication[] | null;

  constructor() {
    this.id = "";
    this.userName = null;
    this.nom = null;
    this.prenom = null;
    this.email = null;
    this.Password = null;
    this.dateInscription = null;
    this.status = true;
    this.emailConfirmed = null;
    this.twoFactorEnabled = null;
    this.clientURI = null;
    this.utilisateurApplication = null;
  }


}

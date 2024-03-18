import { Application } from "./application.model";
import { Role } from "./role.model";
import { Utilisateur } from "./utilisateur.model";

export class UtilisateurApplication {
  id: number;
  guidUtilisateur: string | null;
  idApplication: number;
  idRole: number | null;
  acces: boolean;
  utilisateur: Utilisateur | null;
  application: Application | null;
  role: Role | null;

  constructor(){
    this.id = 0;
    this.guidUtilisateur = null;
    this.idApplication = 0;
    this.idRole = null;
    this.acces = true;
    this.utilisateur = null;
    this.application = null;
    this.role = null;
  }



}

import { Application } from "./application.model";
import { Permission } from "./permission.model";
import { UtilisateurApplication } from "./utilisateurapplication.model";

export class Role {
  id: number;
  nom: string | null;
  description: string | null;
  niveau: number;
  idApplication: number;
  application: Application | null;
  permission: Permission[] | null;
  utilisateurApplication: UtilisateurApplication[] | null;

  constructor() {
    this.id = 0;
    this.nom = null;
    this.description = null;
    this.niveau = 0;
    this.idApplication = 0;
    this.permission = null;
    this.utilisateurApplication = null;
    this.application = null;
  }
}

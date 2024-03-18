import { Application } from "./application.model";
import { Permission } from "./permission.model";

export class Fonction {
  id: number;
  nom: string | null;
  type: string | null;
  description: string | null;
  permission: Permission | null;
  idApplication: number;
  application: Application | null;

  constructor(
    id: number = 0,
    nom: string | null = null,
    type: string | null = null,
    description: string | null = null,
    permission: Permission | null = null,
    idApplication: number = 0,
    application: Application | null = null
  ) {
    this.id = id;
    this.nom = nom;
    this.type = type;
    this.description = description;
    this.permission = permission;
    this.idApplication = idApplication;
    this.application = application;
  }
}









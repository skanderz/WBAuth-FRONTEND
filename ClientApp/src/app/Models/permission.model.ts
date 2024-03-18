import { Fonction } from "./fonction.model";
import { Role } from "./role.model";

export class Permission {
  id: number;
  nom: string | null;
  status: string;
  idRole: number;
  role: Role | null;
  idFonction: number;
  fonction: Fonction | null;

  constructor(
    id: number = 0,
    nom: string | null = null,
    status: string = "111111",
    idRole: number = 0,
    role: Role | null = null,
    idFonction: number = 0,
    fonction: Fonction | null = null
  ) {
    this.id = id;
    this.nom = nom;
    this.status = status;
    this.idRole = idRole;
    this.role = role;
    this.idFonction = idFonction;
    this.fonction = fonction;
  }


}


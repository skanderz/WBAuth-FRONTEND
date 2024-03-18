import { Utilisateur } from './utilisateur.model'; 
import { Action } from './action.model';


export class Journalisation {
  id: number;
  application: string | null;
  adresseIP: string | null;
  dateConnexion: Date | null;
  guidUtilisateur: string;
  utilisateur: Utilisateur | null;
  actions: Action[] | null;

  constructor(){
    this.id = 0;
    this.application = null;
    this.adresseIP = null;
    this.dateConnexion = null;
    this.guidUtilisateur = "";
    this.utilisateur = null;
    this.actions = null;
  }
}

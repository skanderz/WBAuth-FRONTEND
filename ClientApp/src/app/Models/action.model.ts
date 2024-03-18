import { Journalisation } from "./journalisation.model";
export class Action {
  id: number;
  application: string | null;
  date: Date | null;
  description: string | null; 
  idJournalisation: number;
  journalisation: Journalisation | null; 

  constructor() {
    this.id = 0;
    this.application = null;
    this.date = null;
    this.description = null;
    this.idJournalisation = 0;
    this.journalisation = null;
  }
}


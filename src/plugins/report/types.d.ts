export interface IOperazione {
  id: number;
  createdAt: string;
  updatedAt: string;
  ufficio: IUfficio;
  tipoOperazione: ITipoOperazione;
  offerta: IOfferta;
  createdBy: IUser;
}

export interface IUfficio {
  id: number;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITipoOperazione {
  id: number;
  nome: string;
  valore: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOfferta {
  id: number;
  nome: string;
  valore: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  username: string | null;
  email: string;
  password: string;
  resetPasswordToken: string | null;
  registrationToken: string;
  isActive: boolean;
  blocked: boolean;
  preferedLanguage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IOperazionePerUtente {
  numOperazioni: number;
  firstname: string;
  lastname: string;
  importo: number;
  offerta: number;
  totale: number;
}

export interface IOperazionePerOfferta {
  numOperazioni: number;
  nome: string;
  importo: number;
}

export interface IOperazionePerTipo {
  numOperazioni: number;
  nome: string;
  importo: number;
  offerta: number;
  totale: number;
}

export interface IReportForOffice {
  nome: string;
  operazioniUtente: IOperazionePerUtente[];
  operazioniOfferta: IOperazionePerOfferta[];
  operazioniTipo: IOperazionePerTipo[];
}

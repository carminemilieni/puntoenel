import { Strapi } from '@strapi/strapi';
import {
  IOperazionePerOfferta,
  IOperazionePerTipo,
  IOperazionePerUtente,
  IReportForOffice,
  IUfficio
} from '../../types';
import moment from 'moment';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getAll(dateFrom: string, dateTo: string): Promise<IReportForOffice[]> {
    const uffici: IUfficio[] = await strapi.entityService.findMany(
      'api::ufficio.ufficio'
    );

    const dataResponse: IReportForOffice[] = [];

    for (const ufficio of uffici) {
      const d: IReportForOffice = {
        nome: ufficio.nome,
        operazioniTipo: await this.getOperazioniPerTipo(
          dateFrom,
          dateTo,
          ufficio.id
        ),
        operazioniUtente: await this.getNumOperazioniPerUtente(
          dateFrom,
          dateTo,
          ufficio.id
        ),
        operazioniOfferta: await this.getOperazioniPerOfferta(
          dateFrom,
          dateTo,
          ufficio.id
        )
      };
      dataResponse.push(d);
    }

    const d: IReportForOffice = {
      nome: 'Totale generale',
      operazioniTipo: await this.getOperazioniPerTipo(dateFrom, dateTo),
      operazioniUtente: await this.getNumOperazioniPerUtente(dateFrom, dateTo),
      operazioniOfferta: await this.getOperazioniPerOfferta(dateFrom, dateTo)
    };

    dataResponse.push(d);

    return dataResponse;
  },

  async getNumOperazioniPerUtente(
    dateFrom: string,
    dateTo: string,
    ufficio?: number
  ): Promise<IOperazionePerUtente[]> {
    dateFrom = moment(dateFrom).format('YYYY-MM-DD');
    dateTo = moment(dateTo).add(1, 'days').format('YYYY-MM-DD');
    const startQuery = `
      SELECT admin_users.id,
             admin_users.firstname,
             admin_users.lastname,
             SUM(COALESCE(tipo_operazioni.valore, 0))                               AS importo,
             SUM(COALESCE(offerte.valore, 0))                                       AS offerta,
             SUM(COALESCE(tipo_operazioni.valore, 0) + COALESCE(offerte.valore, 0)) as totale,
             COUNT(operazioni.id)                                                   AS num_operazioni
      FROM operazioni
             INNER JOIN admin_users
                        ON operazioni.created_by_id = admin_users.id
             LEFT JOIN operazioni_ufficio_links
                       ON operazioni_ufficio_links.operazione_id = operazioni.id
             LEFT JOIN uffici
                       ON operazioni_ufficio_links.ufficio_id = uffici.id
             LEFT JOIN operazioni_tipo_operazione_links
                       ON operazioni_tipo_operazione_links.operazione_id = operazioni.id
             LEFT JOIN tipo_operazioni
                       ON operazioni_tipo_operazione_links.tipo_operazione_id = tipo_operazioni.id


             LEFT JOIN operazioni_offerta_links
                       ON operazioni_offerta_links.operazione_id = operazioni.id
             LEFT JOIN offerte
                       ON operazioni_offerta_links.offerta_id = offerte.id
    `;

    let whereQuery = '';

    if (ufficio) {
      whereQuery = `WHERE uffici.id = ${ufficio}
          AND operazioni.created_at >= '${dateFrom}'
          AND operazioni.created_at <= '${dateTo}'`;
    } else {
      whereQuery = `WHERE operazioni.created_at >= '${dateFrom}'
          AND operazioni.created_at <= '${dateTo}'`;
    }

    const endQuery = `
    GROUP BY admin_users.id, admin_users.firstname, admin_users.lastname;
    `;
    const { rows } = await strapi.db.connection.raw(
      `${startQuery} ${whereQuery} ${endQuery}`
    );

    return rows.map((row) => this.convertToCamelCase(row));
  },

  async getOperazioniPerTipo(
    dateFrom: string,
    dateTo: string,
    ufficio?: number
  ): Promise<IOperazionePerTipo> {
    dateFrom = moment(dateFrom).format('YYYY-MM-DD');
    dateTo = moment(dateTo).add(1, 'days').format('YYYY-MM-DD');

    const startQuery = `
      SELECT COUNT(tipo_operazioni.id)                                              as num_operazioni,
             tipo_operazioni.nome,
             SUM(COALESCE(tipo_operazioni.valore, 0))                               as importo,
             SUM(COALESCE(offerte.valore, 0))                                       as offerta,
             SUM(COALESCE(tipo_operazioni.valore, 0) + COALESCE(offerte.valore, 0)) as totale
      FROM operazioni
             INNER JOIN operazioni_tipo_operazione_links
                        ON operazioni_tipo_operazione_links.operazione_id = operazioni.id
             INNER JOIN tipo_operazioni
                        ON operazioni_tipo_operazione_links.tipo_operazione_id = tipo_operazioni.id

             LEFT JOIN operazioni_ufficio_links
                       on operazioni_ufficio_links.operazione_id = operazioni.id
             LEFT JOIN uffici
                       on operazioni_ufficio_links.ufficio_id = uffici.id

             LEFT JOIN operazioni_offerta_links
                       ON operazioni_offerta_links.operazione_id = operazioni.id
             LEFT JOIN offerte
                       ON operazioni_offerta_links.offerta_id = offerte.id
    `;

    let whereQuery = '';
    if (ufficio) {
      whereQuery = `WHERE uffici.id = ${ufficio}
          AND operazioni.created_at >= '${dateFrom}'
          AND operazioni.created_at <= '${dateTo}'`;
    } else {
      whereQuery = `WHERE operazioni.created_at >= '${dateFrom}'
          AND operazioni.created_at <= '${dateTo}'`;
    }
    const endQuery = `
    GROUP BY tipo_operazioni.id, tipo_operazioni.nome
    `;

    const { rows } = await strapi.db.connection.raw(
      `
        ${startQuery}
        ${whereQuery}
        ${endQuery}
      `
    );

    return rows.map((row) => this.convertToCamelCase(row));
  },

  async getOperazioniPerOfferta(
    dateFrom: string,
    dateTo: string,
    ufficio?: number
  ): Promise<IOperazionePerOfferta[]> {
    dateFrom = moment(dateFrom).format('YYYY-MM-DD');
    dateTo = moment(dateTo).add(1, 'days').format('YYYY-MM-DD');

    const startQuery = `
      SELECT offerte.nome                     as nome,
             SUM(COALESCE(offerte.valore, 0)) as importo,
             COUNT(offerte.id)                as num_operazioni
      FROM offerte
             INNER JOIN operazioni_offerta_links
                        ON operazioni_offerta_links.offerta_id = offerte.id
             INNER JOIN operazioni
                        ON operazioni.id = operazioni_offerta_links.operazione_id
             LEFT JOIN operazioni_ufficio_links
                       ON operazioni_ufficio_links.operazione_id = operazioni_offerta_links.operazione_id
    `;

    let whereQuery = '';

    if (ufficio) {
      whereQuery = `WHERE operazioni_ufficio_links.ufficio_id = ${ufficio} AND operazioni.created_at >= '${dateFrom}' AND operazioni.created_at <= '${dateTo}'`;
    } else {
      whereQuery = `WHERE operazioni.created_at >= '${dateFrom}' AND operazioni.created_at <= '${dateTo}'`;
    }

    const endQuery = `
    GROUP BY offerte.id, offerte.nome, offerte.valore
    `;

    const { rows } = await strapi.db.connection.raw(
      `
        ${startQuery}
        ${whereQuery}
        ${endQuery}
      `
    );

    return rows.map((row) => this.convertToCamelCase(row));
  },

  convertToCamelCase(obj) {
    const newObj = {};

    for (const prop in obj) {
      const camelCasedProp = prop.replace(/_([a-z])/g, (p) =>
        p[1].toUpperCase()
      );
      newObj[camelCasedProp] =
        typeof obj[prop] === 'object'
          ? this.convertToCamelCase(obj[prop])
          : obj[prop];
    }

    return newObj;
  }
});

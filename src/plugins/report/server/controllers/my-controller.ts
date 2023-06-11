import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async index(ctx) {
    const { dateFrom, dateTo } = ctx.request.query;

    ctx.body = await strapi
      .plugin('report')
      .service('myService')
      .getAll(dateFrom, dateTo);
  }
});

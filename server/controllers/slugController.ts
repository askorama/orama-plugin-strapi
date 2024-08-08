import '@strapi/strapi';
export default ({ strapi }: { strapi: any }) => ({
  index(ctx: any) {
    ctx.body = strapi
      .plugin('slugify')
      .service('slugService')
      .getWelcomeMessage();
  },

  async getContentTypes(ctx: any) {
    try {
      ctx.body = await strapi
        .plugin('slugify')
        .service('slugService')
        .getContentTypes();
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async setSlugs(ctx: any) {
    const { body, headers } = ctx.request;
    // console.log(headers)
    try {
      await strapi
        .plugin('slugify')
        .service('slugService')
        .setSlugs(body, headers)
      ctx.body = await strapi
        .plugin('slugify')
        .service('slugService')
        .getContentTypes();

    } catch (err) {
      ctx.throw(500, err);
    }

  }

});

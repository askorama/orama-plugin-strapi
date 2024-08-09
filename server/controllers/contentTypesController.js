'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('orama')
      .service('contentTypesService')
      .getWelcomeMessage();
  },

  async getContentTypes(ctx) {
    const contentTypes = strapi
      .plugin('orama')
      .service('contentTypesService')
      .getContentTypesUID();

    strapi.log.info(contentTypes)

    return contentTypes
  },

  async getContentTypeEntries(ctx) {
    const { contentType } = ctx.request.query;

    console.log("===DEBUG===", contentType)

    const entries = await strapi
      .plugin('orama')
      .service('contentTypesService')
      .getEntries({ contentType });

    return entries
  }
});

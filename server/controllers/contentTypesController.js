'use strict';

module.exports = ({ strapi }) => ({
  async getContentTypes(ctx) {
    const contentTypes = strapi
      .plugin('orama')
      .service('contentTypesService')
      .getContentTypes();

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

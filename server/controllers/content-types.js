'use strict';

module.exports = ({ strapi }) => {
  return {
    async getContentTypes(ctx) {
      const contentTypes = strapi
        .plugin('orama')
        .service('contentTypesService')
        .getContentTypes();

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
  }
};

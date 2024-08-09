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
});

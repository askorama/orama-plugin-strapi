'use strict';

module.exports = ({ strapi }) => {
  return {
    async getContentTypes(ctx) {
      const contentTypes = strapi
        .plugin('orama')
        .service('contentTypesService')
        .getContentTypes();

      return contentTypes
    }
  }
};

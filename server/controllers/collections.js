'use strict';

module.exports = ({ strapi }) => {
  return {
    async getCollections(ctx) {
      const contentTypes = strapi
        .plugin('orama')
        .service('contentTypesService')
        .getContentTypes();

      return [...contentTypes]
    },
  }
};

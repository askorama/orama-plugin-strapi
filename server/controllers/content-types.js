'use strict';

module.exports = ({ strapi }) => {
  return {
    async getContentTypes(ctx) {
      const contentTypes = strapi
        .plugin('orama-cloud')
        .service('contentTypesService')
        .getContentTypes();

      return contentTypes
    }
  }
};

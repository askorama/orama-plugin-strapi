'use strict';

const filterContentTypesAPIs = ({ contentTypes }) => {
  return Object.keys(contentTypes).reduce((sanitized, contentType) => {
    if (contentType.startsWith('api::')) {
      sanitized[contentType] = contentTypes[contentType]
    }
    return sanitized
  }, {})
}

module.exports = ({ strapi }) => {
  return {
    getContentTypes() {
      const contentTypes = filterContentTypesAPIs({
        contentTypes: strapi.contentTypes,
      });

      return Object.entries(contentTypes).map(([contentType, c]) => ({
        contentType,
        collection: c.info.displayName,
        indexed: false,
        status: 'Not Indexed',
        indexId: undefined,
        documents_count: undefined,
      }));
    },

    async getEntries({ contentType }) {
      return await strapi.query(contentType).findMany();
    }
  }
};

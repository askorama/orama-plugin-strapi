'use strict';

const filterAPIs = ({ contentTypes }) => {
  return Object.keys(contentTypes).reduce((sanitized, contentType) => {
    if (contentType.startsWith('api::')) {
      sanitized[contentType] = contentTypes[contentType]
    }
    return sanitized
  }, {})
}

module.exports = ({ strapi }) => ({
  getContentTypes() {
    const contentTypes = filterAPIs({
      contentTypes: strapi.contentTypes,
    });

    return Object.entries(contentTypes).map(([contentType, c]) => ({
      contentType,
      collection: c.info.displayName,
      status: 'draft',
      indexId: undefined,
      documents_count: 0,
    }));
  },

  async getEntries({ contentType }) {
    return await strapi.query(contentType).findMany();
  }
});

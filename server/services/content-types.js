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
        value: contentType,
        label: c.info.displayName,
      }));
    },

    async getEntries({ contentType, relations = "", offset = 0, limit = 50 }) {
      return await strapi.query(contentType).findMany({
        populate: relations ? relations.split(',').map(r => `${r}`.trim()) : [],
        limit,
        offset
      });
    }
  }
};

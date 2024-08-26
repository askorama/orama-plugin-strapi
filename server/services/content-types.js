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

    async getEntries(contentType, relations = '') {
      const entries = await strapi.query(contentType).findMany({
        populate: relations ? relations.split(',').map(r => `${r}`.trim()) : [],
      });

      strapi.log.debug(`Found ${entries.length} entries for content type ${contentType}`);

      // TODO: remove this log
      console.log('Documents:', entries);

      return entries;
    }
  }
};

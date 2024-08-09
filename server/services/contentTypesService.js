'use strict';

// Check if all of this is necessary
// We could just pick 'api::' content types

const IGNORED_PLUGINS = ['admin', 'upload', 'i18n']
const IGNORED_CONTENT_TYPES = [
  'plugin::users-permissions.permission',
  'plugin::users-permissions.role',
  'plugin::content-releases.release',
  'plugin::content-releases.release-action',
  'plugin::users-permissions.user'
]

const removeIgnoredAPIs = ({ contentTypes }) => {
  const contentTypeUIDs = Object.keys(contentTypes)

  return contentTypeUIDs.reduce((sanitized, contentType) => {
    if (
      !(
        IGNORED_PLUGINS.includes(contentTypes[contentType].plugin) ||
        IGNORED_CONTENT_TYPES.includes(contentType)
      )
    ) {
      sanitized[contentType] = contentTypes[contentType]
    }
    return sanitized
  }, {})
}

module.exports = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  getContentTypesUID() {
    const contentTypes = removeIgnoredAPIs({
      contentTypes: strapi.contentTypes,
    })

    return Object.keys(contentTypes)
  },

  async getEntries({ contentType }) {
    return await strapi.query(contentType).findMany();
  }
});

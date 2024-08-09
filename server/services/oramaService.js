'use strict';

module.exports = ({ strapi }) => ({
  createIndex({ documents }) {
    // Create index and update Strapi-Orama configuration
  },
  updateIndex({ indexId, documents }) {
    // Update index (called only if index already exists)
  },
  deployIndex({ indexId }) {
    // Deploy index
  }
});

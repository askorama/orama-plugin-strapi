'use strict';

module.exports = ({ strapi }) => ({
  async updateIndex({ indexId, documents }) {
    // Update index
  },
  async deployIndex({ indexId }) {
    // Deploy index
  },

  async processLiveUpdate(collection, entity) {
    console.log(`Processing live update for ${collection.entity} with indexId ${collection.indexId}:`, entity);
  },

  async processScheduledUpdate(collection) {
    console.log(`Processing scheduled update for ${collection.entity} with indexId ${collection.indexId}`);
  }
});

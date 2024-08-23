'use strict';

module.exports = ({ strapi }) => {
  const collectionService = strapi.plugin('orama').service('collectionsService');

  return {
    async updateIndex({ indexId, documents }) {
      // Update index
    },

    async deployIndex({ indexId }) {
      // Deploy index
    },

    async processLiveUpdate(collection, entity, action) {
      const privateApiKey = strapi.config.get('plugin.orama.privateApiKey');
      if (!privateApiKey) {
        strapi.log.error('Private API key is required to process index updates');
        return;
      }

      if (collection.status === 'updating') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`);
        return;
      }

      if (collection.status === 'updated') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`);
        return;
      }

      strapi.log.debug(`Processing live update for ${collection.entity} with indexId ${collection.indexId}`);

      strapi.log.debug(`Action: ${action}`);
      strapi.log.debug(`Entity: ${JSON.stringify(entity)}`);

      await collectionService.update(collection.id, {
        status: 'updating'
      });

      // TODO: 
      // Update the index
      // Deploy the index
      await new Promise(resolve => setTimeout(resolve, 15000));
      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`);

      await collectionService.update(collection.id, {
        status: 'updated',
        deployedAt: new Date()
      });
    },

    async processScheduledUpdate(collection) {
      const privateApiKey = strapi.config.get('plugin.orama.privateApiKey');
      if (!privateApiKey) {
        strapi.log.error('Private API key is required to process index updates');
        return;
      }

      if (collection.status === 'updating') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`);
        return;
      }

      if (collection.status === 'updated') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`);
        return;
      }

      strapi.log.debug(`Processing scheduled update for ${collection.entity} with indexId ${collection.indexId}`);

      await collectionService.update(collection.id, {
        status: 'updating'
      });

      // TODO: 
      // Fetch data from the database
      // Update the index
      // Deploy the index
      await new Promise(resolve => setTimeout(resolve, 15000));
      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`);

      await collectionService.update(collection.id, {
        status: 'updated',
        deployedAt: new Date()
      });
    }
  }
};

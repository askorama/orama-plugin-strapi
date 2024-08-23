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

    async updateCollection(id, data) {
      await collectionService.update(id, data);
    },

    async processLiveUpdate(collection, entity) {
      strapi.log.debug(`Processing live update for ${collection.entity} with indexId ${collection.indexId}`);

      if (collection.status === 'updating') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`);
        return;
      }

      if (collection.status !== 'outdated') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`);
        return;
      }

      await this.updateCollection(collection.id, {
        status: 'updating'
      });

      await new Promise(resolve => setTimeout(resolve, 15000));
      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`);

      await this.updateCollection(collection.id, {
        status: 'updated',
        deployedAt: new Date()
      });
    },

    async processScheduledUpdate(collection) {
      strapi.log.debug(`Processing scheduled update for ${collection.entity} with indexId ${collection.indexId}`);

      if (collection.status === 'updating') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`);
        return;
      }

      if (collection.status !== 'outdated') {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`);
        return;
      }

      await this.updateCollection(collection.id, {
        status: 'updating'
      });

      await new Promise(resolve => setTimeout(resolve, 15000));
      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`);

      await this.updateCollection(collection.id, {
        status: 'updated',
        deployedAt: new Date()
      });
    }
  }
};

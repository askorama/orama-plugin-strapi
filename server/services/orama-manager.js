'use strict';

const { CloudManager } = require('@oramacloud/client');

module.exports = ({ strapi }) => {
  const contentTypesService = strapi.plugin('orama').service('contentTypesService');
  const collectionService = strapi.plugin('orama').service('collectionsService');
  const privateApiKey = strapi.config.get('plugin.orama.privateApiKey');

  async function snapshotIndex({ indexId, documents }) {
    const oramaCloudManager = new CloudManager({ api_key: privateApiKey });
    const index = oramaCloudManager.index(indexId)
    await index.snapshot([]);
    await index.snapshot(documents);
    await index.deploy();

    strapi.log.info(`Index ${indexId} snapshot created and deployed`);
  }

  return {
    async processLiveUpdate({ id }, record, action) {
      const collection = await collectionService.findOne(id);

      if (!collection) {
        strapi.log.error(`Collection with id ${id} not found`);
        return;
      }

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

      await collectionService.updateWithoutHooks(collection.id, { status: 'updating' });

      // getting all the entries and create a new snapshot
      const entries = await contentTypesService.getEntries(collection.entity);

      if (entries.length === 0) {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} has no entries`);
        return;
      }

      await snapshotIndex({
        indexId: collection.indexId,
        documents: entries.map(record => ({ ...record }))
      });

      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`);

      await collectionService.updateWithoutHooks(collection.id, {
        status: 'updated',
        deployed_at: new Date().getTime()
      });
    },

    async processScheduledUpdate({ id }) {
      const collection = await collectionService.findOne(id);

      if (!collection) {
        strapi.log.error(`Collection with id ${id} not found`);
        return;
      }

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

      strapi.log.debug(`Processing scheduled index update for ${collection.entity} with indexId ${collection.indexId}`);

      await collectionService.updateWithoutHooks(collection.id, { status: 'updating' });

      // getting all the entries and create a new snapshot
      const entries = await contentTypesService.getEntries(collection.entity);

      if (entries.length === 0) {
        strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} has no entries`);
        return;
      }

      await snapshotIndex({
        indexId: collection.indexId,
        documents: entries.map(record => ({ ...record }))
      });

      strapi.log.debug(`Scheduled update for ${collection.entity} with indexId ${collection.indexId} completed`);

      await collectionService.updateWithoutHooks(collection.id, {
        status: 'updated',
        deployed_at: new Date().getTime()
      });
    }
  }
};

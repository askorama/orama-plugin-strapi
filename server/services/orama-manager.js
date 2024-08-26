'use strict';

const { CloudManager } = require('@oramacloud/client');

module.exports = ({ strapi }) => {
  const contentTypesService = strapi.plugin('orama').service('contentTypesService');
  const collectionService = strapi.plugin('orama').service('collectionsService');
  const privateApiKey = strapi.config.get('plugin.orama.privateApiKey');

  const validate = (collection) => {
    if (!collection) {
      strapi.log.error(`Collection with id ${collection.id} not found`);
      return false;
    }

    if (!privateApiKey) {
      strapi.log.error('Private API key is required to process index updates');
      return false;
    }

    if (collection.status === 'updating') {
      strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`);
      return false;
    }

    if (collection.status === 'updated') {
      strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`);
      return false;
    }

    return true;
  }

  const updatingStarted = async (collection) => {
    return await collectionService.updateWithoutHooks(collection.id, { status: 'updating' });
  }

  const updatingCompleted = async (collection, documents = []) => {
    return await collectionService.updateWithoutHooks(collection.id, {
      status: 'updated',
      deployed_at: new Date().getTime(),
      documents_count: documents.length
    });
  }

  const snapshotIndex = async ({ indexId, documents }) => {
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

      strapi.log.debug(`Processing live update for ${collection.entity} with indexId ${collection.indexId}`);

      if (!validate(collection)) {
        return;
      }

      await updatingStarted(collection);

      const entries = await contentTypesService.getEntries(collection.entity, collection.includeRelations);

      if (entries.length > 0) {
        await snapshotIndex({
          indexId: collection.indexId,
          documents: entries.map(record => ({ ...record }))
        });
      }

      await updatingCompleted(collection, entries);

      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`);
    },

    async processScheduledUpdate({ id }) {
      const collection = await collectionService.findOne(id);

      strapi.log.debug(`Processing scheduled index update for ${collection.entity} with indexId ${collection.indexId}`);

      if (!validate(collection)) {
        return;
      }

      await updatingStarted(collection);

      const entries = await contentTypesService.getEntries(collection.entity, collection.includeRelations);

      if (entries.length > 0) {
        await snapshotIndex({
          indexId: collection.indexId,
          documents: entries.map(record => ({ ...record }))
        });
      }

      await updatingCompleted(collection, entries);

      strapi.log.debug(`Scheduled update for ${collection.entity} with indexId ${collection.indexId} completed`);
    }
  }
};

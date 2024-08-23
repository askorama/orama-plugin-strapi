'use strict';

const cron = require("./cron");

module.exports = ({ strapi }) => {
    const oramaService = strapi.plugin('orama').service('oramaManagerService');
    const collectionService = strapi.plugin('orama').service('collectionsService');
    const cronService = strapi.plugin('orama').service('cronService');

    return {
        registerLifecycleHooks(collection) {
            const { id, entity } = collection;

            // Remove any existing cron job for the collection
            cronService.removeCronJob(id);

            // Register lifecycle hooks to trigger updates when an entity is created, updated or deleted
            strapi.db.lifecycles.subscribe({
                models: [entity],
                async afterCreate(event) {
                    await handleLiveUpdates(event, 'create');
                },
                async afterUpdate(event) {
                    await handleLiveUpdates(event, 'update');
                },
                async afterDelete(event) {
                    await handleLiveUpdates(event, 'delete');
                },
            });
            async function handleLiveUpdates(event, action) {
                const { model, result } = event;

                await collectionService.updateWithoutHooks(collection.id, { status: 'outdated' });

                oramaService.processLiveUpdate(collection, result, action);
            }
        },
    }
};

'use strict';

module.exports = async ({ strapi }) => {
  const oramaService = strapi.plugin('orama').service('oramaManagerService');
  const collectionService = strapi.plugin('orama').service('collectionsService');

  /**
   * Setup strapi lifecycle hooks for all the content types 
   * that are mapped in collections with updateHook = live
   */
  const liveUpdates = await strapi.query('plugin::orama.collection').findMany({
    where: {
      updateHook: 'live'
    }
  });

  if (liveUpdates.length > 0) {
    async function handleEvent(event) {
      const { model, result } = event;

      const collection = await strapi.query('plugin::orama.collection').findOne({
        where: { entity: model.uid },
      });

      if (collection) {
        await collectionService.update(collection.id, {
          ...collection,
          status: 'updating'
        });

        await oramaService.processLiveUpdate(collection, result);

        await collectionService.update(collection.id, {
          ...collection,
          status: 'updated',
          deployedAt: new Date()
        });
      }
    }
    strapi.db.lifecycles.subscribe({
      models: [...new Set(liveUpdates.map(c => c.entity))],
      async afterCreate(event) {
        await handleEvent(event);
      },
      async afterUpdate(event) {
        await handleEvent(event);
      },
      async afterDelete(event) {
        await handleEvent(event);
      },
    });
  }

  /**
   * Setup cron jobs for collections with updateHook = cron
   * The frequency of the cron job is defined by the updateCron field.
   */
  const scheduledUpdates = await strapi.query('plugin::orama.collection').findMany({
    where: {
      updateHook: 'cron'
    }
  });

  scheduledUpdates.forEach(collection => {
    strapi.cron.add({
      ['orama-update-collection-' + collection.id]: {
        task: async () => {
          try {
            console.log('Updating collection:', collection);

            await collectionService.update(collection.id, {
              ...collection,
              status: 'updating'
            });

            await oramaService.processScheduledUpdate(collection);

            await collectionService.update(collection.id, {
              ...collection,
              status: 'updated',
              deployedAt: new Date()
            });
          } catch (error) {
            console.error(error);
          }
        },
        options: {
          rule: collection.updateCron
        }
      }
    })
  });
};

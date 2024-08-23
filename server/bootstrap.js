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
    strapi.db.lifecycles.subscribe({
      models: [...new Set(liveUpdates.map(c => c.entity))],
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

      const collection = await strapi.query('plugin::orama.collection').findOne({
        where: {
          entity: model.uid,
          updateHook: 'live'
        },
      });

      if (!collection) {
        strapi.log.warn('Collection not found - entity: ', model.uid);
        return;
      }

      if (collection?.status === 'updating') {
        strapi.log.warn('Collection is already updating - indexId: ', collection?.indexId);
        return;
      }

      if (collection.status === 'outdated') {
        oramaService.processLiveUpdate(collection, result, action);
      } else {
        oramaService.processLiveUpdate(await collectionService.update(collection.id, { status: 'outdated' }), result);
      }
    }
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
            oramaService.processScheduledUpdate(collection);
          } catch (error) {
            strapi.log.error(error);
          }
        },
        options: {
          rule: collection.updateCron
        }
      }
    })
  });

  if (scheduledUpdates.length > 0) {
    strapi.db.lifecycles.subscribe({
      models: [...new Set(scheduledUpdates.map(c => c.entity))],
      async afterCreate(event) {
        await handleUpdateStatus(event);
      },
      async afterUpdate(event) {
        await handleUpdateStatus(event);
      },
      async afterDelete(event) {
        await handleUpdateStatus(event);
      },
    });
    async function handleUpdateStatus({ model }) {
      const collection = await strapi.query('plugin::orama.collection').findOne({
        where: { entity: model.uid },
      });

      if (collection) {
        await collectionService.update(collection.id, {
          status: 'outdated'
        });
      }
    }
  }
};

'use strict';

module.exports = async ({ strapi }) => {
  const cronService = strapi.plugin('orama').service('cronService');
  const liveUpdatesService = strapi.plugin('orama').service('liveUpdatesService');

  /**
   * Setup strapi lifecycle hooks for all the content types 
   * that are mapped in collections with updateHook = "live"
   */
  const liveUpdates = await strapi.query('plugin::orama.collection').findMany({
    where: {
      updateHook: 'live'
    }
  });

  liveUpdates.forEach(collection => liveUpdatesService.registerLifecycleHooks(collection));

  /**
   * Setup cron jobs for collections with updateHook = "cron"
   * The frequency of the cron job is defined by the updateCron field.
   */
  const scheduledUpdates = await strapi.query('plugin::orama.collection').findMany({
    where: {
      updateHook: 'cron'
    }
  });

  scheduledUpdates.forEach(collection => cronService.registerCronJob(collection));
};

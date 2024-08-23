module.exports = {
    afterUpdate: async (event) => {
        console.log('afterUpdate', event.result, strapi.plugin('orama').service('cronService'));
        const { result } = event;

        if (result.updateHook === 'cron') {
            const cronService = strapi.plugin('orama').service('cronService');
            cronService.registerCronJob(result);
        }

        if (result.updateHook === 'live') {
            const liveUpdateService = strapi.plugin('orama').service('liveUpdatesService');
            liveUpdateService.registerLifecycleHooks(result);
        }
    },

    afterCreate: async (event) => {
        console.log('afterCreate', event.result, strapi.plugin('orama'));
        const { result } = event;

        if (result.updateHook === 'cron') {
            const cronService = strapi.plugin('orama').service('cronService');
            cronService.registerCronJob(result);
        }

        if (result.updateHook === 'live') {
            const liveUpdateService = strapi.plugin('orama').service('liveUpdatesService');
            liveUpdateService.registerLifecycleHooks(result);
        }
    },

    afterDelete: async (event) => {
        console.log('afterDelete', event.result, strapi.plugin('orama'));
        const { result } = event;

        if (result.updateHook === 'cron') {
            const cronService = strapi.plugin('orama').service('cronService');
            cronService.registerCronJob(result);
        }

        if (result.updateHook === 'live') {
            const liveUpdateService = strapi.plugin('orama').service('liveUpdatesService');
            liveUpdateService.registerLifecycleHooks(result);
        }
    },
};

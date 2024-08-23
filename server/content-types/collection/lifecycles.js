module.exports = {
    afterUpdate: async (event) => {
        console.log('afterUpdate hook', event.params);
        if (event.params.data.__skipAfterUpdateHook) {
            return;
        }

        console.log('afterUpdate', event.result, strapi.plugin('orama').service('cronService'));
        const { result } = event;
        const cronService = strapi.plugin('orama').service('cronService');
        cronService.registerCronJob(result);
    },

    afterCreate: async (event) => {
        console.log('afterCreate', event.result, strapi.plugin('orama'));
        const { result } = event;
        const cronService = strapi.plugin('orama').service('cronService');
        cronService.registerCronJob(result);
    },

    afterDelete: async (event) => {
        console.log('afterDelete', event.result, strapi.plugin('orama'));
        const { result } = event;
        const cronService = strapi.plugin('orama').service('cronService');
        cronService.removeCronJob(result.id);
    },
};

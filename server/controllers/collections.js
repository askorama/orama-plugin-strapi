'use strict';

module.exports = ({ strapi }) => {
  return {
    async find(ctx) {
      const collections = await strapi.plugin('orama')
        .service('collectionsService')
        .find();
      ctx.send(collections);
    },

    async findOne(ctx) {
      const { id } = ctx.params;
      const collection = await strapi.plugin('orama')
        .service('collectionsService')
        .findOne(id);
      if (!collection) {
        return ctx.notFound();
      }
      ctx.send(collection);
    },

    async create(ctx) {
      const collection = await strapi.plugin('orama')
        .service('collectionsService')
        .create(ctx.request.body);
      ctx.send(collection);
    },

    async update(ctx) {
      const { id } = ctx.params;
      const updatedCollection = await strapi.plugin('orama')
        .service('collectionsService')
        .update(id, ctx.request.body);
      ctx.send(updatedCollection);
    },

    async delete(ctx) {
      const { id } = ctx.params;
      const deletedCollection = await strapi.plugin('orama')
        .service('collectionsService')
        .delete(id);
      ctx.send(deletedCollection);
    },
  }
};

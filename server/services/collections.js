'use strict';

const ENTITY_NAME = 'plugin::orama.collection';

module.exports = ({ strapi }) => {
  return {
    /**
     * Find all collection records
     */
    async find() {
      return strapi.entityService.findMany(ENTITY_NAME);
    },

    /**
     * Find a collection record by id
     * @param {string} id 
     */
    async findOne(id) {
      return strapi.entityService.findOne(ENTITY_NAME, id);
    },

    /**
     * Create a new collection record
     * @param {object} data 
     */
    async create(data) {
      return strapi.entityService.create(ENTITY_NAME, {
        data: {
          ...data,
          status: 'outdated',
        }
      });
    },

    /**
     * Update a collection record by id
     * @param {string} id
     * @param {object} data
     */
    async update(id, data) {
      return strapi.entityService.update(ENTITY_NAME, id, {
        data: {
          ...data,
          status: 'outdated',
        }
      });
    },

    /**
     * Update the status of a collection record by id
     * without triggering lifecycle hooks.
     * 
     * @param {string} id
     * @param {object} data
     */
    async updateWithoutHooks(id, data) {
      await strapi.db.connection('orama_collections')
        .where({ id })
        .update(data);

      return await strapi.entityService.findOne('plugin::orama.collection', id);
    },

    /**
     * Delete a collection record by id
     * @param {string} id 
     */
    async delete(id) {
      return strapi.entityService.delete(ENTITY_NAME, id);
    },

    /**
     * Deploy a collection record by id
     * @param {string} id 
     */
    async deploy(id) {
      const collection = await this.findOne(id);

      if (!collection) {
        throw new Error(`Collection with id ${id} not found`);
      }

      await this.updateWithoutHooks(id, { status: 'outdated' });

      strapi.plugin('orama')
        .service('oramaManagerService')
        .processLiveUpdate({ id });
    }
  }
};

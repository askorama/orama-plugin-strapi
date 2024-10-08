'use strict'

const DOCUMENT_NAME = 'plugin::orama-cloud.collection'

module.exports = ({ strapi }) => {
  return {
    /**
     * Find all collection records
     */
    async find() {
      return strapi.documents(DOCUMENT_NAME).findMany()
    },

    /**
     * Find a collection record by id
     * @param {string} id
     */
    async findOne(id) {
      return strapi.documents(DOCUMENT_NAME).findOne({ documentId: id })
    },

    /**
     * Create a new collection record
     * @param {object} data
     */
    async create(data) {
      const document = await strapi.documents(DOCUMENT_NAME).create({
        data: {
          ...data,
          status: 'outdated'
        }
      })

      strapi.plugin('orama-cloud').service('oramaManagerService').afterCollectionCreationOrUpdate({ id: document.id })

      return document
    },

    /**
     * Update a collection record by id
     * @param {string} id
     * @param {object} data
     */
    async update(id, data) {
      const document = await strapi.documents(DOCUMENT_NAME).update({
        documentId: id,
        data: {
          ...data,
          status: 'outdated'
        }
      })

      strapi.plugin('orama-cloud').service('oramaManagerService').afterCollectionCreationOrUpdate({ id: document.id })

      return entity
    },

    /**
     * Update the status of a collection record by id
     * without triggering lifecycle hooks.
     *
     * @param {string} id
     * @param {object} data
     */
    async updateWithoutHooks(id, data) {
      await strapi.db.connection('orama-cloud_collections').where({ id }).update(data)

      return await this.findOne(id)
    },

    /**
     * Delete a collection record by id
     * @param {string} id
     */
    async delete(id) {
      return strapi.documents(DOCUMENT_NAME).delete({ documentId: id })
    },

    /**
     * Deploy a collection record by id
     * @param {string} id
     */
    async deploy(id) {
      const collection = await this.findOne(id)

      if (!collection) {
        throw new Error(`Collection with id ${id} not found`)
      }

      await this.updateWithoutHooks(id, { status: 'outdated' })

      strapi.plugin('orama-cloud').service('oramaManagerService').deployIndex({ id })
    }
  }
}

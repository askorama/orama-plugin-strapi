'use strict';

const filterContentTypesAPIs = ({ contentTypes }) => {
  return Object.keys(contentTypes).reduce((sanitized, contentType) => {
    if (contentType.startsWith('api::')) {
      sanitized[contentType] = contentTypes[contentType]
    }
    return sanitized
  }, {})
}

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
      return strapi.entityService.find(ENTITY_NAME, id);
    },
  
    /**
     * Create a new collection record
     * @param {object} data 
     */
    async create(data) {
      return strapi.entityService.create(ENTITY_NAME, { data });
    },
  
    /**
     * Update a collection record by id
     * @param {string} id
     * @param {object} data
     */
    async update(id, data) {
      return strapi.entityService.update(ENTITY_NAME, id, { data });
    },
  
    /**
     * Delete a collection record by id
     * @param {string} id 
     */ 
    async delete(id) {
      return strapi.entityService.delete(ENTITY_NAME, id);
    },

    getCollections() {
      return [
        { id: '1', name: 'Posts', status: 1, contentType: 'api::post.post', indexId: 'jl6x7glod9t4vpvv3grmh3gr', deployed_at: '2024-08-19T12:00:00Z', documents_count: 100 },
        { id: '2', name: 'Categories', status: 2, contentType: 'api::categories.categories', indexId: 'm8ncx795yjpfksckpkpf59b1' },
        { id: '3', name: 'Tags', status: 3, contentType: 'api::tags.tags', indexId: 'tctzuy689jq1fhqc5x074xfi' },
      ];
    },
  }
};

'use strict'

module.exports = ({ strapi }) => {
  return {
    async getContentTypes(ctx) {
      const contentTypes = strapi.plugin('orama-cloud').service('contentTypesService').getContentTypes()

      return contentTypes
    },

    getAvailableRelations(ctx) {
      const { id } = ctx.params
      const relations = strapi
        .plugin('orama-cloud')
        .service('contentTypesService')
        .getAvailableRelations({ contentTypeId: id })

      return relations
    },

    async getContentTypesSchema(ctx) {
      const { id } = ctx.params
      const { includedRelations } = ctx.query

      const includedRelationsArray = includedRelations?.split(',') || []

      const schema = strapi.plugin('orama-cloud').service('contentTypesService').getContentTypeSchema({
        contentTypeId: id,
        includedRelations: includedRelationsArray
      })

      return schema
    }
  }
}

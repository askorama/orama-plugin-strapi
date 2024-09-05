"use strict"

const OramaTypesMap = {
  "string": "string",
  "text": "string",
  "email": "string",
  "richtext": "string",
  "boolean": "boolean",
  "integer": "number",
  "biginteger": "number",
  "decimal": "number",
  "float": "number",
}

const filterContentTypesAPIs = ({ contentTypes }) => {
  return Object.keys(contentTypes).reduce((sanitized, contentType) => {
    if (contentType.startsWith("api::")) {
      sanitized[contentType] = contentTypes[contentType]
    }
    return sanitized
  }, {})
}

const isValidType = (type) => {
  return !["component", "datetime", "media", "blocks", "json"].includes(type)
}

const isValidRelation = ({ attribute, includedRelations }) => {
  return attribute.target.startsWith("api::") && (includedRelations.includes(attribute.name) || includedRelations === "*")
}

const shouldAttributeBeIncluded = (attribute, includedRelations) =>
  attribute.type === "relation"
    ? isValidRelation({ attribute, includedRelations })
    : isValidType(attribute.type)

module.exports = ({ strapi }) => {
  return {
    getContentTypes() {
      const contentTypes = filterContentTypesAPIs({
        contentTypes: strapi.contentTypes,
      })

      return Object.entries(contentTypes).map(([contentType, c]) => ({
        value: contentType,
        label: c.info.displayName,
      }))
    },

    async getEntries({ contentType, relations = "", offset = 0, limit = 50 }) {
      return await strapi.query(contentType).findMany({
        populate: relations ? relations.split(",").map(r => `${r}`.trim()) : [],
        limit,
        offset
      })
    },

    getAvailableRelations({ contentTypeId }) {
      const contentType = strapi.contentTypes[contentTypeId]
      const res = Object.entries(contentType.attributes).reduce((relations, [attributeName, attributeValue]) => {
        if (attributeValue.type === "relation" && isValidRelation({
          attribute: {
            name: attributeName,
            target: attributeValue.target
          }, includedRelations: "*"
        })) {
          relations.push({
            value: attributeName,
            label: attributeValue.target
          })
        }

        return relations
      }, [])

      return res
    },

    getType(attribute) {
      if (attribute.type === "relation") {
        return this.getContentTypeSchema({
          contentTypeId: attribute.target,
          includedRelations: []
        })
      }

      return OramaTypesMap[attribute.type]
    },

    getSchemaFromContentTypeAttributes({ attributes, includedRelations }) {
      return Object.entries(attributes).reduce((schema, [attributeName, attributeValue]) => {
        if (shouldAttributeBeIncluded({
          type: attributeValue.type,
          name: attributeName,
          target: attributeValue.target
        }, includedRelations)) {
          schema[attributeName] = this.getType(attributeValue)
        }
        return schema
      }, {})
    },

    getContentTypeSchema({ contentTypeId, includedRelations }) {
      const contentType = strapi.contentTypes[contentTypeId]
      return this.getSchemaFromContentTypeAttributes({
        attributes: contentType.attributes,
        includedRelations
      })
    }
  }
}

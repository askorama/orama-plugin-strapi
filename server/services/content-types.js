"use strict"

const OramaTypesMap = {
  "string": "string",
  "text": "string",
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

const isValidRelation = ({ attribute, includeRelations }) => {
  return attribute.target.startsWith("api::") && includeRelations
}

const shouldAttributeBeIncluded = (attribute, includeRelations) =>
  attribute.type === "relation"
    ? isValidRelation({ attribute, includeRelations })
    : isValidType(attribute.type);

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

    getType(attribute) {
      if (attribute.type === "relation") {
        return this.getContentTypeSchema({
          contentTypeId: attribute.target,
          includeRelations: false
        })
      }

      return OramaTypesMap[attribute.type]
    },

    getSchemaFromContentTypeAttributes({ attributes, includeRelations }) {
      return Object.entries(attributes).reduce((schema, [attributeName, attributeValue]) => {
        if (shouldAttributeBeIncluded(attributeValue, includeRelations)) {
          schema[attributeName] = this.getType(attributeValue);
        }
        return schema;
      }, {})
    },

    getContentTypeSchema({ contentTypeId, includeRelations = true }) {
      const contentType = strapi.contentTypes[contentTypeId]
      return this.getSchemaFromContentTypeAttributes({
        attributes: contentType.attributes,
        includeRelations
      })
    }
  }
}

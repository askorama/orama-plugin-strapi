'use strict'

const { CloudManager } = require('@oramacloud/client')
const { getSchemaFromEntryStructure, filterSearchableAttributesEntry } = require('../../utils/schema')

class OramaManager {
  constructor({ strapi }) {
    this.strapi = strapi
    this.contentTypesService = strapi.plugin('orama-cloud').service('contentTypesService')
    this.collectionService = strapi.plugin('orama-cloud').service('collectionsService')
    this.privateApiKey = strapi.config.get('plugin.orama-cloud.privateApiKey')
    this.documentsTransformer = strapi.config.get('plugin.orama-cloud.documentsTransformer')

    this.oramaCloudManager = new CloudManager({ api_key: this.privateApiKey })
    this.DocumentActionsMap = {
      create: this.oramaInsert.bind(this),
      update: this.oramaUpdate.bind(this),
      delete: this.oramaDelete.bind(this)
    }
  }

  validate(collection) {
    if (!collection) {
      this.strapi.log.error(`Collection not found`)
      return false
    }

    if (!this.privateApiKey) {
      this.strapi.log.error('Private API key is required to process index updates')
      return false
    }

    if (collection.status === 'updating') {
      this.strapi.log.debug(
        `SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`
      )
      return false
    }

    if (collection.status === 'updated') {
      this.strapi.log.debug(
        `SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`
      )
      return false
    }

    return true
  }

  async setOutdated(collection) {
    return await this.collectionService.updateWithoutHooks(collection.id, {
      status: 'outdated'
    })
  }

  async updatingStarted(collection) {
    return await this.collectionService.updateWithoutHooks(collection.id, {
      status: 'updating'
    })
  }

  async updatingCompleted(collection, documents_count) {
    return await this.collectionService.updateWithoutHooks(collection.id, {
      status: 'updated',
      deployed_at: new Date(),
      ...(documents_count && { documents_count })
    })
  }

  async oramaDeployIndex({ indexId }) {
    const index = this.oramaCloudManager.index(indexId)
    const result = await index.deploy()

    this.strapi.log.info(`Index ${indexId} deployed`)

    return result
  }

  async resetIndex({ indexId }) {
    const index = this.oramaCloudManager.index(indexId)
    return await index.snapshot([])
  }

  async bulkInsert(collection, offset = 0) {
    const entries = await this.contentTypesService.getEntries({
      contentType: collection.entity,
      relations: collection.includedRelations,
      schema: collection.schema,
      offset
    })

    if (entries.length > 0) {
      if (offset === 0) {
        const exampleEntry = filterSearchableAttributesEntry(collection.searchableAttributes, entries[0])

        await this.oramaUpdateSchema({
          indexId: collection.indexId,
          schema: getSchemaFromEntryStructure(exampleEntry)
        })
      }

      await this.oramaInsert({
        indexId: collection.indexId,
        entries
      })

      return await this.bulkInsert(collection, offset + entries.length)
    }

    return { documents_count: offset }
  }

  async oramaUpdateSchema({ indexId, schema }) {
    const index = this.oramaCloudManager.index(indexId)
    await index.updateSchema({ schema })
  }

  async oramaInsert({ indexId, entries }) {
    const index = this.oramaCloudManager.index(indexId)
    const formattedData = this.documentsTransformer?.(entries) || entries

    if (!formattedData) {
      this.strapi.log.error(`ERROR: documentsTransformer needs a return value`)
      return false
    }

    const result = await index.insert(formattedData)

    this.strapi.log.info(`INSERT: documents with id ${formattedData.map(({ id }) => id)} into index ${indexId}`)

    return result
  }

  async oramaUpdate({ indexId, entries }) {
    const index = this.oramaCloudManager.index(indexId)
    const formattedData = this.documentsTransformer?.(entries) || entries

    if (!formattedData) {
      this.strapi.log.error(`ERROR: documentsTransformer needs a return value`)
      return false
    }

    const result = await index.update(formattedData)

    this.strapi.log.info(`UPDATE: document with id ${formattedData.map(({ id }) => id)} into index ${indexId}`)

    return result
  }

  async oramaDelete({ indexId, entries }) {
    const index = this.oramaCloudManager.index(indexId)
    const result = await index.delete(entries.map(({ id }) => id))

    this.strapi.log.info(`DELETE: document with id ${entries.map(({ id }) => id)} from index ${indexId}`)

    return result
  }

  async handleDocument({ indexId, record, action }) {
    if (!action || !record || !this.DocumentActionsMap[action]) {
      return false
    }

    const { createdBy, updatedBy, ...rest } = record

    return await this.DocumentActionsMap[action]({ indexId, entries: [{ ...rest, id: rest.id.toString() }] })
  }

  async afterCollectionCreationOrUpdate({ id }) {
    const collection = await this.collectionService.findOne(id)

    if (!this.validate(collection)) {
      return
    }

    await this.updatingStarted(collection)

    await this.resetIndex(collection)

    const { documents_count } = await this.bulkInsert(collection)

    await this.oramaDeployIndex(collection)

    await this.updatingCompleted(collection, documents_count)
  }

  async deployIndex({ id }) {
    const collection = await this.collectionService.findOne(id)

    this.strapi.log.debug(
      `Processing scheduled index update for ${collection.entity} with indexId ${collection.indexId}`
    )

    if (!this.validate(collection)) {
      return
    }

    await this.updatingStarted(collection)

    await this.oramaDeployIndex(collection)

    await this.updatingCompleted(collection)

    this.strapi.log.debug(`UPDATE: ${collection.entity} with indexId ${collection.indexId} completed`)
  }

  async processLiveUpdate({ id }, record, action) {
    const collection = await this.collectionService.findOne(id)

    if (!this.validate(collection)) {
      return
    }

    this.strapi.log.debug(`Processing live update for ${collection.entity} with indexId ${collection.indexId}`)

    await this.updatingStarted(collection)

    const handleDocumentResult = await this.handleDocument({
      indexId: collection.indexId,
      record,
      action
    })

    if (!handleDocumentResult) {
      await this.setOutdated(collection)
      return
    }

    await this.setOutdated(collection)

    this.strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`)
  }

  async processScheduledUpdate({ id }) {
    const collection = await this.collectionService.findOne(id)

    if (!this.validate(collection)) {
      return
    }

    this.strapi.log.debug(
      `Processing scheduled index update for ${collection.entity} with indexId ${collection.indexId}`
    )

    await this.updatingStarted(collection)

    await this.resetIndex(collection)

    const { documents_count } = await this.bulkInsert(collection)

    await this.updatingCompleted(collection, documents_count)

    this.strapi.log.debug(`Scheduled update for ${collection.entity} with indexId ${collection.indexId} completed`)
  }
}

module.exports = {
  OramaManager,
  service: ({ strapi }) => new OramaManager({ strapi })
}

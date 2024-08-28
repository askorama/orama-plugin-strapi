"use strict"

const { CloudManager } = require("@oramacloud/client")

module.exports = ({ strapi }) => {
  const contentTypesService = strapi.plugin("orama-cloud").service("contentTypesService")
  const collectionService = strapi.plugin("orama-cloud").service("collectionsService")
  const privateApiKey = strapi.config.get("plugin.orama-cloud.privateApiKey")

  const validate = (collection) => {
    if (!collection) {
      strapi.log.error(`Collection not found`)
      return false
    }

    if (!privateApiKey) {
      strapi.log.error("Private API key is required to process index updates")
      return false
    }

    if (collection.status === "updating") {
      strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updating`)
      return false
    }

    if (collection.status === "updated") {
      strapi.log.debug(`SKIP: Collection ${collection.entity} with indexId ${collection.indexId} is already updated`)
      return false
    }

    return true
  }

  const setOutdated = async (collection) => {
    return await collectionService.updateWithoutHooks(collection.id, {
      status: "outdated"
    })
  }

  const updatingStarted = async (collection) => {
    return await collectionService.updateWithoutHooks(collection.id, { status: "updating" })
  }

  const updatingCompleted = async (collection, documents_count) => {
    return await collectionService.updateWithoutHooks(collection.id, {
      status: "updated",
      deployed_at: new Date().getTime(),
      ...(documents_count && { documents_count })
    })
  }

  const deployIndex = async ({ indexId }) => {
    const oramaCloudManager = new CloudManager({ api_key: privateApiKey })
    const index = oramaCloudManager.index(indexId)
    await index.deploy()

    strapi.log.info(`Index ${indexId} deployed`)
  }

  const resetIndex = async ({ indexId }) => {
    const oramaCloudManager = new CloudManager({ api_key: privateApiKey })
    const index = oramaCloudManager.index(indexId)
    await index.snapshot([])
  }

  const bulkInsert = async (collection, offset = 0) => {
    const entries = await contentTypesService.getEntries({
      contentType: collection.entity,
      relations: collection.includeRelations,
      offset,
    })

    if (entries.length > 0) {
      await oramaInsert({
        indexId: collection.indexId,
        entries
      }, null)

      return await bulkInsert(collection, offset + entries.length)
    }

    return offset
  }

  const oramaInsert = async ({ indexId, entries }, callback) => {
    const oramaCloudManager = new CloudManager({ api_key: privateApiKey })
    const index = oramaCloudManager.index(indexId)
    await index.insert(entries)

    await callback?.()

    strapi.log.info(`INSERT: documents with id ${entries.map(({ id }) => id)} into index ${indexId}`)
  }

  const oramaUpdate = async ({ indexId, entries }, callback) => {
    const oramaCloudManager = new CloudManager({ api_key: privateApiKey })
    const index = oramaCloudManager.index(indexId)

    await index.update(entries)

    await callback?.()

    strapi.log.info(`UPDATE: document with id ${entries.map(({ id }) => id)} into index ${indexId}`)
  }

  const oramaDelete = async ({ indexId, entries }, callback) => {
    const oramaCloudManager = new CloudManager({ api_key: privateApiKey })
    const index = oramaCloudManager.index(indexId)
    await index.delete(entries.map(({ id }) => id))

    await callback?.()

    strapi.log.info(`DELETE: document with id ${entries.map(({ id }) => id)} from index ${indexId}`)
  }

  const DocumentActionsMap = {
    create: oramaInsert,
    update: oramaUpdate,
    delete: oramaDelete
  }

  const handleDocument = async ({ indexId, record, action }, callback) => {
    if (!action || !record || !DocumentActionsMap[action]) {
      return
    }

    const { createdBy, updatedBy, ...rest } = record

    return await DocumentActionsMap[action]({ indexId, entries: [{ ...rest, id: rest.id.toString() }] }, callback)
  }

  return {
    async afterCreation({ id }) {
      const collection = await collectionService.findOne(id)

      if (!validate(collection)) {
        return
      }

      await updatingStarted(collection)

      await resetIndex(collection)

      const documents_count = await bulkInsert(collection)

      await deployIndex(collection)

      await updatingCompleted(collection, documents_count)
    },

    async deployIndex({ id }) {
      const collection = await collectionService.findOne(id)

      strapi.log.debug(`Processing scheduled index update for ${collection.entity} with indexId ${collection.indexId}`)

      if (!validate(collection)) {
        return
      }

      await updatingStarted(collection)

      await deployIndex(collection)

      await updatingCompleted(collection)

      strapi.log.debug(`UPDATE: ${collection.entity} with indexId ${collection.indexId} completed`)
    },

    async processLiveUpdate({ id }, record, action) {
      const collection = await collectionService.findOne(id)

      if (!validate(collection)) {
        return
      }

      strapi.log.debug(`Processing live update for ${collection.entity} with indexId ${collection.indexId}`)

      await updatingStarted(collection)

      await handleDocument({
        indexId: collection.indexId,
        record,
        action
      }, async () => {
        await setOutdated(collection)
      })

      strapi.log.debug(`Live update for ${collection.entity} with indexId ${collection.indexId} completed`)
    },

    async processScheduledUpdate({ id }) {
      const collection = await collectionService.findOne(id)

      if (!validate(collection)) {
        return
      }

      strapi.log.debug(`Processing scheduled index update for ${collection.entity} with indexId ${collection.indexId}`)

      await updatingStarted(collection)

      await resetIndex(collection)

      const documents_count = await bulkInsert(collection)

      await updatingCompleted(collection, documents_count)

      strapi.log.debug(`Scheduled update for ${collection.entity} with indexId ${collection.indexId} completed`)
    }
  }
}

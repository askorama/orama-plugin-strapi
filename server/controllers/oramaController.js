"use strict"

module.exports = ({ strapi }) => ({
  sendToOrama({ contentTypes }) {
    /*
    * Fetch entries for each content type chosen by the user
    */
    const documents = strapi.plugin("orama").service("contentTypesService").getEntries({ contentTypes })

    /*
    * Create index and update Strapi-Orama configuration
    */
    const indexCreationResult = strapi.plugin("orama").service("oramaService").createIndex()

    /*
    * Deploy index to Orama
    * */
    const indexDeploymentResult = strapi.plugin("orama").service("oramaService").deployIndex({ indexId: indexCreationStatus.indexId })

    /*
    * Temporary return value
    * */
    return { indexCreationResult, indexDeploymentResult }
  },
})

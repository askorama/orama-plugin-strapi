# Orama Cloud - Strapi Plugin

## Introduction

The Orama Cloud Strapi plugin integrates Orama Cloud's search and answers engine into your Strapi application, providing
seamless search capabilities.

## Installation (via package manager)

**npm**

 ```sh
    npm install @oramacloud/strapi-plugin
 ```

**yarn**

 ```sh
    yarn add @oramacloud/strapi-plugin
 ```

**pnpm**

 ```sh
    pnpm add @oramacloud/strapi-plugin
 ```

## Installation (via Strapi Marketplace)

1. Go to your Strapi administration dashboard.
2. Navigate to the `Marketplace` section.
3. Search for `Orama Cloud` and install the plugin.

## Configuration

Configure the plugin in the `config/plugins.js` file:

```js
// config/plugins.js

module.exports = ({ env }) => ({
  "orama-cloud": {
    config: {
      privateApiKey: env('ORAMA_PRIVATE_API_KEY'),
    },
  },
});
```

Your `ORAMA_PRIVATE_API_KEY` will be automatically generated when you create the index. You can also generate a new Private API Key in [Developer tools](https://cloud.orama.com/developer-tools) page on Orama Cloud.

## Usage

Configure and manage `Collections` that map your Strapi app Content-Types with an Index
on [Orama Cloud](https://cloud.orama.com/indexes).

### Creating an index

- Visit Orama Cloud and [Create](https://cloud.orama.com/indexes/create/from-native-integrations) a new index with data source "**Strapi**".
- Once your index is ready, copy your Private API Key and configure it in your app's `config/plugins.js` configuration file.
- Copy the `indexId` and visit your Strapi administration dashboard to configure your first collection.

### Managing collections

Collections map your Content-Types on Strapi with an index on Orama Cloud. To keep your index in sync with the data, you
can configure the update settings for each collection.

- Select `Orama Cloud` from your Strapi admin menu to manage your collections.
- Add a new collection.

<img src="https://raw.githubusercontent.com/askorama/orama-plugin-strapi/main/misc/assets/collection.png" alt="Collection form" width="600" />

- Paste your newly created `indexId`.
- Select a Content Type.
- (Optional) Specify the related records to include.
- Configure your document schema and your searchable properties.
- Select the Update Settings option:
  - **Live updates** will update your index as soon as any content is created, updated or deleted.
  - **Scheduled job** will automatically update your index at a defined frequency: every 30 minutes, hourly, daily,
    weekly or monthly.

When an index is not in sync with the latest changes in Strapi, the collection status is set to `outdated`.
When the **Scheduled job** is executed, it checks the collection status, to avoid triggering an update if the data is
already in sync. You can always trigger a new deployment manually.

<img src="https://raw.githubusercontent.com/askorama/orama-plugin-strapi/main/misc/assets/deploy.gif" alt="Manual deploy" width="600" />

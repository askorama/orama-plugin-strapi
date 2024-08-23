'use strict';

const collectionsService = require('./collections');
const contentTypesService = require('./content-types');
const cronService = require('./cron');
const liveUpdatesService = require('./live-updates');
const oramaManagerService = require('./orama-manager');

module.exports = {
  collectionsService,
  contentTypesService,
  cronService,
  liveUpdatesService,
  oramaManagerService
};

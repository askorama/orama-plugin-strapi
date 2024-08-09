module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'contentTypesController.index',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/get-content-types',
    handler: 'contentTypesController.getContentTypes',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/get-content-type-entries',
    handler: 'contentTypesController.getContentTypeEntries',
    config: {
      policies: [],
      auth: false
    },
  },
];

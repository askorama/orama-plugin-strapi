module.exports = [
  {
    method: 'GET',
    path: '/content-types',
    handler: 'contentTypesController.getContentTypes',
    config: {
      policies: [],
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

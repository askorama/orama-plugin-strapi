module.exports = [
  {
    method: 'GET',
    path: '/collections',
    handler: 'collectionsController.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/collections',
    handler: 'collectionsController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/collections/:id',
    handler: 'collectionsController.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/collections/:id',
    handler: 'collectionsController.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/collections/:id/deploy',
    handler: 'collectionsController.deploy',
    config: {
      policies: [],
    },
  },
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
    path: '/content-type-entries',
    handler: 'contentTypesController.getContentTypeEntries',
    config: {
      policies: [],
    },
  },
];

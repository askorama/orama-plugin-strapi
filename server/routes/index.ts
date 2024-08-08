export default [
  {
    method: 'GET',
    path: '/',
    handler: 'slugController.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/allContentTypes',
    handler: 'slugController.getContentTypes',
    config: {
      policies: [],
      auth: false,
    }
  },
  {
    method: 'POST',
    path: '/setSlugs',
    handler: 'slugController.setSlugs',
    config: {
      policies: [],
      auth: false,
    }
  }
];

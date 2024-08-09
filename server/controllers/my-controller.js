'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('orama-plugin-strapi')
      .service('myService')
      .getWelcomeMessage();
  },
});

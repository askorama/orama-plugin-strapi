import '@strapi/strapi';

export default ({ strapi }: { strapi: any }) => ({

  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  async getContentTypes() {
    const contentTypes = strapi.contentTypes
    return Object.values(contentTypes).filter((el: any) => el.uid.includes('api::'))
  },

});

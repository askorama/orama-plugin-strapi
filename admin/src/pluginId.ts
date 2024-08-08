import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^@orama\/strapi-plugin-/i, '')

export default pluginId;

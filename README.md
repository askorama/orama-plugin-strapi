# Strapi plugin orama-plugin-strapi

## Developing

In order to start working with in this repo you should follow the following steps:

- Create new Strapi project with `yarn create strapi-app my-strapi-project --quickstart`
- Create a folder under `src` named `plugins`
- Clone the repo inside the `plugins` folder
- Add the plugin to the `config/plugins.js` file (look at the example)
- Start the project at the root with `yarn develop --watch-admin`

```js
// plugins.js
module.exports = ({ env }) => ({
  orama: {
    enabled: true,
    resolve: "./src/plugins/orama-plugin-strapi",
    config: {
      privateApiKey: env('ORAMA_PRIVATE_API_KEY'),
    },
  },
});
```

### Server `[server dir]`

All the endpoints declared inside the `routes/index.js` file will be available under `<BASE_URL>/orama/<route_path>`

### Client `[admin dir]`

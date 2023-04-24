# Docasaurus OpenRPC Plugin

A Docusaurus plugin for [OpenRPC](https://open-rpc.org).

### How to use the plugin

1. install `@metamask/docusaurus-openrpc`
2. add the plugin to your docusaurus config:

```
[
      "@metamask/docusaurus-openrpc",
      /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
      {
        path: "/api-playground",
        openrpcDocument: "./path/to/openrpc.json" // path or url to openrpc document.
      },
    ]
```

### Development

In development, you can use `yarn link` in this repo, then run `yarn link "@metamask/docusaurus-openrpc"` in your project (metamask-docs, for example). Finally, run `yarn build:watch` in this repo to rebuild the plugin as you make changes.

# Docusaurus OpenRPC Plugin

A Docusaurus plugin for [OpenRPC](https://open-rpc.org).

### Installation

```bash
npm install @metamask/docusaurus-openrpc
```

### Usage

There are two ways to use this plugin

#### 1. Use it as a standalone plugin

Uses its own sidebar and path.

To use the plugin as a standalone plugin, add the following to your `docusaurus.config.js` file:

```js
[
  '@metamask/docusaurus-openrpc',
  {
    path: '/api-playground',
    openrpcDocument: './path/to/openrpc.json', // path or url to openrpc document.
  },
];
```

#### 2. Use it as an enhanced plugin-content-docs plugin to preserve the existing sidebar

To use the plugin as an enhanced plugin-content-docs plugin, add the following to your `docusaurus.config.js` file:

```js
    [
      "@metamask/docusaurus-openrpc/dist/content-docs-enhanced-open-rpc",
      ({
        // @docusaurus/plugin-content-docs options
        id: "default",
        path: "wallet",
        routeBasePath: "wallet",
        sidebarPath: require.resolve("./wallet-sidebar.js"),
        breadcrumbs: false,
        remarkPlugins: [
          require("remark-docusaurus-tabs"),
        ],
        // @docusaurus-openrpc plugin options
        openrpc: {
          openrpcDocument: "https://metamask.github.io/api-specs/latest/openrpc.json",
          path: "reference",
        }
      }),
    ],
```

### Development

In development, you can use `yarn link` in this repo, then run `yarn link "@metamask/docusaurus-openrpc"` in your project (metamask-docs, for example). Finally, run `yarn build:watch` in this repo to rebuild the plugin as you make changes.

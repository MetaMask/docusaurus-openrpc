import { PluginOptions } from '@docusaurus/plugin-content-docs';
import { SidebarItem } from '@docusaurus/plugin-content-docs/src/sidebars/types';
import { LoadContext } from '@docusaurus/types';
import { MethodObject } from '@open-rpc/meta-schema';
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js';
// eslint-disable-next-line import/no-nodejs-modules
import { join } from 'path';

import openrpcPlugin from '..';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, no-restricted-globals
const pluginContentDocs = require('@docusaurus/plugin-content-docs');

export type DocusaurusOpenRPCOptions = {
  id: string;
  // either a file path, or uri to a document.
  openrpc: {
    openrpcDocument: string;
    path: string;
    sidebarLabel: string;
  };
  path: string;
};

/**
 * Enhanced docs plugin that adds OpenRPC support.
 *
 * @param context - The load context.
 * @param options - The plugin options.
 */
async function docsPluginEnhanced(
  context: LoadContext,
  options: DocusaurusOpenRPCOptions,
) {
  const docsPluginInstance: any = await pluginContentDocs.default(
    context,
    options as unknown as PluginOptions,
  );
  if (docsPluginInstance === undefined) {
    throw new Error('docsPluginInstance is undefined');
  }
  const path = join(options.path, options.openrpc.path);

  const openrpcPluginInstance: any = openrpcPlugin(context, {
    id: options.id,
    path,
    openrpcDocument: options.openrpc.openrpcDocument,
  });
  if (openrpcPluginInstance === undefined) {
    throw new Error('openrpcPluginInstance is undefined');
  }
  const openrpcDocument = await parseOpenRPCDocument(
    options.openrpc.openrpcDocument,
  );

  return {
    ...docsPluginInstance,

    name: 'docusaurus-plugin-content-docs',

    async loadContent() {
      const results = await docsPluginInstance.loadContent();
      results.loadedVersions[0].sidebars = Object.keys(
        results.loadedVersions[0].sidebars,
      ).reduce((acc: any, key) => {
        acc[key] = results.loadedVersions[0].sidebars[key].map(
          (item: SidebarItem) => {
            if (item.type === 'category') {
              if (item.label === 'Reference') {
                item.items.push({
                  type: 'category',
                  label: options.openrpc.sidebarLabel || 'JSON-RPC',
                  collapsible: true,
                  collapsed: true,
                  items: openrpcDocument.methods.map((method) => {
                    const href = join(
                      context.baseUrl,
                      options.path,
                      options.openrpc.path,
                      (method as MethodObject).name.toLowerCase(),
                    );
                    return {
                      type: 'link',
                      label: (method as MethodObject).name,
                      href,
                    };
                  }),
                });
              }
            }
            return item;
          },
        );
        return acc;
      }, {});
      return results;
    },

    async contentLoaded({ content, allContent, actions }: any) {
      await docsPluginInstance.contentLoaded({ content, allContent, actions });
      return openrpcPluginInstance?.contentLoaded?.({
        content: { openrpcDocument, loadedVersions: content.loadedVersions },
        allContent,
        actions,
      });
    },
    configureWebpack(...args: any[]) {
      const docsConf = docsPluginInstance.configureWebpack(...args);
      const openrpcConf = openrpcPluginInstance.configureWebpack(...args) ?? {};

      const conf = {
        ...docsConf,
        ...openrpcConf,
        plugins: [...(docsConf.plugins || []), ...(openrpcConf.plugins || [])],
        resolve: {
          alias: {
            ...(openrpcConf.resolve?.alias || {}),
            ...(docsConf.resolve?.alias || {}),
          },
        },
      };
      return conf;
    },
    getThemePath() {
      return '../theme';
    },
    gethPathsToWatch() {
      const openrpcPaths = openrpcPluginInstance?.getPathsToWatch?.() ?? [];
      const docsPaths = docsPluginInstance.gethPathsToWatch();
      return [...openrpcPaths, ...docsPaths];
    },

    injectHtmlTags(cxt: LoadContext) {
      return openrpcPluginInstance?.injectHtmlTags?.(cxt) ?? '';
    },
  };
}

const pluginExport = {
  ...pluginContentDocs,
  default: docsPluginEnhanced,
  validateOptions: ({ validate, options }: any) => {
    const docOptions = {
      ...options,
    };
    delete docOptions.openrpc;
    const returns = pluginContentDocs.validateOptions({
      validate,
      options: docOptions,
    });
    return {
      ...returns,
      openrpc: options.openrpc,
    };
  },
};

export default docsPluginEnhanced;
export const { validateOptions } = pluginExport;

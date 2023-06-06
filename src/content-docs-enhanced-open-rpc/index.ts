const pluginContentDocs = require('@docusaurus/plugin-content-docs');
import { PluginOptions } from '@docusaurus/plugin-content-docs';
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js';
import { join } from 'path';

import openrpcPlugin from '..';
import { LoadContext } from '@docusaurus/types';
import { SidebarItem } from '@docusaurus/plugin-content-docs/src/sidebars/types';
import { MethodObject } from '@open-rpc/meta-schema';
export type DocusaurusOpenRPCOptions = {
    id: string;
    // either a file path, or uri to a document.
    openrpcDocument: string;
    openrpcPath: string;
    path: string;
  };

async function docsPluginEnhanced(context: LoadContext, options: DocusaurusOpenRPCOptions) {
  const docsPluginInstance: any = await pluginContentDocs.default(context, options as unknown as PluginOptions);
  if (docsPluginInstance === undefined) {
    throw new Error('docsPluginInstance is undefined');
  }
  const path = join(options.path, options.openrpcPath);

  const openrpcPluginInstance: any = await openrpcPlugin(context, {
    id: options.id,
    path,
    openrpcDocument: options.openrpcDocument,
  });
  if (openrpcPluginInstance === undefined) {
    throw new Error('openrpcPluginInstance is undefined');
  }
  const openrpcDocument = await parseOpenRPCDocument(options.openrpcDocument);

  return {
    ...docsPluginInstance,

    name: 'docusaurus-plugin-content-docs',

    async loadContent() {
      const results = await docsPluginInstance.loadContent();
      results.loadedVersions[0].sidebars = Object.keys(
        results.loadedVersions[0].sidebars,
      ).reduce((acc: any, key) => {
        acc[key] = results.loadedVersions[0].sidebars[key].map((item: SidebarItem) => {
          if (item.type === 'category') {
            if (item.label === 'Reference') {
              item.items.push({
                type: 'category',
                label: 'JSON-RPC',
                collapsible: true,
                collapsed: true,
                items: openrpcDocument.methods.map((method) => {
                  const href = join(
                    context.baseUrl,
                    options.path,
                    options.openrpcPath,
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
        });
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


    injectHtmlTags(context: any) {
      return openrpcPluginInstance?.injectHtmlTags?.(context) ?? '';
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
    delete docOptions.openrpcDocument;
    delete docOptions.openrpcPath;
    const returns = (pluginContentDocs as any).validateOptions({
      validate,
      options: docOptions,
    });
    return {
      ...returns,
      openrpcDocument: options.openrpcDocument,
      openrpcPath: options.openrpcPath,
    };
  },
};

export default docsPluginEnhanced;
export const validateOptions = pluginExport.validateOptions;

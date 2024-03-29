/* eslint-disable no-restricted-globals */
/**
 * See https://v2.docusaurus.io/docs/lifecycle-apis if you need more help!
 */

import { LoadedVersion } from '@docusaurus/plugin-content-docs';
import { Plugin as DocusaurusPlugin, LoadContext } from '@docusaurus/types';
import { docuHash, posixPath } from '@docusaurus/utils';
import { MethodObject, Methods, OpenrpcDocument } from '@open-rpc/meta-schema';
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
// eslint-disable-next-line import/no-nodejs-modules
import path, { join } from 'path';

// import {compile} from '@mdx-js/mdx'

// import openRPCToMarkdown from './openrpc-to-mdx';

/**
 * Put your plugin's options in here.
 *
 * NOTE: This will NOT perform runtime typechecking on the options.
 * This is only for development. You will need to implement Joi or a
 * solution like it if you need to validate options.
 */
export type DocusaurusOpenRPCOptions = {
  id: string;
  // either a file path, or uri to a document.
  openrpcDocument: string;
  path: string;
};

/**
 * The type of data your plugin loads.
 * This is set to never because the example doesn't load any data.
 */
export type DocusaurusOpenRPCContent = {
  openrpcDocument: OpenrpcDocument;
  loadedVersions?: LoadedVersion[];
};

/**
 * Plugin Description.
 *
 * @param context - Docusaurus LoadContext. Not used.
 * @param options - Plugin Options.
 * @returns Plugin - Docusaurus Plugin.
 */
export default function docusaurusOpenRpc(
  context: LoadContext,
  options: DocusaurusOpenRPCOptions,
): DocusaurusPlugin<DocusaurusOpenRPCContent> {
  const { generatedFilesDir } = context;

  let pluginDataDirRoot: string;

  if (generatedFilesDir) {
    pluginDataDirRoot = path.join(
      generatedFilesDir,
      'docusaurus-plugin-content-docs',
    );
  }

  const aliasedSource = (source: string) =>
    `${posixPath(path.resolve(pluginDataDirRoot, options.id, source))}`;

  return {
    // change this to something unique, or caches may conflict!
    name: 'docusaurus-openrpc',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      // You can return a JavaScript object that will be passed to contentLoaded hook.
      const document = await parseOpenRPCDocument(options.openrpcDocument);

      const methods: Methods = document.methods.reduce<Methods>(
        (memo, method: any) => {
          if (memo.find((bMethod: any) => bMethod.name === method.name)) {
            return memo;
          }
          return [...memo, method];
        },
        [],
      );

      document.methods = methods as any;

      return {
        openrpcDocument: document,
      };
    },

    async contentLoaded({ content, actions }) {
      const { openrpcDocument, loadedVersions } = content;
      const propsFilePath = await actions.createData(
        'props.json',
        JSON.stringify({
          path: options.path,
          openrpcDocument,
        }),
      );
      if (loadedVersions === undefined) {
        actions.addRoute({
          path: join(context.baseUrl, options.path, 'json-rpc-api'),
          component: '@theme/OpenRPCDocIndex',
          modules: {
            // propName -> JSON file path
            propsFile: propsFilePath,
          },
          exact: true,
        });
        openrpcDocument.methods.forEach((method) => {
          actions.addRoute({
            path: join(
              context.baseUrl,
              options.path,
              (method as MethodObject).name.toLowerCase(),
            ),
            component: '@theme/OpenRPCDocMethod',
            modules: {
              // propName -> JSON file path
              propsFile: propsFilePath,
            },
            exact: true,
          });
        });
        return;
      }
      loadedVersions?.forEach((version: LoadedVersion) => {
        actions.addRoute({
          path: join(context.baseUrl, options.path, 'json-rpc-api'),
          component: '@theme/OpenRPCDocIndex',
          modules: {
            // propName -> JSON file path
            propsFile: propsFilePath,
            versionMetadata: aliasedSource(
              `${docuHash(
                `version-${version.versionName}-metadata-prop`,
              )}.json`,
            ),
          },
          exact: true,
        });
        openrpcDocument.methods.forEach((method) => {
          actions.addRoute({
            path: join(
              context.baseUrl,
              options.path,
              (method as MethodObject).name.toLowerCase(),
            ),
            component: '@theme/OpenRPCDocMethod',
            modules: {
              // propName -> JSON file path
              propsFile: propsFilePath,
              versionMetadata: aliasedSource(
                `${docuHash(
                  `version-${version.versionName}-metadata-prop`,
                )}.json`,
              ),
            },
            exact: true,
          });
        });
      });
    },

    // async postBuild(props) {
    // After docusaurus <build> finish.
    // },

    // TODO
    // async postStart(props) {
    // docusaurus <start> finish
    // },

    configureWebpack() {
      return {
        plugins: [new NodePolyfillPlugin()],
        resolve: {
          fallback: {
            fs: false,
          },
        },
      };
    },

    getPathsToWatch() {
      if (options.openrpcDocument.startsWith('https')) {
        return [];
      }
      return [options.openrpcDocument];
    },

    getThemePath() {
      return './theme';
      // Returns the path to the directory where the theme components can
      // be found.
    },

    getClientModules() {
      // Return an array of paths to the modules that are to be imported
      // in the client bundle. These modules are imported globally before
      // React even renders the initial UI.
      return [];
    },

    // extendCli(cli) {
    //   // Register extra command(s) to enhance the CLI of Docusaurus
    //   cli
    //     .command('dothing')
    //     .description('Does something')
    //     .action(() => {})
    // },
  };
}

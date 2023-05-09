/**
 * See https://v2.docusaurus.io/docs/lifecycle-apis if you need more help!
 */

import { Plugin, LoadContext } from '@docusaurus/types';
import { MethodObject, OpenrpcDocument } from '@open-rpc/meta-schema';
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js';
// eslint-disable-next-line import/no-nodejs-modules
import { join } from 'path';

import openRPCToMarkdown from './openrpc-to-mdx';

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
  // either a file path, or uri to a document.
  openrpcDocument: string;
  path: string;
};

/**
 * The type of data your plugin loads.
 * This is set to never because the example doesn't load any data.
 */
export type DocusaurusOpenRPCContent = OpenrpcDocument;

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
): Plugin<DocusaurusOpenRPCContent> {
  return {
    // change this to something unique, or caches may conflict!
    name: 'docusaurus-openrpc',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      // You can return a JavaScript object that will be passed to contentLoaded hook.
      const document = await parseOpenRPCDocument(options.openrpcDocument);
      return document;
    },

    async contentLoaded({ content, actions }) {
      const openrpcJSONPath = await actions.createData(
        'openrpc.json',
        JSON.stringify(content),
      );

      content.methods.forEach((method) => {
        actions.addRoute({
          path: join(
            context.baseUrl,
            options.path,
            (method as MethodObject).name,
          ),
          component: '@theme/OpenRPCDocMethod',
          modules: {
            // propName -> JSON file path
            openrpcDocument: openrpcJSONPath,
          },
          exact: true,
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
        resolve: {
          alias: {
            process: 'process/browser'
          },
          fallback: {
            path: require.resolve("path-browserify"),
            process: require.resolve('process/browser'),
            buffer: require.resolve("buffer/")
          }
        }
      }
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

    injectHtmlTags() {
      return {
        headTags: [
          '<link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">'
        ]
      };
    },
  };
}

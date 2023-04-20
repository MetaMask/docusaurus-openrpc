/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * See https://v2.docusaurus.io/docs/lifecycle-apis if you need more help!
 */

import { Plugin, LoadContext } from '@docusaurus/types';
import { OpenrpcDocument } from '@open-rpc/meta-schema';

import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js';

import openRPCToMarkdown from './openrpc-to-mdx';

import {compile} from '@mdx-js/mdx'

// import {compile} from '@mdx-js/mdx'

// import openRPCToMarkdown from './openrpc-to-mdx';

/**
 * Put your plugin's options in here.
 *
 * NOTE: This will NOT perform runtime typechecking on the options.
 * This is only for development. You will need to implement Joi or a
 * solution like it if you need to validate options.
 */
export type MyPluginOptions = {
  // either a file path, or uri to a document.
  openrpcDocument: string;
  outfile: string;
  path: string;
  sidebarPath: string;
};

/**
 * The type of data your plugin loads.
 * This is set to never because the example doesn't load any data.
 */
export type MyPluginLoadableContent = OpenrpcDocument;

/**
 * Plugin Description.
 *
 * @param context - Docusaurus LoadContext.
 * @param options - Plugin Options.
 * @returns Plugin - Docusaurus Plugin.
 */
export default function myPlugin(
  context: LoadContext,
  options: MyPluginOptions,
): Plugin<MyPluginLoadableContent> {
  console.log(context);
  return {
    // change this to something unique, or caches may conflict!
    name: 'docusaurus-openrpc',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      // You can return a JavaScript object that will be passed to contentLoaded hook.
      const document = await parseOpenRPCDocument(options.openrpcDocument);
      return document;
    },

    contentLoaded({ content, actions }) {
      actions
        .createData('openrpc.json', JSON.stringify(content))
        .then(async (openrpcJSONPath) => {
          const foo = openRPCToMarkdown(content);
          console.log(foo);
          const openrpcMarkdownPath = await actions.createData(
            'openrpcMarkdown.mdx',
            foo.toString(),
          );

          actions.addRoute({
            path: options.path,
            component: '@theme/OpenRPCDocItem',
            modules: {
              // propName -> JSON file path
              openrpcDocument: openrpcJSONPath,
              openrpcMarkdown: openrpcMarkdownPath,
            },
            exact: true,
          });
        })
        .catch((error) => {
          throw error;
        });
    },

    // async postBuild(props) {
    // After docusaurus <build> finish.
    // },

    // TODO
    // async postStart(props) {
    // docusaurus <start> finish
    // },

    // configureWebpack(config, isServer) {
    //   return {
    //   }
    // },

    // getPathsToWatch() {
    //   return [
    //   ]
    // },

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
      // Inject head and/or body HTML tags.
      return {
        // extra html tags here
      };
    },
  };
}

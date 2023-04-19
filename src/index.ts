/**
 * See https://v2.docusaurus.io/docs/lifecycle-apis if you need more help!
 */

import { Plugin, LoadContext } from '@docusaurus/types';

/**
 * Put your plugin's options in here.
 *
 * NOTE: This will NOT perform runtime typechecking on the options.
 * This is only for development. You will need to implement Joi or a
 * solution like it if you need to validate options.
 */
export type MyPluginOptions = {
  // this option will either be undefined or a boolean
  someOption?: boolean;
};

/**
 * The type of data your plugin loads.
 * This is set to never because the example doesn't load any data.
 */
export type MyPluginLoadableContent = never;

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
): Plugin<MyPluginLoadableContent, MyPluginOptions> {
  console.log(context);
  console.log(options);
  return {
    // change this to something unique, or caches may conflict!
    name: 'docusaurus-plugin-example',

    /*
     * THIS IS COMMENTED OUT BECAUSE IT IS HARD TO UNDERSTAND FOR BEGINNERS.
     * FEEL FREE TO USE IF YOU KNOW WHAT YOU ARE DOING!
    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      // You can return a JavaScript object that will be passed to contentLoaded hook.
    },

    async contentLoaded({content, actions}) {
      // The contentLoaded hook is done after loadContent hook is done.
      // `actions` are set of functional API provided by Docusaurus (e.g. addRoute)
    },
    */

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

    /*
    You most likely won't need this right away either.

    getThemePath() {
      // Returns the path to the directory where the theme components can
      // be found.
    },
    */

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

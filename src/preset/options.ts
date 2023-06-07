// forked from: https://raw.githubusercontent.com/facebook/docusaurus/main/packages/docusaurus-preset-classic/src/options.ts
import type { Options as BlogPluginOptions } from '@docusaurus/plugin-content-blog';
import type * as pluginContentDocs from '@docusaurus/plugin-content-docs';
import type { Options as PagesPluginOptions } from '@docusaurus/plugin-content-pages';
import type { Options as GAPluginOptions } from '@docusaurus/plugin-google-analytics';
import type { Options as GtagPluginOptions } from '@docusaurus/plugin-google-gtag';
import type { Options as GTMPluginOptions } from '@docusaurus/plugin-google-tag-manager';
import type { Options as SitemapPluginOptions } from '@docusaurus/plugin-sitemap';
import type { Options as ThemeOptions } from '@docusaurus/theme-classic';
import type { UserThemeConfig as ClassicThemeConfig } from '@docusaurus/theme-common';
import type { UserThemeConfig as AlgoliaThemeConfig } from '@docusaurus/theme-search-algolia';
import type { ThemeConfig as BaseThemeConfig } from '@docusaurus/types';

import { DocusaurusOpenRPCOptions } from '../content-docs-enhanced-open-rpc';

export type Options = {
  /**
   * Options for `@docusaurus/plugin-debug`. Use `false` to disable, or `true`
   * to enable even in production.
   */
  debug?: boolean;
  /** Options for `@docusaurus/plugin-content-docs`. Use `false` to disable. */
  docs?: false | (pluginContentDocs.Options & DocusaurusOpenRPCOptions);
  /** Options for `@docusaurus/plugin-content-blog`. Use `false` to disable. */
  blog?: false | BlogPluginOptions;
  /** Options for `@docusaurus/plugin-content-pages`. Use `false` to disable. */
  pages?: false | PagesPluginOptions;
  /** Options for `@docusaurus/plugin-sitemap`. Use `false` to disable. */
  sitemap?: false | SitemapPluginOptions;
  /** Options for `@docusaurus/theme-classic`. */
  theme?: ThemeOptions;
  /**
   * Options for `@docusaurus/plugin-google-analytics`. Only enabled when the
   * key is present.
   */
  googleAnalytics?: GAPluginOptions;
  /**
   * Options for `@docusaurus/plugin-google-gtag`. Only enabled when the key
   * is present.
   */
  gtag?: GtagPluginOptions;
  googleTagManager?: GTMPluginOptions;
};

export type ThemeConfig = BaseThemeConfig &
  ClassicThemeConfig &
  AlgoliaThemeConfig;

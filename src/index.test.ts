import { LoadContext } from '@docusaurus/types';
import examples from '@open-rpc/examples';
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js';

import docusaurusOpenRpc from '.';

describe('docusaurus openrpc plugin', () => {
  describe('files to watch method', () => {
    it('returns nothing when the openrpcDocument option is a url', () => {
      const plugin = docusaurusOpenRpc({} as LoadContext, {
        openrpcDocument: 'https://anything.example',
        path: 'foo',
      });
      const getPathsToWatch = plugin.getPathsToWatch as () => string[];

      const paths = getPathsToWatch();
      expect(paths).toStrictEqual([]);
    });

    it('returns the same path as openrpcDocument if its not a url', () => {
      const pathToOpenRPCDocument = '../foo/bar.baz';
      const plugin = docusaurusOpenRpc({} as LoadContext, {
        openrpcDocument: pathToOpenRPCDocument,
        path: 'foo',
      });
      const getPathsToWatch = plugin.getPathsToWatch as () => string[];
      const paths = getPathsToWatch();
      expect(paths).toStrictEqual([pathToOpenRPCDocument]);
    });
  });

  describe('contentLoaded method', () => {
    it('allows baseUrl to be "/"', async () => {
      const plugin = docusaurusOpenRpc(
        {
          baseUrl: '/',
        } as LoadContext,
        {
          openrpcDocument: 'https://anything.example',
          path: 'foo',
        },
      );
      const contentLoaded = plugin.contentLoaded as (
        args: any,
      ) => Promise<void>;

      const addRoute = jest.fn();
      await contentLoaded({
        content: await parseOpenRPCDocument(examples.simpleMath as any),
        actions: {
          addRoute,
          createData: async () => Promise.resolve(),
        },
      });
      expect(addRoute).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ path: '/foo/subtraction' }),
      );
    });

    it('allows baseUrl to be set to anything', async () => {
      const plugin = docusaurusOpenRpc(
        {
          baseUrl: '/foo/bar',
        } as LoadContext,
        {
          openrpcDocument: 'https://anything.example',
          path: 'baz',
        },
      );
      const contentLoaded = plugin.contentLoaded as (
        args: any,
      ) => Promise<void>;

      const addRoute = jest.fn();
      await contentLoaded({
        content: await parseOpenRPCDocument(examples.simpleMath as any),
        actions: {
          addRoute,
          createData: async () => Promise.resolve(),
        },
      });
      expect(addRoute).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ path: '/foo/bar/baz/subtraction' }),
      );
    });

    it('works with leading slash paths', async () => {
      const plugin = docusaurusOpenRpc(
        {
          baseUrl: '/foo/bar',
        } as LoadContext,
        {
          openrpcDocument: 'https://anything.example',
          path: '/baz',
        },
      );
      const contentLoaded = plugin.contentLoaded as (
        args: any,
      ) => Promise<void>;

      const addRoute = jest.fn();
      await contentLoaded({
        content: await parseOpenRPCDocument(examples.simpleMath as any),
        actions: {
          addRoute,
          createData: async () => Promise.resolve(),
        },
      });
      expect(addRoute).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ path: '/foo/bar/baz/subtraction' }),
      );
    });
  });
});

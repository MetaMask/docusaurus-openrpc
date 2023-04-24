import { LoadContext } from "@docusaurus/types";
import DocusaurusOpenRPC from ".";

describe("docusaurus openrpc plugin", () => {

  describe("files to watch method ", () => {
    it("returns nothing when the openrpcDocument option is a url", () => {
      const plugin = DocusaurusOpenRPC(
        {} as LoadContext,
        {
          openrpcDocument: 'https://anything.example',
          path: 'foo'
        }
      );
      const getPathsToWatch = plugin.getPathsToWatch as () => string[];

      const paths = getPathsToWatch();
      expect(paths).toStrictEqual([]);
    });

    it("returns the same path as openrpcDocument if its not a url", () => {
      const pathToOpenRPCDocument = '../foo/bar.baz';
      const plugin = DocusaurusOpenRPC(
        {} as LoadContext,
        {
          openrpcDocument: pathToOpenRPCDocument,
          path: 'foo'
        }
      );
      const getPathsToWatch = plugin.getPathsToWatch as () => string[];
      const paths = getPathsToWatch();
      expect(paths).toStrictEqual([pathToOpenRPCDocument]);
    });
  });
});

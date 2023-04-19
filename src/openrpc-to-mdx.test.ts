import openrpcToMdx from './openrpc-to-mdx';

describe('openrpc-to-mdx', () => {
  it('should convert an openrpc document to mdx', () => {
    const result = openrpcToMdx({
      openrpc: '1.2.4',
      info: {
        title: 'test',
        version: '1.0.0',
      },
      methods: [
        {
          name: 'test',
          params: [
            {
              name: 'test',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      ],
    });

    expect(typeof result).toBe('string');
  });
});

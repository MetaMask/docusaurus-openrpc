import React from 'react';
const DocSidebar = require('@theme/DocSidebar').default;
import { Sidebar } from '@docusaurus/plugin-content-docs/src/sidebars/types';
import MarkdownDescription from '@metamask/open-rpc-docs-react/dist/MarkdownDescription/MarkdownDescription';
import Layout from '@theme/Layout';
import {
  MethodObject,
} from '@open-rpc/meta-schema';
import { join } from 'path';

const defaultDescription = `
Explore the JSON-RPC API Documentation for a complete set of reference materials, detailed api descriptions, usage examples, and a live interactive method execution designed to help you test and understand API functionalities in real-time.
`

export default function OpenRPCDocIndex(props: any) {
  const { versionMetadata } = props;

  let sidebar: Sidebar = [
    {
      type: 'link' as const,
      label: props.propsFile.openrpcDocument.info.title || 'JSON-RPC',
      href: props.propsFile.path,
    },
  ].concat(
    props.propsFile.openrpcDocument.methods.map((method: MethodObject) => {
      return {
        type: 'link',
        label: method.name,
        href: join(props.propsFile.path, method.name.toLowerCase()),
      };
    }),
  );
  if (versionMetadata) {
    sidebar = Object.values(versionMetadata.docsSidebars)[0] as Sidebar;
  }
  return (
    <Layout>
      <div
        style={{ display: 'flex', width: '100%', flex: '1 0' }}
        className="docusaurus-openrpc"
      >
        <aside
          style={{
            display: 'block',
            width: 'var(--doc-sidebar-width)',
            marginTop: 'calc(-1 * var(--ifm-navbar-height))',
            borderRight: '1px solid var(--ifm-toc-border-color)',
            willChange: 'width',
            transition: 'width var(--ifm-transition-fast) ease',
            clipPath: 'inset(0)',
          }}
          className="theme-doc-sidebar-container"
        >
          <div
            style={{
              top: 0,
              position: 'sticky',
              height: '100%',
              maxHeight: '100vh',
            }}
          >
            <DocSidebar path={props.route.path} sidebar={sidebar} />
          </div>
        </aside>

        <main className="docMainContainer" style={{ width: '100%' }}>
          <div className="container padding-top--md padding-bottom--lg">
            <h1>{props.propsFile.openrpcDocument.info.title || 'JSON-RPC'}</h1>
            <MarkdownDescription uiSchema={{}} source={props.propsFile.openrpcDocument.info?.description || defaultDescription} />
          </div>
        </main>
      </div>
    </Layout>
  );
}

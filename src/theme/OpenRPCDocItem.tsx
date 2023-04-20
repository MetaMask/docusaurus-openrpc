import React from "react";
const DocSidebar = require("@theme/DocSidebar").default;
import {
  Sidebar,
} from "@docusaurus/plugin-content-docs/src/sidebars/types";
import Layout from '@theme/Layout';
const MDXContent = require('@theme/MDXContent').default;
import {MethodObject} from '@open-rpc/meta-schema';

export default function Hello(props: any) {
  const sidebar: Sidebar = [
    {
      label: "OpenRPC",
      description: "OpenRPC is a specification for machine-readable JSON-RPC services. It allows for automatic code generation, documentation, and discovery.",
      items: props.openrpcDocument.methods.map((method: MethodObject) => {
        return {
          type: "link",
          label: method.name,
          href: `/api-playground#${method.name}`,
        }
      }),
      type: "category",
      collapsed: false,
      collapsible: true,
    }
  ];

  return (
    <Layout>
      <div className="docPage_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-styles-module">
        <aside className="theme-doc-sidebar-container docSidebarContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Sidebar-styles-module">
          <div className="sidebarViewport_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Sidebar-styles-module">
            <DocSidebar path={props.route.path} sidebar={sidebar}/>
          </div>
        </aside>

        <main className="docMainContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Main-styles-module">
          <div className="container padding-top--md padding-bottom--lg">
            <div className="row">
              <div className="col col--12">
                <MDXContent>
                  <props.openrpcMarkdown></props.openrpcMarkdown>
                </MDXContent>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

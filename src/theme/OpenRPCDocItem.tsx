import React from "react";
const DocSidebar = require("@theme/DocSidebar").default;
import {
  Sidebar,
} from "@docusaurus/plugin-content-docs/src/sidebars/types";

import Layout from '@theme/Layout';
const MDXContent = require('@theme/MDXContent').default;

export default function Hello(props: any) {
  const sidebar: Sidebar = [
    {
      label: "OpenRPC",
      description: "OpenRPC is a specification for machine-readable JSON-RPC services. It allows for automatic code generation, documentation, and discovery.",
      items: [
        {
          type: "link",
          label: "OpenRPC Potato",
          href: "/api-playground#foo",
        },
      ],
      type: "category",
      collapsed: false,
      collapsible: true,
    }
  ]
  console.log(props)

  return (
    <Layout>
      <div>
        <aside className="theme-doc-sidebar-container docSidebarContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Sidebar-styles-module">
          <DocSidebar path={props.route.path} sidebar={sidebar}/>
        </aside>
        <main className="docMainContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Main-styles-module">
            <MDXContent>
              <props.openrpcMarkdown></props.openrpcMarkdown>
            </MDXContent>
            {/* </MDXProvider> */}
        </main>
      </div>
    </Layout>
  );
}

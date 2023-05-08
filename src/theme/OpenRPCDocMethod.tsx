import React from "react";
const DocSidebar = require("@theme/DocSidebar").default;
import {
  Sidebar,
} from "@docusaurus/plugin-content-docs/src/sidebars/types";
import Layout from '@theme/Layout';
const MDXContent = require('@theme/MDXContent').default;
import {MethodObject} from '@open-rpc/meta-schema';
import {Method} from '@open-rpc/docs-react';

(window as any).process = { cwd: () => '' };

export default function OpenRPCDocItem(props: any) {
  const sidebar: Sidebar = [
    {
      label: "OpenRPC",
      description: "OpenRPC is a specification for machine-readable JSON-RPC services. It allows for automatic code generation, documentation, and discovery.",
      items: props.openrpcDocument.methods.map((method: MethodObject) => {
        return {
          type: "link",
          label: method.name,
          href: `/api-playground/${method.name.toLowerCase()}`,
        }
      }),
      type: "category",
      collapsed: false,
      collapsible: true,
    }
  ];

  const method = props.openrpcDocument.methods.find((m: MethodObject) => {
    const parts = props.route.path.split("/");
    const name = parts[parts.length - 1];
    return m.name.toLowerCase() === name.toLowerCase();
  })

  return (
    <Layout>
      <div style={{ display: "flex", width: "100%", flex: "1 0",  }}>
        <aside
          style={{
            display: "block",
            width: "var(--doc-sidebar-width)",
            marginTop: "calc(-1 * var(--ifm-navbar-height))",
            borderRight: "1px solid var(--ifm-toc-border-color)",
            willChange: "width",
            transition: "width var(--ifm-transition-fast) ease",
            clipPath: "inset(0)",
          }}
          className="theme-doc-sidebar-container">
          <div style={{
            top: 0,
            position: "sticky",
            height: "100%",
            maxHeight: "100vh",
          }}>
            <DocSidebar path={props.route.path} sidebar={sidebar}/>
          </div>
        </aside>

        <main style={{
          flexGrow: 1,
          maxWidth: "calc(100% - var(--doc-sidebar-width))"
        }}>
          <div className="container padding-top--md padding-bottom--lg">
            <div className="row">
              <div className="col col--12">
                {!method &&
                  <div>Index</div>
                }
                {method && <Method method={method} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

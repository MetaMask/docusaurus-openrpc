(window as any).process = {
  cwd: () => '',
  env: {}
};

import React from "react";
const DocSidebar = require("@theme/DocSidebar").default;
import {
  Sidebar,
} from "@docusaurus/plugin-content-docs/src/sidebars/types";
import Layout from '@theme/Layout';
const MDXContent = require('@theme/MDXContent').default;
import {ExamplePairingObject, MethodObject, ContentDescriptorObject} from '@open-rpc/meta-schema';
import { InteractiveMethod, Method} from 'docusaurus-open-rpc-docs-react';
const CodeBlock = require('@theme/CodeBlock').default;

const getExamplesFromMethod = (method?: MethodObject): ExamplePairingObject[] => {
  if (!method) { return []; }
  if (!method.params) { return []; }
  const examples: ExamplePairingObject[] = [];

  (method.params as ContentDescriptorObject[]).forEach((param, index: number) => {
    if (param.schema && param.schema.examples && param.schema.examples.length > 0) {
      param.schema.examples.forEach((ex: any, i: number) => {
        const example = examples[i];
        if (example === undefined) {
          examples.push({
            name: "generated-example",
            params: [
              {
                name: param.name,
                value: ex,
              },
            ],
            result: {
              name: "example-result",
              value: null,
            },
          });
        } else {
          example.params.push({
            name: param.name,
            value: ex,
          });
        }
      });
    }
  });
  const methodResult = method.result as ContentDescriptorObject;
  if (methodResult && methodResult.schema && methodResult.schema.examples && methodResult.schema.examples.length > 0) {
    methodResult.schema.examples.forEach((ex: any, i: number) => {
      const example = examples[i];
      if (example === undefined) {
        examples.push({
          name: "generated-example",
          params: [],
          result: {
            name: methodResult.name,
            value: ex,
          },
        });
      } else {
        example.result = {
          name: methodResult.name,
          value: ex,
        };
      }
    });
  }
  return examples;
};

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
  method.examples = method.examples || getExamplesFromMethod(method);
  const [selectedExamplePairing, setSelectedExamplePairing] = React.useState<ExamplePairingObject | undefined>(method.examples[0]);

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
              <div className="col col--7">
                {!method &&
                  <div>Index</div>
                }
                {method && <Method method={method} components={{CodeBlock}} onExamplePairingChange={(examplePairing: ExamplePairingObject) => setSelectedExamplePairing(examplePairing)}/>}
              </div>

              <div id="interactive-box" className="col col--5" style={{
                maxHeight: "calc(100vh - (var(--ifm-navbar-height) + 2rem))",
                overflowY: "auto",
                position: "sticky",
                top: "calc(var(--ifm-navbar-height) + 1rem)"
              }}>
                {method && <InteractiveMethod method={method} components={{CodeBlock}} selectedExamplePairing={selectedExamplePairing as ExamplePairingObject}/>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

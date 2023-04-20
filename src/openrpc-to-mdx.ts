import {
  OpenrpcDocument,
  MethodObject,
  ExampleObject,
  ExamplePairingObject,
  ContentDescriptorObject,
  JSONSchemaObject,
} from '@open-rpc/meta-schema';

const renderGreyMatter = (openrpcDocument: OpenrpcDocument) => {
  let markdown = '---\n';
  markdown += `title: ${openrpcDocument.info.title}\n`;
  markdown += `description: ${openrpcDocument.info.description ?? ''}\n`;
  markdown += 'toc_min_heading_level: 2\n';
  markdown += 'toc_max_heading_level: 2\n';
  markdown += '---\n';
  return markdown;
};

const renderSchema = (
  schema: JSONSchemaObject,
  indentationLevel = 1,
  addDashType = false,
): string => {
  let markdown = '';
  const indentation = '\t'.repeat(indentationLevel);

  const typeString: string | null = schema.type || null;
  let compositionString = '';
  if (schema.oneOf) {
    compositionString += `\n${indentation}- One Of  ${schema.oneOf
      .map((oneOf: JSONSchemaObject) =>
        renderSchema(oneOf, indentationLevel + 1, true),
      )
      .join(`\n${indentation}- **OR**`)}`;
  } else if (schema.anyOf) {
    compositionString += `\n${indentation}- Any Of${schema.anyOf
      .map((anyOf: JSONSchemaObject) =>
        renderSchema(anyOf, indentationLevel + 1, true),
      )
      .join(`\n${indentation}- **OR**`)}`;
  } else if (schema.allOf) {
    compositionString += `\n${indentation}- All Of${schema.allOf
      .map((allOf: JSONSchemaObject) =>
        renderSchema(allOf, indentationLevel + 1, true),
      )
      .join(`\n${indentation}- **AND**`)}`;
  } else if (schema.type === 'array') {
    // recurse
    if (schema.title) {
      compositionString += `\n${indentation}-  Array of _${schema.title}_`;
    } else {
      compositionString += `\n${indentation}- Array of`;
    }
    if (schema.items && schema.items.length > 0) {
      compositionString += renderSchema(
        schema.items as JSONSchemaObject,
        indentationLevel + 1,
        true,
      );
    }
  } else if (schema.type === 'string' && addDashType && schema.title) {
    compositionString = `\n${indentation}- ${schema.title}  \`string\``;
  }

  if (compositionString) {
    markdown += compositionString;
  } else if (typeString) {
    if (addDashType && schema.type !== 'object' && schema.type !== 'array') {
      markdown += `\n${indentation}- \`${typeString}\``;
    } else {
      markdown += `\`${typeString}\``;
    }
  }

  if (schema.description) {
    markdown += `\n${indentation}- ${schema.description}`;
  } else if (!addDashType) {
    // markdown += "\n";
  }

  if (schema.type === 'object' || schema.properties) {
    if (schema.properties !== undefined) {
      markdown += Object.keys(schema.properties)
        .map((key) => {
          if (schema.properties) {
            const property = schema.properties[key];
            return `\n${indentation}- _${key}_: ${renderSchema(
              property as JSONSchemaObject,
              indentationLevel + 1,
            )}`;
          }
          return '';
        })
        .join('');
    }
  }

  return markdown;
};

const getJavascriptExample = (
  method: MethodObject,
  example: ExamplePairingObject,
) => {
  const paramString = JSON.stringify(
    example.params.map((param) => (param as ExampleObject).value),
    undefined,
    2,
  )
    .split('\n')
    .map((line, i) => (i === 0 ? line : `  ${line}`))
    .join('\n');
  const request = [
    '```javascript',
    'const result = await ethereum.request({',
    `  method: "${method.name}",`,
    `  params: ${paramString}`,
    '});',
    '```',
  ].join('\n');

  const response = [
    '```javascript',
    'console.log(result);',
    '/**',
    ' * Outputs:',
    JSON.stringify((example.result as ExampleObject).value, undefined, '  ')
      .split('\n')
      .map((line) => ` * ${line}`)
      .join('\n'),
    ' */',
    '```',
  ].join('\n');

  return { request, response };
};

const getJsonExample = (
  method: MethodObject,
  example: ExamplePairingObject,
) => {
  const [request, response] = [
    {
      method: method.name,
      params: example.params.map((param) => (param as ExampleObject).value),
    },
    {
      result: (example.result as ExampleObject).value,
    },
  ].map((result) => {
    return [
      '```json',
      JSON.stringify({ jsonrpc: '2.0', id: 1, ...result }, undefined, 4),
      '```',
    ].join('\n');
  });

  return { request, response };
};

const getExamples = (method: MethodObject) => {
  let markdown = '';

  if (method.examples === undefined) {
    return markdown;
  }
  const example = method.examples[0] as unknown as ExamplePairingObject;
  const jsonExample = getJsonExample(method, example);
  const javascriptExample = getJavascriptExample(method, example);

  markdown += '\n### Example \n\n';

  markdown += '<Tabs>\n\n';

  markdown += '<TabItem value="json" label="JSON">\n\n';
  markdown += '#### Request\n\n';
  markdown += jsonExample.request;
  markdown += '\n';

  markdown += '#### Response\n\n';
  markdown += jsonExample.response;
  markdown += '\n\n';
  markdown += '</TabItem>\n';

  markdown += '<TabItem value="javascript" label="Javascript">\n\n';
  markdown += '#### Request\n\n';
  markdown += javascriptExample.request;
  markdown += '\n';

  markdown += '#### Response\n\n';
  markdown += javascriptExample.response;
  markdown += '\n';
  markdown += '</TabItem>\n';

  markdown += '</Tabs>\n';
  return markdown;
};

const renderContentDescriptor = (
  contentDescriptor: ContentDescriptorObject,
  index?: number,
  indentationLevel = 1,
): string => {
  const param = contentDescriptor;
  let markdown = '';
  // const indentation = "\t".repeat(indentationLevel);
  if (index !== undefined) {
    markdown += `${index + 1}. `;
  }
  markdown += `_${param.name}_${param.required ? ' **(required)**' : ''}: `;

  if (param.summary) {
    markdown += `${param.summary}`;
  } else if (param.description) {
    markdown += `${index === undefined ? '' : ' '.repeat(2)} ${param.description
      }`;
  }

  if (param.schema) {
    markdown += renderSchema(
      param.schema as JSONSchemaObject,
      indentationLevel,
    );
  }
  markdown += '\n\n';

  return markdown;
};

const openRPCToMarkdown = (openrpcDocument: OpenrpcDocument): string => {
  let markdown = renderGreyMatter(openrpcDocument);
  markdown += `${[
    "import Tabs from '@theme/Tabs';",
    "import TabItem from '@theme/TabItem';",
  ].join('\n')}\n\n`;

  (openrpcDocument.methods as MethodObject[]).forEach((method) => {
    markdown += '<details>\n';

    markdown += '<summary>\n\n';
    markdown += `## ${method.name}\n <small>${method.summary ?? ''}</small>\n`;
    markdown += '\n</summary>\n\n';

    // markdown += "\n---\n";

    if (method.description) {
      markdown += `${method.description}\n\n`;
    }

    markdown += `### Params (${method.params.length}) \n\n`;

    if (method.params.length > 0) {
      markdown += method.params
        .map((param, index: number) =>
          renderContentDescriptor(param as ContentDescriptorObject, index),
        )
        .join('\n');
    }

    if (method.result) {
      markdown += '### Result\n\n';
      markdown += renderContentDescriptor(
        method.result as ContentDescriptorObject,
        undefined,
        0,
      );
    }

    if (method.examples && method.examples.length > 0) {
      markdown += getExamples(method);
    }
    markdown += '\n</details>\n';
  });

  return markdown;
};

export default openRPCToMarkdown;

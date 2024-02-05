import { Node, RootNode, TemplateChildNode } from "@vue/compiler-dom";
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { ExtOptions } from "../constants/opts.ext";
import { ImportDetails } from "../types/importDetails.type";


export function extractComponentsFromTemplate(node: RootNode): string[] {
    const components = new Set(); 
  
    // Recursive function to traverse the AST
    function traverse(node: RootNode | TemplateChildNode) {
      if (node.type === 1 && node.tagType === 1) {
        // Check if the node is a valid Vue component node
        const componentName = node.tag;
        if (!components.has(componentName)) {
            components.add(componentName);
        }
      }
      
      const rootNode = node as RootNode;
      if (rootNode.children && rootNode.children.length) {
        // Recursively traverse child nodes
        rootNode.children.forEach((child) => traverse(child));
      }
    }
  
    traverse(node);

    return (Array.from(components) as string[]);
  }

export function extractImportedComponents(scriptContent: string):ImportDetails[] {
    const components = new Set();
  
    try {
      // Use Babel parser to parse the script content
      const ast = parser.parse(scriptContent,
            ExtOptions.babelParserOptions);
  
      // Traverse the AST to identify import declarations
      traverse(ast, {
        ImportDeclaration(path) {
          const importedComponent = path.node.specifiers[0].local.name;
          const importedPath = path.node.source.value;
          
          components.add(({
            component: importedComponent,
            path: importedPath
          } as ImportDetails));
        },
      });
    } catch (error) {
      console.error('Error during Babel parsing:', error);
    }
  
    return (Array.from(components) as ImportDetails[]);
}

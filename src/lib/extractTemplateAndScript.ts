import { parse } from "@vue/compiler-sfc";
const { transform } = require("@vue/compiler-dom");

export function extractTemplateAndScript(component: string) {
  const { descriptor } = parse(component);
  const templateAST = descriptor.template?.ast;
  const scriptContent = descriptor.script?.content;
  const api =
    descriptor.script && descriptor.script.setup ? "composition" : "options";

  return {
    templateAST,
    scriptContent,
    descriptor,
    api,
  };
}


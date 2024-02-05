import { ExtOptionsType } from "../types/options.type";

export const ExtOptions:ExtOptionsType = {
    babelParserOptions: {
      sourceType: 'module',
      plugins: ['jsx']
      }
} as const;
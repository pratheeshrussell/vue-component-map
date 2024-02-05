import { ParserOptions } from "@babel/parser";

export type ExtOptionsType = {
    babelParserOptions:ParserOptions,
    [key: string]: any;
}   
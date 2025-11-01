import { GeneratorResult, ParseAstOptions } from '@tanstack/router-utils';
import * as babel from '@babel/core';
export interface DirectiveFn {
    nodePath: SupportedFunctionPath;
    functionName: string;
    functionId: string;
    extractedFilename: string;
    filename: string;
    chunkName: string;
}
export type SupportedFunctionPath = babel.NodePath<babel.types.FunctionDeclaration> | babel.NodePath<babel.types.FunctionExpression> | babel.NodePath<babel.types.ArrowFunctionExpression>;
export type GenerateFunctionIdFn = (opts: {
    filename: string;
    functionName: string;
    extractedFilename: string;
}) => string;
export type ReplacerFn = (opts: {
    fn: string;
    extractedFilename: string;
    filename: string;
    functionId: string;
    isSourceFn: boolean;
}) => string;
export type CompileDirectivesOpts = ParseAstOptions & {
    directive: string;
    getRuntimeCode?: (opts: {
        directiveFnsById: Record<string, DirectiveFn>;
    }) => string;
    generateFunctionId: GenerateFunctionIdFn;
    replacer: ReplacerFn;
    filename: string;
    root: string;
    isDirectiveSplitParam: boolean;
    directiveSplitParam: string;
};
export declare function compileDirectives(opts: CompileDirectivesOpts): {
    compiledResult: GeneratorResult;
    directiveFnsById: Record<string, DirectiveFn>;
};
export declare function findDirectives(ast: babel.types.File, opts: ParseAstOptions & {
    directive: string;
    replacer?: ReplacerFn;
    generateFunctionId: GenerateFunctionIdFn;
    directiveSplitParam: string;
    filename: string;
    root: string;
    isDirectiveSplitParam: boolean;
}): Record<string, DirectiveFn>;

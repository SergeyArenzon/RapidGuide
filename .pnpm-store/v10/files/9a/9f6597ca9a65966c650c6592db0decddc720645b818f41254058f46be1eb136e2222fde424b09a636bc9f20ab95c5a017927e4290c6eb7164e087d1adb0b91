import { CompileDirectivesOpts, DirectiveFn, GenerateFunctionIdFn } from './compilers.js';
import { Plugin } from 'vite';
export type { DirectiveFn, CompileDirectivesOpts, ReplacerFn, GenerateFunctionIdFn, } from './compilers.js';
export type DirectiveFunctionsViteEnvOptions = Pick<CompileDirectivesOpts, 'getRuntimeCode' | 'replacer'>;
export type DirectiveFunctionsViteOptions = DirectiveFunctionsViteEnvOptions & {
    directive: string;
    onDirectiveFnsById?: (directiveFnsById: Record<string, DirectiveFn>) => void;
    generateFunctionId: GenerateFunctionIdFn;
};
export type DirectiveFunctionsVitePluginEnvOptions = {
    directive: string;
    callers: Array<DirectiveFunctionsViteEnvOptions & {
        envName: string;
    }>;
    provider: DirectiveFunctionsViteEnvOptions & {
        envName: string;
    };
    onDirectiveFnsById?: (directiveFnsById: Record<string, DirectiveFn>) => void;
    generateFunctionId: GenerateFunctionIdFn;
};
export declare function TanStackDirectiveFunctionsPluginEnv(opts: DirectiveFunctionsVitePluginEnvOptions): Plugin;

import crypto from "node:crypto";
import { TanStackDirectiveFunctionsPluginEnv } from "@tanstack/directive-functions-plugin";
const debug = process.env.TSR_VITE_DEBUG && ["true", "server-functions-plugin"].includes(process.env.TSR_VITE_DEBUG);
function TanStackServerFnPlugin(opts) {
  const directiveFnsById = {};
  const onDirectiveFnsById = (d) => {
    if (debug) {
      console.info(`onDirectiveFnsById received: `, d);
    }
    Object.assign(directiveFnsById, d);
    if (debug) {
      console.info(`directiveFnsById after update: `, directiveFnsById);
    }
  };
  const entryIdToFunctionId = /* @__PURE__ */ new Map();
  const functionIds = /* @__PURE__ */ new Set();
  function withTrailingSlash(path) {
    if (path[path.length - 1] !== "/") {
      return `${path}/`;
    }
    return path;
  }
  let root = process.cwd();
  let command = "build";
  const generateFunctionId = ({
    extractedFilename,
    functionName,
    filename
  }) => {
    if (command === "serve") {
      const rootWithTrailingSlash = withTrailingSlash(root);
      let file = extractedFilename;
      if (extractedFilename.startsWith(rootWithTrailingSlash)) {
        file = extractedFilename.slice(rootWithTrailingSlash.length);
      }
      file = `/@id/${file}`;
      const serverFn = {
        file,
        export: functionName
      };
      const base64 = Buffer.from(JSON.stringify(serverFn), "utf8").toString(
        "base64url"
      );
      return base64;
    }
    const entryId = `${filename}--${functionName}`;
    let functionId = entryIdToFunctionId.get(entryId);
    if (functionId === void 0) {
      if (opts.generateFunctionId) {
        functionId = opts.generateFunctionId({
          functionName,
          filename
        });
      }
      if (!functionId) {
        functionId = crypto.createHash("sha256").update(entryId).digest("hex");
      }
      if (functionIds.has(functionId)) {
        let deduplicatedId;
        let iteration = 0;
        do {
          deduplicatedId = `${functionId}_${++iteration}`;
        } while (functionIds.has(deduplicatedId));
        functionId = deduplicatedId;
      }
      entryIdToFunctionId.set(entryId, functionId);
      functionIds.add(functionId);
    }
    return functionId;
  };
  const resolvedManifestVirtualImportId = resolveViteId(
    opts.manifestVirtualImportId
  );
  const appliedEnvironments = /* @__PURE__ */ new Set([
    ...opts.callers.filter((c) => c.envConsumer === "server").map((c) => c.envName),
    opts.provider.envName
  ]);
  const serverCallerEnvironments = new Map(
    opts.callers.filter((c) => c.envConsumer === "server").map((c) => [c.envName, c])
  );
  return [
    // The client plugin is used to compile the client directives
    // and save them so we can create a manifest
    TanStackDirectiveFunctionsPluginEnv({
      directive: opts.directive,
      onDirectiveFnsById,
      generateFunctionId,
      provider: opts.provider,
      callers: opts.callers
    }),
    {
      // On the server, we need to be able to read the server-function manifest from the client build.
      // This is likely used in the handler for server functions, so we can find the server function
      // by its ID, import it, and call it.
      name: "tanstack-start-server-fn-vite-plugin-manifest-server",
      enforce: "pre",
      applyToEnvironment: (env) => {
        return appliedEnvironments.has(env.name);
      },
      configResolved(config) {
        root = config.root;
        command = config.command;
      },
      resolveId: {
        filter: { id: new RegExp(opts.manifestVirtualImportId) },
        handler() {
          return resolvedManifestVirtualImportId;
        }
      },
      load: {
        filter: { id: new RegExp(resolvedManifestVirtualImportId) },
        handler() {
          if (this.environment.name !== opts.provider.envName) {
            const getServerFnById = serverCallerEnvironments.get(
              this.environment.name
            )?.getServerFnById;
            if (!getServerFnById) {
              throw new Error(
                `No getServerFnById implementation found for environment ${this.environment.name}`
              );
            }
            return getServerFnById;
          }
          if (this.environment.mode !== "build") {
            const mod2 = `
            export async function getServerFnById(id) {
              const decoded = Buffer.from(id, 'base64url').toString('utf8')
              const devServerFn = JSON.parse(decoded)
              const mod = await import(/* @vite-ignore */ devServerFn.file)
              return mod[devServerFn.export]
            }
            `;
            return mod2;
          }
          const mod = `
          const manifest = {${Object.entries(directiveFnsById).map(
            ([id, fn]) => `'${id}': {
                  functionName: '${fn.functionName}',
                  importer: () => import(${JSON.stringify(fn.extractedFilename)})
                }`
          ).join(",")}}
            export async function getServerFnById(id) {
              const serverFnInfo = manifest[id]
              if (!serverFnInfo) {
                throw new Error('Server function info not found for ' + id)
              }
              const fnModule = await serverFnInfo.importer()

              if (!fnModule) {
                console.info('serverFnInfo', serverFnInfo)
                throw new Error('Server function module not resolved for ' + id)
              }

              const action = fnModule[serverFnInfo.functionName]

              if (!action) {
                  console.info('serverFnInfo', serverFnInfo)
                  console.info('fnModule', fnModule)

                throw new Error(
                  \`Server function module export not resolved for serverFn ID: \${id}\`,
                )
              }
              return action
            }
          `;
          return mod;
        }
      }
    }
  ];
}
function resolveViteId(id) {
  return `\0${id}`;
}
export {
  TanStackServerFnPlugin
};
//# sourceMappingURL=index.js.map

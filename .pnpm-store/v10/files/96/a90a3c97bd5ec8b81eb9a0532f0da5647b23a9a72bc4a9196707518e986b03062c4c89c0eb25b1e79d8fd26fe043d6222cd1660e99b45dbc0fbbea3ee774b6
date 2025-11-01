import { TSS_SERVER_FUNCTION } from "@tanstack/start-client-core";
import { getServerFnById } from "#tanstack-start-server-fn-manifest";
const createSsrRpc = (functionId) => {
  const url = process.env.TSS_SERVER_FN_BASE + functionId;
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    functionId,
    [TSS_SERVER_FUNCTION]: true
  });
};
export {
  createSsrRpc
};
//# sourceMappingURL=createSsrRpc.js.map

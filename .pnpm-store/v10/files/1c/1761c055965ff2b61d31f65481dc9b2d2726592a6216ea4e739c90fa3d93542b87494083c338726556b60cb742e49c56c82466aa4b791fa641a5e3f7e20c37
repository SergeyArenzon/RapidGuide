import { rootRouteId } from "@tanstack/router-core";
async function getStartManifest() {
  const { tsrStartManifest } = await import("tanstack-start-manifest:v");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  if (process.env.TSS_DEV_SERVER === "true") {
    const { injectedHeadScripts } = await import("tanstack-start-injected-head-scripts:v");
    if (injectedHeadScripts) {
      script = `${injectedHeadScripts + ";"}${script}`;
    }
  }
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      suppressHydrationWarning: true,
      async: true
    },
    children: script
  });
  const manifest = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k, v]) => {
        const { preloads, assets } = v;
        const result = {};
        if (preloads) {
          result["preloads"] = preloads;
        }
        if (assets) {
          result["assets"] = assets;
        }
        return [k, result];
      })
    )
  };
  return manifest;
}
export {
  getStartManifest
};
//# sourceMappingURL=router-manifest.js.map

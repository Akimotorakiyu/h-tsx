import { defineConfig, Plugin } from "vite";
import { promises } from "fs";
import { join } from "path";
function rawLoader(option: { idFilter: RegExp }) {
  const idFilter = option.idFilter;
  return <Plugin>{
    name: "svg-loader",
    enforce: "pre",
    async resolveId(id, impoter) {
      return idFilter.test(id) ? join(impoter, "..", id) : null;
    },
    async load(id) {
      if (idFilter.test(id)) {
        const content = await promises.readFile(id);
        const a = `
        export const content = \`${content}\`;
        export default content;
        `;
        return a;
      }
      return null;
    },
  };
}
export default defineConfig({
  esbuild: {
    jsxFactory: "htsx.createElement",
    jsxFragment: "htsx.Fragment",
  },
  plugins: [
    rawLoader({
      idFilter: /\.svg$/,
    }),
  ],
});

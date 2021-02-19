import { defineConfig } from "vite";
export default defineConfig({
  esbuild: {
    jsxFactory: "htsx.createElement",
    jsxFragment: "htsx.Fragment",
  },
});

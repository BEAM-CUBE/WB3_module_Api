import { resolve } from "path";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    target: "esnext",

    rollupOptions: {
      external: ["luxon", "uuid", "@widget-lab/3ddashboard-utils", "jsdoc"],
      output: {
        globals: {
          luxon: "luxon",
          uuid: "uuid",
          "@widget-lab/3ddashboard-utils": "@widget-lab/3ddashboard-utils",
          jsdoc: "jsdoc",
        },
      },
    },
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "@beam3_dev/api_module",
      fileName: "wb3Api",
    },
  },
};

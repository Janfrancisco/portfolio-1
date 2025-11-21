import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Necessário porque o Vite usa ESM e __dirname não existe por padrão
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/index.html"),
      },
    },
  },
});

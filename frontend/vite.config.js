import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react"; // Import the React plugin
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

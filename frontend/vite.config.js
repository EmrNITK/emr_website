import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Import the React plugin

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Plugins: Include the React plugin
    plugins: [react()],

    // Define: Make environment variables available in the app
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), // Access any custom environment variable like APP_ENV
    },

    // Optionally, add server or other configurations here
  };
});

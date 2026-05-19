import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { v4 as uuid } from 'uuid';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const buildId = uuid();
    console.log(`Creating build with build id: ${buildId}`);
    return {
      plugins: [react()],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
      define: {
        'process.env': {
          NODE_ENV: JSON.stringify(env.NODE_ENV),
          BUILD_ID: JSON.stringify(buildId),
        },
      }
    }
});

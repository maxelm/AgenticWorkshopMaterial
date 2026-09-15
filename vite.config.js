import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve from the GitHub Pages project-site subpath in production builds
  // (https://maxelm.github.io/AgenticWorkshopMaterial/), but keep dev/preview
  // at the root so local URLs stay simple.
  base: process.env.NODE_ENV === 'production' ? '/AgenticWorkshopMaterial/' : '/',
  // Vite only exposes env vars prefixed with `VITE_` to client code by default.
  // Widen this so `OPENWEATHER_API_KEY`/`BERGET_API_KEY` in .env are also
  // readable via `import.meta.env.*` without renaming them.
  envPrefix: ['VITE_', 'OPENWEATHER_', 'BERGET_'],
})

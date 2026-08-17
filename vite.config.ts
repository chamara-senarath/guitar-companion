import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base: './' keeps all asset URLs relative so the build works when served
// from a GitHub Pages project subpath (https://<user>.github.io/<repo>/)
// as well as from the root of a custom domain.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})

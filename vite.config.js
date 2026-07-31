import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";



export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change from default 5173 to 3000
    strictPort: true, // Prevents auto-changing ports
    host: "localhost", // Ensures it binds correctly
  },
  assetsInclude: ["**/*.xlsx"],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pdf.worker": ["pdfjs-dist/build/pdf.worker.min"],
        },
      },
    },
  },
  resolve: {
    alias: {
      // Erzwinge korrekten Zugriff auf den pdf.worker.min.js-File
      "pdfjs-dist/build/pdf.worker.min.js": "pdfjs-dist/build/pdf.worker.min.js",
    },
  },

});

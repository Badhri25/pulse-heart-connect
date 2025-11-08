import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ✅ FINAL CONFIG for Netlify
export default defineConfig(({ mode }) => ({
  base: "/", // 👈 VERY IMPORTANT: fixes all 404s on Netlify
  build: {
    outDir: "docs", // or "dist" if you changed earlier
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

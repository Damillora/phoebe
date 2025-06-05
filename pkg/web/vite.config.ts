import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  server: {
    proxy: {
      "/api": "https://booru.nanao.moe",
      "/data": "https://booru.nanao.moe",
    },
  },
});

import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true }, // dev server only, not shipped in builds
  modules: ["@nuxt/eslint"],

  // Internal admin app: client-side rendered, deployed as static files.
  ssr: false,
  nitro: { preset: "static" },

  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      title: "Products Admin",
      htmlAttrs: { lang: "en" },
      meta: [{ name: "robots", content: "noindex, nofollow" }],
    },
  },

  runtimeConfig: {
    public: {
      // Set NUXT_PUBLIC_API_BASE_URL at build time (static output bakes it in).
      // Empty = same origin. Everything under `public` is visible to browsers.
      apiBaseUrl: "",
    },
  },
});

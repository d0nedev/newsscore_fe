import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true }, // dev server only, not shipped in builds
  modules: ["@nuxt/eslint"],

  // Client-side rendered, deployed as static files.
  ssr: false,
  nitro: { preset: "static" },

  // shadcn-vue ui: scan only .vue so the barrel index.ts doesn't collide with the component name
  components: [
    { path: "~/components/ui", extensions: [".vue"], pathPrefix: false },
    "~/components",
  ],

  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      title: "SkorKini",
      htmlAttrs: { lang: "en" },
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

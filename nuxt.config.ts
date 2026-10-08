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
      title: "NEWSSCORE",
      htmlAttrs: { lang: "id" },
      meta: [
        {
          name: "description",
          content:
            "Skor langsung, jadwal, klasemen, dan statistik pertandingan sepak bola.",
        },
        { property: "og:site_name", content: "NEWSSCORE" },
        { property: "og:type", content: "website" },
        // Matches the header bar, so mobile browser chrome blends in.
        { name: "theme-color", content: "#061b22" },
      ],
      // Weights match what templates use: 800 is the logo and the match-page score.
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@600;700&family=Barlow+Condensed:wght@500;600;700;800&display=swap",
        },
      ],
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

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    // Scraped reference pages and vendored shadcn-vue components, not our code.
    ignores: ["source/**", "app/components/ui/**"],
  },
  {
    // Formatting belongs to Prettier.
    rules: { "vue/html-self-closing": "off" },
  },
);

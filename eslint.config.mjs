// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  // Scraped reference pages, not our code.
  ignores: ["source/**"],
}, {
  // Formatting belongs to Prettier.
  rules: { "vue/html-self-closing": "off" },
});

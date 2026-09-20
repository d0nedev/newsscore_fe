// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  // Formatting belongs to Prettier.
  rules: { "vue/html-self-closing": "off" },
});

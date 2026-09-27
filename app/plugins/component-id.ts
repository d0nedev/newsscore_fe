import type { ComponentPublicInstance } from "vue";

// Framework plumbing (Nuxt, vue-router, reka-ui internals) only adds noise.
const INTERNAL =
  /^(default|Nuxt\w*|Router\w*|RouteProvider|LayoutLoader|AsyncComponentWrapper|Primitive\w*|RovingFocus\w*|Collection\w*|TabsRoot)$/;

/**
 * Tags every component's root element with `data-component="<Name>"`, so any
 * piece of the page can be traced back to its source file from devtools.
 * A component whose root is another component collects both names, outermost
 * first: `data-component="SectionCard Card"`. Multi-root components are skipped.
 */
function tag(this: ComponentPublicInstance) {
  const el = this.$el as Node | null;
  const name = this.$options.name ?? this.$options.__name;
  if (!name || INTERNAL.test(name) || !(el instanceof HTMLElement)) return;

  const names = el.dataset.component?.split(" ") ?? [];
  if (!names.includes(name)) el.dataset.component = [name, ...names].join(" ");
}

export default defineNuxtPlugin((nuxtApp) => {
  // mounted for the first render, updated for roots swapped by v-if/v-else.
  nuxtApp.vueApp.mixin({ mounted: tag, updated: tag });
});

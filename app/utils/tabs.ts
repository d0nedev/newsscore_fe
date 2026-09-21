import { slugify } from "~/utils/slug";

/**
 * Ids that tie a tab to the panel it controls. Both sides derive them from the
 * same stem, so `aria-controls` and `aria-labelledby` can never drift apart.
 */
export const tabId = (stem: string, item: string) =>
  `${stem}-tab-${slugify(item)}`;

export const tabPanelId = (stem: string, item: string) =>
  `${stem}-panel-${slugify(item)}`;

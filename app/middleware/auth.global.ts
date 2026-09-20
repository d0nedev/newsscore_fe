// UX only: hides pages from signed-out users. The Go API enforces authorization.
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.public) return;

  const user =
    await useNuxtApp().$queryClient.ensureQueryData(currentUserQuery);
  if (!user) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }
});

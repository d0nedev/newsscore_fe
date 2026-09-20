import {
  MutationCache,
  QueryCache,
  QueryClient,
  VueQueryPlugin,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  function onError(error: unknown) {
    if (!(error instanceof ApiError)) return;

    if (error.kind === "unauthorized") {
      // Drop cached data so the next user sees nothing of the last one.
      // Queries only: clearing mutations would hide the login form's own error.
      queryClient.removeQueries();
      queryClient.setQueryData(authKeys.me, null);
      const route = router.currentRoute.value;
      if (!route.meta.public) {
        router.replace({ path: "/login", query: { redirect: route.fullPath } });
      }
      return;
    }

    // Developer-facing context only; never log request bodies (may hold credentials).
    if (
      import.meta.dev ||
      error.kind === "server" ||
      error.kind === "unknown"
    ) {
      console.error("[api]", {
        kind: error.kind,
        status: error.status,
        code: error.code,
        message: error.message,
        requestId: error.requestId,
      });
    }
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Only transient failures are worth retrying; 4xx will fail again.
        retry: (failureCount, error) =>
          failureCount < 2 &&
          error instanceof ApiError &&
          (error.kind === "network" || error.kind === "server"),
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  return { provide: { queryClient } };
});

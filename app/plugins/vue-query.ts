import {
  MutationCache,
  QueryCache,
  QueryClient,
  VueQueryPlugin,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  function onError(error: unknown) {
    if (!(error instanceof ApiError)) return;

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

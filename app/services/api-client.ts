type ApiFetchOptions = NonNullable<Parameters<typeof $fetch>[1]>;

// Single entry point to the Go API. Every service goes through here.
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { apiBaseUrl } = useRuntimeConfig().public;

  try {
    return await $fetch<T>(path, {
      ...options,
      baseURL: apiBaseUrl,
      // Session lives in an HttpOnly cookie set by the Go API; JS never sees a token.
      credentials: "include",
      retry: 0, // retries are decided by TanStack Query
    } as ApiFetchOptions);
  } catch (error) {
    throw toApiError(error);
  }
}

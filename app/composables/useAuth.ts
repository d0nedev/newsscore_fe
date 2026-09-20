import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { authService } from "~/services/auth.service";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const currentUserQuery = {
  queryKey: authKeys.me,
  queryFn: ({ signal }: { signal: AbortSignal }) => authService.me(signal),
  staleTime: 5 * 60_000,
};

export function useCurrentUser() {
  return useQuery(currentUserQuery);
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      // Drop every cached response so the next user sees nothing of the last one.
      queryClient.clear();
      await navigateTo("/login");
    },
  });
}

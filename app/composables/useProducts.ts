import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { productService } from "~/services/product.service";
import type { ProductInput } from "~/types/product";

const PAGE_SIZE = 20;

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export function useProducts() {
  return useInfiniteQuery({
    queryKey: productKeys.list(),
    queryFn: ({ pageParam, signal }) =>
      productService.list({ limit: PAGE_SIZE, cursor: pageParam }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor || undefined,
  });
}

export function useProduct(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => productKeys.detail(toValue(id))),
    queryFn: ({ signal }) => productService.get(toValue(id), signal),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.list() }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
      productService.update(id, input),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      return queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.remove,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}

import type { ApiErrorBody } from "~/types/api";

export type ApiErrorKind =
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "network"
  | "server"
  | "unknown";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly code: string;
  // Field -> message, only for validation errors.
  readonly fieldErrors: Record<string, string>;
  readonly requestId: string | null;

  constructor(init: {
    kind: ApiErrorKind;
    status: number | null;
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
    requestId?: string | null;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.kind = init.kind;
    this.status = init.status;
    this.code = init.code;
    this.fieldErrors = init.fieldErrors ?? {};
    this.requestId = init.requestId ?? null;
  }
}

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status >= 500) return "server";
  return "unknown";
}

function toFieldErrors(details: unknown): Record<string, string> {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(details).filter(([, v]) => typeof v === "string"),
  );
}

interface FetchErrorLike {
  response?: {
    status: number;
    headers: Headers;
    _data?: unknown;
  };
}

// Maps whatever $fetch threw into an ApiError. Aborts pass through untouched
// so TanStack Query can cancel requests.
export function toApiError(error: unknown): unknown {
  if (error instanceof ApiError) return error;
  if (error instanceof Error && error.name === "AbortError") return error;

  const response = (error as FetchErrorLike | null)?.response;
  if (!response) {
    return new ApiError({
      kind: "network",
      status: null,
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Network error",
    });
  }

  const body = response._data as Partial<ApiErrorBody> | undefined;
  return new ApiError({
    kind: kindFromStatus(response.status),
    status: response.status,
    code: body?.error?.code ?? "UNKNOWN_ERROR",
    message: body?.error?.message ?? `HTTP ${response.status}`,
    fieldErrors: toFieldErrors(body?.error?.details),
    requestId: response.headers.get("x-request-id"),
  });
}

const FALLBACK_MESSAGES: Record<ApiErrorKind, string> = {
  validation: "Please check the highlighted fields.",
  unauthorized: "Your session has expired. Please sign in again.",
  forbidden: "You do not have permission to do this.",
  not_found: "The requested item was not found.",
  conflict: "This item was changed by someone else. Reload and try again.",
  network: "Unable to reach the server. Check your connection and try again.",
  server: "Something went wrong on our side. Please try again later.",
  unknown: "Something went wrong. Please try again.",
};

// User-facing text. Server/network/unknown messages are never shown raw.
export function errorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return FALLBACK_MESSAGES.unknown;
  if (
    error.kind === "server" ||
    error.kind === "network" ||
    error.kind === "unknown"
  ) {
    return FALLBACK_MESSAGES[error.kind];
  }
  return error.message || FALLBACK_MESSAGES[error.kind];
}

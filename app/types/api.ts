export interface ApiResponse<T> {
  data: T;
}

export interface CursorPage<T> {
  data: T[];
  meta: {
    // Opaque: never parse it, only send it back.
    nextCursor?: string | null;
  };
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

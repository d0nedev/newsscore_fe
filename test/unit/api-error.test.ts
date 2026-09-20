import { describe, expect, it } from "vitest";
import { ApiError, errorMessage, toApiError } from "~/utils/api-error";

function fetchError(
  status: number,
  data?: unknown,
  headers: Record<string, string> = {},
) {
  return Object.assign(new Error("fetch failed"), {
    name: "FetchError",
    response: { status, _data: data, headers: new Headers(headers) },
  });
}

describe("toApiError", () => {
  it("maps validation errors with field details", () => {
    const err = toApiError(
      fetchError(422, {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: { name: "Name is required", price: "Price must be >= 0" },
        },
      }),
    ) as ApiError;

    expect(err).toBeInstanceOf(ApiError);
    expect(err.kind).toBe("validation");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.fieldErrors).toEqual({
      name: "Name is required",
      price: "Price must be >= 0",
    });
  });

  it.each([
    [400, "validation"],
    [401, "unauthorized"],
    [403, "forbidden"],
    [404, "not_found"],
    [409, "conflict"],
    [500, "server"],
    [503, "server"],
    [418, "unknown"],
  ])("maps status %i to %s", (status, kind) => {
    expect((toApiError(fetchError(status)) as ApiError).kind).toBe(kind);
  });

  it("maps missing response to network error", () => {
    expect(
      (toApiError(new TypeError("Failed to fetch")) as ApiError).kind,
    ).toBe("network");
  });

  it("keeps request id and ignores non-object details", () => {
    const err = toApiError(
      fetchError(
        404,
        {
          error: {
            code: "MATCH_NOT_FOUND",
            message: "Match not found",
            details: null,
          },
        },
        { "x-request-id": "req-1" },
      ),
    ) as ApiError;
    expect(err.requestId).toBe("req-1");
    expect(err.fieldErrors).toEqual({});
  });

  it("passes aborts through for query cancellation", () => {
    const abort = new DOMException("aborted", "AbortError");
    expect(toApiError(abort)).toBe(abort);
  });
});

describe("errorMessage", () => {
  it("shows backend message for client errors", () => {
    const err = new ApiError({
      kind: "not_found",
      status: 404,
      code: "MATCH_NOT_FOUND",
      message: "Match not found",
    });
    expect(errorMessage(err)).toBe("Match not found");
  });

  it("hides raw server messages", () => {
    const err = new ApiError({
      kind: "server",
      status: 500,
      code: "INTERNAL",
      message: "pq: connection refused",
    });
    expect(errorMessage(err)).not.toContain("pq");
  });

  it("handles non-API errors", () => {
    expect(errorMessage(new Error("boom"))).toBe(
      "Something went wrong. Please try again.",
    );
  });
});

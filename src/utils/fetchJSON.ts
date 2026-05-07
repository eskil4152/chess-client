import { getCsrfToken } from "./csrf";

const CSRF_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export default async function fetchJSON(url: string, options?: RequestInit) {
  const method = (options?.method ?? "GET").toUpperCase();
  const csrfHeaders: Record<string, string> = CSRF_METHODS.has(method) ? { "X-XSRF-TOKEN": getCsrfToken() } : {};

  const contentTypeHeader: Record<string, string> = CSRF_METHODS.has(method) ? { "Content-Type": "application/json" } : {};

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...contentTypeHeader,
      ...csrfHeaders,
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const status = response.status;

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { status, data };
}

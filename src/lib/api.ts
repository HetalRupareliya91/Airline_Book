export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
  meta?: { page: number; limit: number; total: number; pages: number };
};

/** fetch + JSON parsing with one consistent shape. Never throws on non-JSON responses. */
export async function apiJson<T>(url: string, init?: RequestInit): Promise<{ status: number; body: ApiResult<T> }> {
  const res = await fetch(url, init);
  let body: ApiResult<T> = { ok: false };
  try {
    body = (await res.json()) as ApiResult<T>;
  } catch {
    // response was not JSON; keep the default failure shape
  }
  return { status: res.status, body: { ...body, ok: res.ok && body.ok } };
}

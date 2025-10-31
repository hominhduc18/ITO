const API_BASE = import.meta.env.VITE_API_BASE; // ✅ No error

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => http<T>(path),
  post: <T>(path: string, body?: any) =>
      http<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: any) =>
      http<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => http<T>(path, { method: 'DELETE' }),
};
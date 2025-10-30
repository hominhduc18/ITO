export const http = {
  async post<T>(url: string, body: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) },
      body: JSON.stringify(body),
      ...init,
    })
    if (!res.ok) throw new Error(`HTTP_${res.status}`)
    return res.json() as Promise<T>
  }
}

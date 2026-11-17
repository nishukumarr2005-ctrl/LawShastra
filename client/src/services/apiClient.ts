const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export async function apiRequest<T>(endpoint: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  let token: string | null = null
  try {
    token = localStorage.getItem('lawshastra_admin_token')
  } catch {
    token = null
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 401) {
    // Token invalid/expired (e.g. issued by a different backend). Clear stale
    // auth and send the user to login so they can re-authenticate.
    try {
      localStorage.removeItem('lawshastra_admin_token')
      localStorage.removeItem('lawshastra_admin_user')
    } catch {
      // ignore storage errors
    }
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      const current = window.location.pathname + window.location.search
      window.location.assign(`/admin/login?redirect=${encodeURIComponent(current)}`)
    }
    throw new Error('Session expired. Please sign in again.')
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.message || 'Request failed')
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  const body: ApiResponse<T> = JSON.parse(text)
  return body.data
}

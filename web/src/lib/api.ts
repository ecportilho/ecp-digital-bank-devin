const API_URL = import.meta.env.VITE_API_URL || ''

interface ApiOptions {
  method?: string
  body?: unknown
  token?: string
}

export class ApiError extends Error {
  code: string
  status: number
  details?: Array<{ field: string; message: string }>

  constructor(code: string, message: string, status: number, details?: Array<{ field: string; message: string }>) {
    super(message)
    this.code = code
    this.status = status
    this.details = details
  }
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let baseUrl = API_URL
  if (!baseUrl) {
    // Strip any embedded credentials from the URL (e.g. basic auth tunnels)
    const loc = new URL(window.location.href)
    loc.username = ''
    loc.password = ''
    baseUrl = loc.origin
  }
  const url = `${baseUrl}/api${endpoint}`

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      code: 'UNKNOWN',
      message: 'Erro desconhecido',
    }))
    throw new ApiError(
      errorData.code || 'UNKNOWN',
      errorData.message || 'Erro desconhecido',
      response.status,
      errorData.details
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

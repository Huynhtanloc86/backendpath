// lib/api.ts - Lớp trung gian duy nhất để giao tiếp với backend
// Tập trung tất cả API calls ở đây để dễ debug và thay đổi base URL

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type UserResponse = {
  id: string
  email: string
  display_name: string | null
  created_at: string
}

export type ProgressRecord = {
  id: string
  node_id: string
  stage_id: number
  theory_read: boolean
  quiz_best_score: number
  completed: boolean
  completed_at: string | null
  updated_at: string
}

export type BadgeRecord = {
  id: string
  stage_id: number
  earned_at: string
}

export type TokenResponse = {
  access_token: string
  token_type: string
}

// Helper: đọc JWT từ localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('backendpath_token')
}

export function saveToken(token: string): void {
  localStorage.setItem('backendpath_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('backendpath_token')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

// Helper: gọi API với xử lý lỗi chuẩn
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Lỗi không xác định' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; display_name?: string }) =>
      apiFetch<UserResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      apiFetch<TokenResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  users: {
    me: () => apiFetch<UserResponse>('/users/me'),
  },
  progress: {
    getAll: () => apiFetch<ProgressRecord[]>('/progress'),
    update: (nodeId: string, data: { theory_read?: boolean; quiz_score?: number }) =>
      apiFetch<ProgressRecord>(`/progress/${nodeId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    recordQuizAttempt: (nodeId: string, data: { score: number; total_questions: number }) =>
      apiFetch<{ message: string; score: number; total: number; percentage: number }>(
        `/progress/${nodeId}/quiz-attempt`,
        { method: 'POST', body: JSON.stringify(data) }
      ),
    getBadges: () => apiFetch<BadgeRecord[]>('/progress/badges'),
  },
}

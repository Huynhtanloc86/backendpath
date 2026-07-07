'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, saveToken } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.auth.register({ email, password, display_name: displayName || undefined })
      const { access_token } = await api.auth.login({ email, password })
      saveToken(access_token)
      router.push('/roadmap')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Tạo tài khoản</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Miễn phí, lưu tiến độ học của bạn</p>
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tên hiển thị (tuỳ chọn)</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mật khẩu (ít nhất 6 ký tự)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-lg transition-colors font-medium">
            {loading ? 'Đang tạo tài khoản...' : 'Bắt đầu học ngay'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  )
}

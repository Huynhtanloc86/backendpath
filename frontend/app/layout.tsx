import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BackendPath - Học lập trình backend từ đầu',
  description: 'Lộ trình học backend cho người mới, với backend Python thật để mổ xẻ code',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/roadmap" className="text-blue-400 font-bold text-lg tracking-tight">
              BackendPath
            </a>
            <div className="flex items-center gap-4 text-sm">
              <a href="/roadmap" className="text-gray-400 hover:text-white transition-colors">Lộ trình</a>
              <a href="/playground" className="text-gray-400 hover:text-white transition-colors">Playground API</a>
              <a href="/login" className="text-gray-400 hover:text-white transition-colors">Đăng nhập</a>
              <a href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors">
                Bắt đầu học
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}

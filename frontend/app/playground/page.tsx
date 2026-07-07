export default function PlaygroundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">API Playground 🧪</h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Đây là <strong className="text-white">Swagger UI của backend BackendPath thật</strong> đang chạy tại localhost:8000.
          Hãy thử gọi các endpoint để hiểu cách chúng hoạt động — đây chính là bài thực hành "HTTP & REST".
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { endpoint: 'POST /auth/register', desc: 'Tạo tài khoản → học Validation + bcrypt hash', color: 'border-green-800 bg-green-950/30 text-green-400' },
            { endpoint: 'POST /auth/login', desc: 'Đăng nhập → nhận JWT token', color: 'border-blue-800 bg-blue-950/30 text-blue-400' },
            { endpoint: 'GET /users/me', desc: 'Protected route → cần JWT trong header', color: 'border-purple-800 bg-purple-950/30 text-purple-400' },
          ].map(item => (
            <div key={item.endpoint} className={`border rounded-lg p-3 ${item.color}`}>
              <code className="text-sm font-mono block mb-1">{item.endpoint}</code>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-gray-700">
        <iframe
          src="http://localhost:8000/docs"
          className="w-full"
          style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
          title="Swagger UI - BackendPath API"
        />
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">
        Backend phải đang chạy tại localhost:8000 →{' '}
        <code className="bg-gray-800 px-1 rounded">uvicorn app.main:app --reload</code>
      </p>
    </div>
  )
}

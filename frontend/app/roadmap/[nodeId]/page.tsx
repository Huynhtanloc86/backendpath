'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { lessons } from '@/content/lessons'
import { QuizComponent } from '@/components/QuizComponent'
import { CodeBlock } from '@/components/CodeBlock'
import { api, isLoggedIn } from '@/lib/api'

type Tab = 'theory' | 'quiz' | 'code'

export default function LessonPage() {
  const params = useParams()
  const nodeId = params.nodeId as string
  const lesson = lessons.find(l => l.id === nodeId)

  const [tab, setTab] = useState<Tab>('theory')
  const [theoryRead, setTheoryRead] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    if (!lesson) return
    if (isLoggedIn()) {
      api.progress.getAll().then(progress => {
        const p = progress.find(r => r.node_id === nodeId)
        if (p) {
          setTheoryRead(p.theory_read)
          if (p.quiz_best_score >= 80) setQuizDone(true)
          setQuizScore(p.quiz_best_score)
        }
      }).catch(console.error)
    }
  }, [nodeId, lesson])

  const handleTheoryRead = async () => {
    setTheoryRead(true)
    if (isLoggedIn()) {
      await api.progress.update(nodeId, { theory_read: true }).catch(console.error)
    }
  }

  const handleQuizComplete = async (score: number, total: number) => {
    const pct = Math.round((score / total) * 100)
    setQuizScore(pct)
    if (pct >= 80) setQuizDone(true)
    if (isLoggedIn()) {
      await api.progress.recordQuizAttempt(nodeId, { score, total_questions: total }).catch(console.error)
      await api.progress.update(nodeId, { quiz_score: pct }).catch(console.error)
    }
  }

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Không tìm thấy bài học này.</p>
        <a href="/roadmap" className="text-blue-400 hover:underline mt-4 block">← Quay lại lộ trình</a>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; available: boolean }[] = [
    { key: 'theory', label: '📖 Lý thuyết', available: true },
    { key: 'quiz', label: '🎯 Quiz', available: theoryRead },
    { key: 'code', label: '🔍 Soi code thật', available: !!(lesson.realCodeReference?.length) },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <a href="/roadmap" className="text-sm text-gray-500 hover:text-gray-300 mb-3 block">
          ← Lộ trình
        </a>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">
            Giai đoạn {lesson.stageId}
          </span>
          {theoryRead && <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">Đã đọc</span>}
          {quizDone && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">Quiz {quizScore}%</span>}
        </div>
        <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
        <p className="text-gray-400 mt-1">{lesson.intro}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-800">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => t.available && setTab(t.key)}
            disabled={!t.available}
            className={`px-4 py-2 text-sm rounded-t-lg -mb-px transition-colors ${
              tab === t.key
                ? 'bg-gray-900 border border-b-gray-900 border-gray-700 text-white'
                : t.available
                ? 'text-gray-500 hover:text-gray-300'
                : 'text-gray-700 cursor-not-allowed'
            }`}
          >
            {t.label}
            {!t.available && t.key === 'quiz' && (
              <span className="ml-1 text-xs text-gray-600">(đọc lý thuyết trước)</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        {tab === 'theory' && (
          <div>
            <div className="prose prose-invert prose-sm max-w-none mb-6">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{lesson.theory}</div>
            </div>

            {lesson.commonMistakes.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-yellow-400 mb-3">⚠️ Lỗi thường gặp</h3>
                <div className="space-y-3">
                  {lesson.commonMistakes.map((m, i) => (
                    <div key={i} className="bg-yellow-950/30 border border-yellow-900 rounded-lg p-4">
                      <p className="text-red-400 text-sm mb-1">✗ {m.mistake}</p>
                      <p className="text-green-400 text-sm">✓ {m.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-gray-300 mb-3">Checklist tự kiểm tra:</h3>
              <ul className="space-y-2">
                {lesson.selfCheckList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-gray-600 mt-0.5">☐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!theoryRead && (
              <button
                onClick={handleTheoryRead}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
              >
                Tôi đã đọc xong → Làm quiz
              </button>
            )}
            {theoryRead && (
              <button
                onClick={() => setTab('quiz')}
                className="mt-6 w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
              >
                → Làm Quiz ngay
              </button>
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <QuizComponent
            questions={lesson.quiz}
            nodeId={nodeId}
            onComplete={handleQuizComplete}
          />
        )}

        {tab === 'code' && lesson.realCodeReference && (
          <div className="space-y-8">
            {lesson.realCodeReference.map((ref, i) => (
              <div key={i}>
                <CodeBlock
                  code={ref.codeSnippet}
                  filename={ref.filePath}
                />
                <div className="mt-4 p-4 bg-blue-950/30 border border-blue-900 rounded-lg">
                  <p className="text-blue-300 text-sm leading-relaxed">{ref.explanation}</p>
                </div>
              </div>
            ))}
            <div className="p-4 bg-gray-800 rounded-lg text-sm text-gray-400">
              💡 Bạn có thể tìm thấy các file này trong thư mục{' '}
              <code className="text-gray-200 bg-gray-700 px-1 rounded">backend/</code>{' '}
              của dự án. Mở ra và đọc toàn bộ file để hiểu context đầy đủ.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {(() => {
          const idx = lessons.findIndex(l => l.id === nodeId)
          const prev = lessons[idx - 1]
          const next = lessons[idx + 1]
          return (
            <>
              {prev ? (
                <a href={`/roadmap/${prev.id}`} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  ← {prev.title}
                </a>
              ) : <div />}
              {next ? (
                <a href={`/roadmap/${next.id}`} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  {next.title} →
                </a>
              ) : <div />}
            </>
          )
        })()}
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { RoadmapNode } from '@/components/RoadmapNode'
import { lessons } from '@/content/lessons'
import { api, ProgressRecord, isLoggedIn } from '@/lib/api'

const STAGES = [
  { id: 1, title: 'Giai đoạn 1: Nền tảng', subtitle: 'Hiểu bức tranh tổng thể', color: 'from-blue-900/50 to-blue-950' },
  { id: 2, title: 'Giai đoạn 2: Core Backend', subtitle: 'Xây dựng API thật', color: 'from-purple-900/50 to-purple-950' },
  { id: 3, title: 'Giai đoạn 3: Vận hành', subtitle: 'Deploy và vận hành', color: 'from-green-900/50 to-green-950' },
  { id: 4, title: 'Giai đoạn 4: Nâng cao', subtitle: 'Scale và tối ưu', color: 'from-orange-900/50 to-orange-950' },
]

function getStatus(
  nodeId: string, stageId: number, progress: ProgressRecord[], loggedIn: boolean
): 'locked' | 'available' | 'in-progress' | 'completed' {
  if (!loggedIn) return stageId === 1 ? 'available' : 'locked'
  const p = progress.find(r => r.node_id === nodeId)
  if (!p) {
    if (stageId === 1) return 'available'
    const prevDone = lessons.filter(l => l.stageId === stageId - 1).every(l =>
      progress.find(r => r.node_id === l.id)?.completed
    )
    return prevDone ? 'available' : 'locked'
  }
  if (p.completed) return 'completed'
  if (p.theory_read || p.quiz_best_score > 0) return 'in-progress'
  return 'available'
}

export default function RoadmapPage() {
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const logged = isLoggedIn()
    setLoggedIn(logged)
    if (logged) api.progress.getAll().then(setProgress).catch(console.error)
  }, [])

  const completed = progress.filter(p => p.completed).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Lộ trình học Backend</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Từ không biết gì đến xây dựng API thật với Python + PostgreSQL.
          Mỗi bài học đều có code thật để mổ xẻ.
        </p>
        {loggedIn && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-950 border border-blue-800 rounded-full px-4 py-1.5 text-sm text-blue-300">
            ✓ Đã hoàn thành {completed}/{lessons.length} bài
          </div>
        )}
        {!loggedIn && (
          <p className="mt-3 text-sm text-gray-500">
            <a href="/register" className="text-blue-400 hover:underline">Đăng ký</a> để lưu tiến độ học
          </p>
        )}
      </div>

      <div className="space-y-8">
        {STAGES.map(stage => {
          const nodes = lessons.filter(l => l.stageId === stage.id)
          const stageDone = nodes.filter(l => progress.find(p => p.node_id === l.id)?.completed).length
          return (
            <div key={stage.id}>
              <div className={`bg-gradient-to-r ${stage.color} rounded-t-xl px-5 py-3 flex items-center justify-between border border-b-0 border-gray-800`}>
                <div>
                  <h2 className="font-bold text-white">{stage.title}</h2>
                  <p className="text-gray-400 text-xs">{stage.subtitle}</p>
                </div>
                {loggedIn && <span className="text-sm text-gray-400">{stageDone}/{nodes.length}</span>}
              </div>
              <div className="border border-gray-800 rounded-b-xl p-4 space-y-3 bg-gray-900/20">
                {nodes.map(lesson => (
                  <RoadmapNode key={lesson.id} id={lesson.id} title={lesson.title}
                    shortDescription={lesson.shortDescription}
                    status={getStatus(lesson.id, lesson.stageId, progress, loggedIn)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 p-5 rounded-xl bg-gray-900 border border-gray-700">
        <h3 className="font-semibold text-gray-200 mb-2">💡 Học bằng cách mổ xẻ code thật</h3>
        <p className="text-gray-400 text-sm">
          App này có backend Python + PostgreSQL thật đang chạy phía sau.
          Mỗi bài học có tab <strong className="text-gray-200">"Soi code thật"</strong> để xem
          code tương ứng với khái niệm vừa học.
        </p>
        <a href="/playground" className="inline-block mt-3 text-sm text-blue-400 hover:underline">
          → Mở Swagger UI để thử gọi API trực tiếp
        </a>
      </div>
    </div>
  )
}

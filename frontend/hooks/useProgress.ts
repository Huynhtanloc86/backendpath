'use client'
import { useState, useEffect } from 'react'
import { api, ProgressRecord, BadgeRecord } from '@/lib/api'

export function useProgress(isLoggedIn: boolean) {
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [badges, setBadges] = useState<BadgeRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) { setProgress([]); setBadges([]); return }
    setLoading(true)
    Promise.all([api.progress.getAll(), api.progress.getBadges()])
      .then(([p, b]) => { setProgress(p); setBadges(b) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  const getNodeProgress = (nodeId: string) => progress.find(p => p.node_id === nodeId)

  const markTheoryRead = async (nodeId: string) => {
    const updated = await api.progress.update(nodeId, { theory_read: true })
    setProgress(prev => {
      const idx = prev.findIndex(p => p.node_id === nodeId)
      if (idx === -1) return [...prev, updated]
      const next = [...prev]; next[idx] = updated; return next
    })
    return updated
  }

  const submitQuiz = async (nodeId: string, score: number, total: number) => {
    const pct = Math.round((score / total) * 100)
    await api.progress.recordQuizAttempt(nodeId, { score, total_questions: total })
    const updated = await api.progress.update(nodeId, { quiz_score: pct })
    setProgress(prev => {
      const idx = prev.findIndex(p => p.node_id === nodeId)
      if (idx === -1) return [...prev, updated]
      const next = [...prev]; next[idx] = updated; return next
    })
    api.progress.getBadges().then(setBadges).catch(console.error)
    return updated
  }

  return { progress, badges, loading, getNodeProgress, markTheoryRead, submitQuiz }
}

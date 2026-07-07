'use client'
import { useState } from 'react'
import { QuizQuestion } from '@/content/lessons'

interface QuizProps {
  questions: QuizQuestion[]
  nodeId: string
  onComplete?: (score: number, total: number) => void
}

export function QuizComponent({ questions, onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const q = questions[current]
  const score = answers.filter(Boolean).length

  const handleSelect = (idx: number) => { if (selected === null) setSelected(idx) }

  const handleNext = () => {
    if (selected === null) return
    const correct = selected === q.correctIndex
    const newAnswers = [...answers, correct]
    setAnswers(newAnswers)
    setTimeout(() => {
      setSelected(null)
      if (current + 1 >= questions.length) {
        setFinished(true)
        onComplete?.(newAnswers.filter(Boolean).length, questions.length)
      } else {
        setCurrent(c => c + 1)
      }
    }, 1600)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="text-center py-8">
        <div className={`text-5xl font-bold mb-3 ${pct >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{pct}%</div>
        <p className="text-gray-300 mb-1">Đúng {score}/{questions.length} câu</p>
        {pct >= 80
          ? <p className="text-green-400">Xuất sắc! Bài này đã hoàn thành.</p>
          : <p className="text-yellow-400">Cần đạt 80% để hoàn thành. Hãy thử lại!</p>
        }
        <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false) }}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-sm">
          Làm lại
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Câu {current + 1}/{questions.length}</span>
        <span>Đúng: {score}</span>
      </div>
      <p className="text-lg text-gray-100 mb-6">{q.question}</p>
      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          let cls = 'w-full text-left px-4 py-3 rounded-lg border transition-colors '
          if (selected === null) {
            cls += 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
          } else if (i === q.correctIndex) {
            cls += 'border-green-500 bg-green-500/20 text-green-300'
          } else if (i === selected) {
            cls += 'border-red-500 bg-red-500/20 text-red-300'
          } else {
            cls += 'border-gray-700 bg-gray-800/50 text-gray-500'
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              <span className="font-mono text-xs mr-3 text-gray-500">{['A','B','C','D'][i]}.</span>{opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className={`p-4 rounded-lg mb-4 text-sm ${selected === q.correctIndex
          ? 'bg-green-900/30 border border-green-700 text-green-300'
          : 'bg-red-900/30 border border-red-700 text-red-300'}`}>
          <strong>{selected === q.correctIndex ? '✓ Đúng! ' : '✗ Sai. '}</strong>{q.explanation}
        </div>
      )}
      <button onClick={handleNext} disabled={selected === null}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors text-sm">
        {current + 1 === questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
      </button>
    </div>
  )
}

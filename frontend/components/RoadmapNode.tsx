import Link from 'next/link'

interface RoadmapNodeProps {
  id: string
  title: string
  shortDescription: string
  status: 'locked' | 'available' | 'in-progress' | 'completed'
}

const cfg = {
  locked:      { border: 'border-gray-800 opacity-50',       icon: '🔒', text: 'text-gray-500' },
  available:   { border: 'border-gray-700 hover:border-blue-600', icon: '📖', text: 'text-gray-300' },
  'in-progress':{ border: 'border-blue-700 hover:border-blue-400', icon: '⚡', text: 'text-blue-200' },
  completed:   { border: 'border-green-800 hover:border-green-600', icon: '✅', text: 'text-green-200' },
}

export function RoadmapNode({ id, title, shortDescription, status }: RoadmapNodeProps) {
  const c = cfg[status]
  const inner = (
    <div className={`border rounded-xl p-4 bg-gray-900 transition-all ${c.border} ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{c.icon}</span>
        <div>
          <h3 className={`font-semibold ${c.text}`}>{title}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{shortDescription}</p>
        </div>
      </div>
    </div>
  )
  if (status === 'locked') return inner
  return <Link href={`/roadmap/${id}`}>{inner}</Link>
}

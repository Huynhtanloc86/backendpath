'use client'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between border-b border-gray-700">
        <span className="font-mono">{filename || 'code'}</span>
        <button onClick={copy} className="hover:text-white transition-colors">
          {copied ? '✓ Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <pre className="bg-gray-950 p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

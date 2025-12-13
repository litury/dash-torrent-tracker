import { useState } from 'react'
import { Send } from 'lucide-react'
import clsx from 'clsx'

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>
  disabled?: boolean
}

const MAX_LENGTH = 1000

export const CommentForm = ({ onSubmit, disabled }: CommentFormProps) => {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const trimmedText = text.trim()
  const canSubmit = trimmedText.length > 0 && trimmedText.length <= MAX_LENGTH && !submitting && !disabled

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await onSubmit(trimmedText)
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={clsx(
        "flex items-center gap-4 p-4 sm:p-6 rounded-xl border transition-colors",
        disabled
          ? "border-dash-dark-15 dark:border-dash-white-15 opacity-50 cursor-not-allowed"
          : "border-[#d3e8f7] dark:border-dash-white-15 hover:border-dash-blue dark:hover:border-dash-blue"
      )}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Connect wallet to comment..." : "Leave a comment..."}
          disabled={disabled || submitting}
          maxLength={MAX_LENGTH}
          className="flex-1 bg-transparent text-sm text-dash-dark dark:text-dash-white placeholder:text-dash-dark-50 dark:placeholder:text-dash-white-50 focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={clsx(
            "flex-shrink-0 p-1 transition-colors",
            canSubmit
              ? "text-dash-blue hover:text-dash-blue/80 cursor-pointer"
              : "text-dash-dark-25 dark:text-dash-white-25 cursor-not-allowed"
          )}
          title={disabled ? "Connect wallet to comment" : "Send comment"}
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-dash-blue border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  )
}

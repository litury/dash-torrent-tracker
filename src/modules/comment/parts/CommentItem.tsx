import { Trash2 } from 'lucide-react'
import { Button } from '../../../shared/components/Button'
import type { Comment } from '../types'

interface CommentItemProps {
  comment: Comment
  isOwner: boolean
  onDelete?: () => void
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  if (isToday) return `Today @ ${time}`
  if (isYesterday) return `Yesterday @ ${time}`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) + ` @ ${time}`
}

const formatOwner = (owner: string): string => {
  if (owner.length <= 12) return owner
  return `${owner.slice(0, 6)}...${owner.slice(-4)}`
}

export const CommentItem = ({ comment, isOwner, onDelete }: CommentItemProps) => {
  return (
    <div className="bg-white dark:bg-dash-dark rounded-lg p-3 space-y-2">
      {/* Header: Author + Date + Badge + Delete */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {/* Author pill */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-dash-dark-5 dark:bg-dash-white-15 font-mono text-sm text-dash-dark dark:text-dash-white">
            {formatOwner(comment.owner)}
          </span>

          {/* Date */}
          <span className="text-xs font-mono text-dash-dark-50 dark:text-dash-white-50">
            {formatDate(comment.createdAt)}
          </span>

          {/* "you" badge */}
          {isOwner && (
            <span className="px-2 py-1 text-xs font-bold font-mono rounded bg-[rgba(0,228,36,0.1)] text-[#16962a] dark:bg-[rgba(0,228,36,0.15)] dark:text-[#4ade80]">
              you
            </span>
          )}
        </div>

        {isOwner && onDelete && (
          <Button
            variant="ghost"
            color="error"
            size="small"
            iconOnly
            icon={<Trash2 className="w-4 h-4" />}
            onClick={onDelete}
            title="Delete comment"
          />
        )}
      </div>

      {/* Comment text */}
      <p className="text-sm text-dash-dark dark:text-dash-white whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
        {comment.text}
      </p>
    </div>
  )
}

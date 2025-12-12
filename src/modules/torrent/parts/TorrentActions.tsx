import { useState, useRef, useEffect } from 'react'
import { MoreVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../../../shared/components/Button'
import type { Torrent } from '../types'

interface TorrentActionsProps {
  torrent: Torrent
  isOwner: boolean
  onEdit: (torrent: Torrent) => void
  onDelete: (torrent: Torrent) => void
}

export const TorrentActions = ({ torrent, isOwner, onEdit, onDelete }: TorrentActionsProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEdit = () => {
    setOpen(false)
    onEdit(torrent)
  }

  const handleDelete = () => {
    setOpen(false)
    onDelete(torrent)
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        color="darkBlue"
        size="small"
        iconOnly
        icon={<MoreVertical />}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(!open)
        }}
        title="Actions"
      />

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15 rounded-lg shadow-lg z-20">
          <a
            href={`https://testnet.platform-explorer.com/document/${torrent.identifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dash-dark dark:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors rounded-t-lg"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </a>

          {isOwner && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit()
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dash-dark dark:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error-5 dark:hover:bg-error-15 transition-colors rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import type { WalletInfo } from '../../wallet/types'
import type { Comment } from '../types'
import { USE_MOCK, MOCK_COMMENTS } from '../types'
import { CommentItem } from '../parts/CommentItem'
import { CommentForm } from '../parts/CommentForm'

interface CommentSectionProps {
  torrentId: string
  walletInfo: WalletInfo
}

export const CommentSection = ({ torrentId, walletInfo }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      try {
        if (USE_MOCK) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500))
          // Filter mock comments by torrentId (in real app, this would be done by SDK query)
          setComments(MOCK_COMMENTS.map(c => ({ ...c, torrentId })))
        } else {
          // TODO: Fetch real comments from SDK
          // const sdk = useSdk()
          // const where = [['torrentId', '==', torrentId]]
          // const documents = await sdk.documents.query(DATA_CONTRACT_IDENTIFIER, 'comment', where)
          // setComments(documents.map(doc => ...))
          setComments([])
        }
      } catch (err) {
        console.error('Failed to fetch comments:', err)
        toast.error('Failed to load comments')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [torrentId])

  const handleAddComment = async (text: string) => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      const newComment: Comment = {
        id: `mock-${Date.now()}`,
        torrentId,
        text,
        owner: walletInfo.currentIdentity || 'unknown',
        createdAt: new Date()
      }
      setComments(prev => [newComment, ...prev])
      toast.success('Comment added!')
    } else {
      // TODO: Create real comment via SDK
      // const sdk = useSdk()
      // await sdk.documents.create(DATA_CONTRACT_IDENTIFIER, 'comment', { torrentId, text })
      toast.info('Comments are not yet available')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success('Comment deleted')
    } else {
      // TODO: Delete real comment via SDK
      // const sdk = useSdk()
      // await sdk.documents.delete(DATA_CONTRACT_IDENTIFIER, 'comment', commentId)
      toast.info('Comments are not yet available')
    }
  }

  return (
    <div className="bg-dash-white/40 dark:bg-dash-space-cadet/40 rounded-xl p-4 sm:p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold font-mono text-dash-dark dark:text-dash-white">
          Comments
        </h2>
        {!loading && (
          <span className="px-2 py-1 text-xs font-bold font-mono bg-dash-dark text-white dark:bg-dash-white dark:text-dash-dark rounded">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-dash-dark rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-24" />
                <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-28" />
              </div>
              <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 mx-auto text-dash-dark-25 dark:text-dash-white-25 mb-3" />
          <p className="text-sm text-dash-dark-50 dark:text-dash-white-50">
            No comments yet
          </p>
          {!walletInfo.connected && (
            <p className="text-xs text-dash-dark-50 dark:text-dash-white-50 mt-1">
              Connect wallet to add a comment
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={walletInfo.connected && comment.owner === walletInfo.currentIdentity}
              onDelete={() => handleDeleteComment(comment.id)}
            />
          ))}
        </div>
      )}

      {/* Add comment form - always visible, disabled when not connected */}
      <CommentForm
        onSubmit={handleAddComment}
        disabled={!walletInfo.connected}
      />
    </div>
  )
}

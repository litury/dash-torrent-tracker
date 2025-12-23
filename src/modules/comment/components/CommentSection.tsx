import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useSdk } from '../../../shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, COMMENT_DOCUMENT_TYPE } from '../../../config/constants'
import type { WalletInfo } from '../../wallet/types'
import type { Comment } from '../types'
import { CommentItem } from '../parts/CommentItem'
import { CommentForm } from '../parts/CommentForm'

interface CommentSectionProps {
  torrentId: string
  walletInfo: WalletInfo
}

export const CommentSection = ({ torrentId, walletInfo }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const sdk = useSdk()
      // SDK doesn't support byteArray queries, load all and filter on client
      const documents = await sdk.documents.query(
        DATA_CONTRACT_IDENTIFIER,
        COMMENT_DOCUMENT_TYPE,
        undefined,
        undefined,
        100
      )

      const mappedComments: Comment[] = documents
        .filter((doc) => {
          const properties = doc.properties as { torrentId: string | string[] }
          const docTorrentId = Array.isArray(properties.torrentId)
            ? properties.torrentId.join('')
            : properties.torrentId
          return docTorrentId === torrentId
        })
        .map((doc) => {
          const properties = doc.properties as { text: string }
          return {
            id: doc.id.base58(),
            torrentId,
            text: properties.text,
            owner: doc.ownerId.base58(),
            createdAt: new Date(parseInt(doc.createdAt?.toString() ?? '0'))
          }
        })

      setComments(mappedComments)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [torrentId])

  const handleAddComment = async (text: string) => {
    try {
      const sdk = useSdk()
      const dashPlatformExtension = (window as any).dashPlatformExtension

      if (!dashPlatformExtension || !walletInfo.currentIdentity) {
        throw new Error('Wallet not connected')
      }

      let identityContractNonce: bigint

      try {
        identityContractNonce = await sdk.identities.getIdentityContractNonce(
          walletInfo.currentIdentity,
          DATA_CONTRACT_IDENTIFIER
        )
      } catch (e) {
        if (String(e).startsWith('Error: Could not get identityContractNonce')) {
          identityContractNonce = 0n
        } else {
          throw e
        }
      }

      const torrentIdBytes = sdk.utils.base58ToBytes(torrentId)
      const data = {
        torrentId: torrentIdBytes,
        text
      }

      const document = await sdk.documents.create(
        DATA_CONTRACT_IDENTIFIER,
        COMMENT_DOCUMENT_TYPE,
        data,
        walletInfo.currentIdentity,
        identityContractNonce + 1n
      )

      const stateTransition = await sdk.documents.createStateTransition(document, 'create', {
        identityContractNonce: identityContractNonce + 1n
      })

      await dashPlatformExtension.signer.signAndBroadcast(stateTransition)

      toast.success('Comment added!')
      await fetchComments()
    } catch (err) {
      console.error('Failed to add comment:', err)
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const sdk = useSdk()
      const dashPlatformExtension = (window as any).dashPlatformExtension

      if (!dashPlatformExtension || !walletInfo.currentIdentity) {
        throw new Error('Wallet not connected')
      }

      let identityContractNonce: bigint

      try {
        identityContractNonce = await sdk.identities.getIdentityContractNonce(
          walletInfo.currentIdentity,
          DATA_CONTRACT_IDENTIFIER
        )
      } catch (e) {
        if (String(e).startsWith('Error: Could not get identityContractNonce')) {
          identityContractNonce = 0n
        } else {
          throw e
        }
      }

      const where = [['$id', '==', commentId]]
      const [document] = await sdk.documents.query(
        DATA_CONTRACT_IDENTIFIER,
        COMMENT_DOCUMENT_TYPE,
        where
      )

      if (!document) {
        throw new Error('Comment not found')
      }

      const stateTransition = await sdk.documents.createStateTransition(document, 'delete', {
        identityContractNonce: identityContractNonce + 1n
      })

      await dashPlatformExtension.signer.signAndBroadcast(stateTransition)

      toast.success('Comment deleted')
      await fetchComments()
    } catch (err) {
      console.error('Failed to delete comment:', err)
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message)
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

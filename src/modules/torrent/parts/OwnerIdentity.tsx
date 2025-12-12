import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { identicon } from '@dicebear/collection'
import clsx from 'clsx'

interface OwnerIdentityProps {
  owner: string
  isOwner?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64
}

const formatIdentity = (identity: string): string => {
  if (identity.length <= 12) return identity
  return `${identity.slice(0, 6)}...${identity.slice(-4)}`
}

export const OwnerIdentity = ({
  owner,
  isOwner = false,
  size = 'md',
  showLabel = true
}: OwnerIdentityProps) => {
  const iconSize = sizeMap[size]

  const avatarUri = useMemo(() => {
    const avatar = createAvatar(identicon, {
      seed: owner,
      size: iconSize
    })
    return avatar.toDataUri()
  }, [owner, iconSize])

  return (
    <div className="flex items-center gap-2">
      <img
        src={avatarUri}
        alt="Identity"
        width={iconSize}
        height={iconSize}
        className={clsx(
          "rounded-lg flex-shrink-0",
          "bg-dash-dark-5 dark:bg-dash-white-15"
        )}
      />

      {showLabel && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-dash-dark-75 dark:text-dash-white-75">
            {formatIdentity(owner)}
          </span>

          {isOwner && (
            <span className="px-1.5 py-0.5 bg-dash-blue-15 text-dash-blue text-xs font-medium rounded">
              You
            </span>
          )}
        </div>
      )}
    </div>
  )
}

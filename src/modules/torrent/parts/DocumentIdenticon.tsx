import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { identicon } from '@dicebear/collection'
import clsx from 'clsx'

interface DocumentIdenticonProps {
  documentId: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const sizeMap = {
  xs: 20,
  sm: 32,
  md: 48,
  lg: 64
}

export const DocumentIdenticon = ({
  documentId,
  size = 'md'
}: DocumentIdenticonProps) => {
  const iconSize = sizeMap[size]

  const avatarUri = useMemo(() => {
    const avatar = createAvatar(identicon, {
      seed: documentId,
      size: iconSize
    })
    return avatar.toDataUri()
  }, [documentId, iconSize])

  return (
    <img
      src={avatarUri}
      alt="Document"
      width={iconSize}
      height={iconSize}
      className={clsx(
        "rounded-lg flex-shrink-0",
        "bg-dash-dark-5 dark:bg-dash-white-15"
      )}
    />
  )
}

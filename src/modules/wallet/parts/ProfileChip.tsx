interface ProfileChipProps {
  address: string | null
}

export const ProfileChip = ({ address }: ProfileChipProps) => {
  if (!address || typeof address !== 'string') {
    return null
  }

  const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 6)}`

  return (
    <div
      className="flex items-center gap-2 bg-dash-dark-15 dark:bg-dash-white-15 text-dash-dark dark:text-dash-white rounded-full py-1.5 px-3"
      aria-label={`Connected account: ${address}`}
      title={address}
    >
      <span className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
      <span className="text-sm font-mono font-medium">{truncatedAddress}</span>
    </div>
  )
}

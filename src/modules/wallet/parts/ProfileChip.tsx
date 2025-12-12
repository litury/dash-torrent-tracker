interface ProfileChipProps {
  address: string | null
}

export const ProfileChip = ({ address }: ProfileChipProps) => {
  if (!address || typeof address !== 'string') {
    return null
  }

  const truncatedAddress = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`

  return (
    <div
      className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-dash-dark-15 dark:bg-dash-white-15 text-dash-dark dark:text-dash-white hover:bg-dash-dark-25 dark:hover:bg-dash-white-25 transition-colors"
      aria-label={`Connected account: ${address}`}
      title={address}
    >
      <span className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
      <span className="font-mono">{truncatedAddress}</span>
    </div>
  )
}

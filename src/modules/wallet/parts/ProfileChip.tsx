import { Button } from '../../../shared/components/Button'

interface ProfileChipProps {
  address: string | null
  onClick?: () => void
}

export const ProfileChip = ({ address, onClick }: ProfileChipProps) => {
  if (!address || typeof address !== 'string') {
    return null
  }

  const truncatedAddress = `${address.substring(0, 3)}...${address.substring(address.length - 3)}`

  return (
    <Button
      variant="alternative"
      color="darkBlue"
      size="small"
      onClick={onClick}
      className="font-mono min-w-[130px]"
      title={address}
      aria-label={`Connected account: ${address}`}
    >
      <span className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
      {truncatedAddress}
    </Button>
  )
}

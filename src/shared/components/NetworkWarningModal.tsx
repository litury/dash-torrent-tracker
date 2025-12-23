import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'

interface NetworkWarningModalProps {
  isOpen: boolean
  onClose: () => void
  detectedNetwork: 'mainnet' | 'testnet'
}

export const NetworkWarningModal = ({
  isOpen,
  onClose,
  detectedNetwork
}: NetworkWarningModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Network Mismatch Warning"
      size="sm"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>

        {/* Warning Text */}
        <div className="space-y-2">
          <p className="text-dash-dark dark:text-dash-white">
            You are connected to <span className="font-semibold text-warning">{detectedNetwork}</span>
          </p>
          <p className="text-sm text-dash-dark-75 dark:text-dash-white-75">
            This application is designed for <strong>testnet only</strong>. Please switch your Dash Platform Extension to testnet network.
          </p>
        </div>

        {/* Steps */}
        <div className="w-full text-left space-y-2 p-4 bg-dash-dark-5 dark:bg-dash-white-5 rounded-lg">
          <p className="text-xs font-semibold text-dash-dark dark:text-dash-white">How to switch:</p>
          <ol className="text-xs text-dash-dark-75 dark:text-dash-white-75 space-y-1 list-decimal list-inside">
            <li>Open Dash Platform Extension</li>
            <li>Go to Settings</li>
            <li>Select Network: <strong>Testnet</strong></li>
            <li>Refresh this page</li>
          </ol>
        </div>

        {/* Dismiss Button */}
        <Button
          variant="primary"
          color="blue"
          size="medium"
          className="w-full"
          onClick={onClose}
        >
          I Understand
        </Button>
      </div>
    </Modal>
  )
}

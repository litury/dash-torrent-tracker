import { Search, X } from 'lucide-react'
import { Input } from './Input'

interface SearchInputProps {
  value: string
  onChange: (_value: string) => void
  placeholder?: string
  onClose?: () => void
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClose
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={<Search />}
        size="small"
        rounded="full"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            onClose?.()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

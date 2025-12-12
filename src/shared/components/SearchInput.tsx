import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (_value: string) => void
  placeholder?: string
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search torrents...'
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-dark-75 dark:text-dash-white-75" />
      <input
        type="text"
        value={value}
        onChange={(_e) => onChange(_e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-dash-dark-15 dark:border-dash-white-15 rounded-lg bg-dash-white dark:bg-dash-space-cadet text-dash-dark dark:text-dash-white placeholder-dash-dark-75 dark:placeholder-dash-white-75 focus:border-dash-blue focus:outline-none transition-colors"
      />
    </div>
  )
}

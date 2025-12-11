interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (_tabId: string) => void
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="border-b border-dash-dark-15 dark:border-dash-white-15">
      <nav className="flex gap-8" aria-label="Tabs">
        {tabs.map((_tab) => (
          <button
            key={_tab.id}
            onClick={() => onTabChange(_tab.id)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === _tab.id
                ? 'border-dash-blue text-dash-blue'
                : 'border-transparent text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white'
            }`}
          >
            {_tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export const TORRENT_TABS: Tab[] = [
  { id: 'recent', label: 'Recent' },
  { id: 'popular', label: 'Popular' },
  { id: 'video', label: 'Video' },
  { id: 'music', label: 'Music' },
  { id: 'apps', label: 'Apps' },
  { id: 'books', label: 'Books' },
  { id: 'other', label: 'Other' }
]

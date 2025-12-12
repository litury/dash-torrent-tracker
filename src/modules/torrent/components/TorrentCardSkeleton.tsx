export const TorrentCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full p-4 rounded-xl bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15 animate-pulse">
      {/* Identicon placeholder — по центру */}
      <div className="flex justify-center mb-3">
        <div className="w-8 h-8 rounded-lg bg-dash-dark-15 dark:bg-dash-white-15" />
      </div>

      {/* Title + Description placeholders — по центру */}
      <div className="flex flex-col items-center space-y-2">
        <div className="h-5 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-3/4" />
        <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-full" />
        <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-2/3" />
      </div>

      {/* Footer: Owner (left) + Date (right) */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="h-3 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-14" />
        <div className="h-3 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-16" />
      </div>
    </div>
  )
}

export const TorrentListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15">
      {/* Icon skeleton */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse" />

      {/* Name skeleton */}
      <div className="flex-1 min-w-0">
        <div className="h-4 w-32 rounded bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="flex-1 min-w-0 hidden md:block">
        <div className="h-4 w-48 rounded bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse" />
      </div>

      {/* Owner skeleton */}
      <div className="flex-shrink-0 hidden lg:block w-20">
        <div className="h-3 w-16 mx-auto rounded bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse" />
      </div>

      {/* Date skeleton */}
      <div className="flex-shrink-0">
        <div className="h-3 w-20 rounded bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse" />
      </div>
    </div>
  )
}

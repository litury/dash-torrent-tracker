export const TorrentPageSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Main Card */}
      <div className="bg-dash-white dark:bg-dash-space-cadet rounded-xl border border-dash-dark-15 dark:border-dash-white-15 overflow-hidden">
        {/* Header: Icon + Title + Actions */}
        <div className="p-4 sm:p-6 border-b border-dash-dark-5 dark:border-dash-white-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            {/* Identicon */}
            <div className="w-16 h-16 rounded-lg bg-dash-dark-15 dark:bg-dash-white-15 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title */}
              <div className="h-6 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-3/4" />
              {/* Meta: owner + date */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-32" />
                <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-24 hidden sm:block" />
              </div>
            </div>
            {/* Action buttons placeholder */}
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="h-8 bg-dash-dark-15 dark:bg-dash-white-15 rounded flex-1 sm:w-20" />
              <div className="h-8 bg-dash-dark-15 dark:bg-dash-white-15 rounded flex-1 sm:w-20" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 sm:p-6 border-b border-dash-dark-5 dark:border-dash-white-5 space-y-3">
          <div className="h-3 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-20" />
          <div className="space-y-2">
            <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-full" />
            <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-5/6" />
            <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-4/6" />
          </div>
        </div>

        {/* Download CTA */}
        <div className="p-4 sm:p-6 border-b border-dash-dark-5 dark:border-dash-white-5">
          <div className="h-10 bg-dash-dark-15 dark:bg-dash-white-15 rounded-lg w-full sm:w-48" />
        </div>

        {/* Metadata Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-20" />
              <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section Skeleton */}
      <div className="bg-dash-white/40 dark:bg-dash-space-cadet/40 rounded-xl p-4 sm:p-6 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-20" />
          <div className="h-6 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-8" />
        </div>

        {/* Comment skeletons */}
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-dash-dark rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-24" />
                <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-28" />
              </div>
              <div className="h-4 bg-dash-dark-15 dark:bg-dash-white-15 rounded w-3/4" />
            </div>
          ))}
        </div>

        {/* Form skeleton */}
        <div className="h-14 bg-dash-dark-15 dark:bg-dash-white-15 rounded-xl" />
      </div>
    </div>
  )
}

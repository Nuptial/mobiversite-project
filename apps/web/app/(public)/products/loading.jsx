const Loading = () => (
  <div className="flex h-64 items-center justify-center text-neutral-900">
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent" />
      <span className="text-sm font-medium">Loading products...</span>
    </div>
  </div>
)

export default Loading

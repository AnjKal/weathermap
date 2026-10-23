export const LoadingState = ({ label }: { label: string }) => (
  <div className='flex items-center gap-2 text-sm text-slate-600'>
    <span className='h-3 w-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent' aria-hidden='true' />
    <span>{label}</span>
  </div>
)

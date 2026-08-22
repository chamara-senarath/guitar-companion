export function ShortcutHint({ isActive }: { isActive: boolean }) {
  return (
    <p className="flex items-center justify-center gap-1.5 whitespace-nowrap text-xs text-white/60 sm:text-sm">
      <span>Press</span>
      <kbd className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-white/85 sm:text-xs">
        Space
      </kbd>
      <span>to {isActive ? 'stop' : 'start'} listening</span>
    </p>
  )
}

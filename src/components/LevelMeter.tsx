const BAR_WEIGHTS = [0.45, 0.75, 1, 0.75, 0.45]

export function LevelMeter({ level, active }: { level: number; active: boolean }) {
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden="true">
      {BAR_WEIGHTS.map((weight, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-amber-glow transition-[height,opacity] duration-100 ease-out"
          style={{
            height: active ? `${Math.max(10, Math.min(1, level * weight * 1.4) * 100)}%` : '12%',
            opacity: active ? 0.85 : 0.25,
          }}
        />
      ))}
    </div>
  )
}

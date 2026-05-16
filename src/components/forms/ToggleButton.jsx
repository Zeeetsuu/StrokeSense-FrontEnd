export default function ToggleButton({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-h-11 flex-1 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:min-w-[100px] ${
              selected
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-muted hover:border-primary/40'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Input({
  label,
  error,
  unit,
  id,
  className = '',
  ...props
}) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-text"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''} ${unit ? 'pr-16' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

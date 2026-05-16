export default function FormField({ label, error, children, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="mb-2 text-sm font-medium text-text">{label}</p>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

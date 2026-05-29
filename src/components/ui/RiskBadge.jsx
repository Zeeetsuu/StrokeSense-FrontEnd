function normalizeRiskLevel(riskLevel) {
  const value = String(riskLevel || '').toLowerCase()

  if (value.includes('high')) {
    return {
      label: 'High Risk',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: '⚠️',
    }
  }

  if (value.includes('medium') || value.includes('moderate')) {
    return {
      label: 'Medium Risk',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: '⚠️',
    }
  }

  if (value.includes('low')) {
    return {
      label: 'Low Risk',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: '✓',
    }
  }

  return {
    label: riskLevel || 'Unknown Risk',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: 'ℹ️',
  }
}

export default function RiskBadge({ riskLevel, size = 'md' }) {
  const config = normalizeRiskLevel(riskLevel)

  const sizeClass =
    size === 'lg'
      ? 'px-4 py-2 text-sm'
      : 'px-3 py-1.5 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeClass} ${config.className}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

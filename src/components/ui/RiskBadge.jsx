import Badge from './Badge'
import { getRiskConfig } from '../../utils/riskUtils'

export default function RiskBadge({ riskLevel, size = 'md' }) {
  const { bgClass, label, Icon } = getRiskConfig(riskLevel)
  const sizeClass = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'

  return (
    <Badge className={`${bgClass} ${sizeClass} gap-1.5`}>
      <Icon className="h-4 w-4" />
      {label}
    </Badge>
  )
}

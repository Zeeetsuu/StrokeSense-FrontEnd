import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react'

const RISK_CONFIG = {
  Low: {
    color: '#16A34A',
    bgClass: 'bg-green-100 text-green-800',
    borderClass: 'border-green-200',
    label: 'Low Risk',
    Icon: ShieldCheck,
  },
  Medium: {
    color: '#D97706',
    bgClass: 'bg-amber-100 text-amber-800',
    borderClass: 'border-amber-200',
    label: 'Medium Risk',
    Icon: AlertTriangle,
  },
  High: {
    color: '#DC2626',
    bgClass: 'bg-red-100 text-red-800',
    borderClass: 'border-red-200',
    label: 'High Risk',
    Icon: AlertCircle,
  },
}

export function getRiskConfig(riskLevel) {
  return RISK_CONFIG[riskLevel] ?? RISK_CONFIG.Medium
}

export function getRiskColor(riskLevel) {
  return getRiskConfig(riskLevel).color
}

export function getRiskLabel(riskLevel) {
  return getRiskConfig(riskLevel).label
}

export function getRiskIcon(riskLevel) {
  return getRiskConfig(riskLevel).Icon
}

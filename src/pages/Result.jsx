import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, Lightbulb } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import RiskBadge from '../components/ui/RiskBadge'
import CircularGauge from '../components/ui/CircularGauge'

const FIELD_LABELS = {
  name: 'Name',
  gender: 'Gender',
  age: 'Age',
  hypertension: 'Hypertension',
  heart_disease: 'Heart Disease',
  ever_married: 'Ever Married',
  work_type: 'Work Type',
  residence_type: 'Residence',
  avg_glucose_level: 'Avg. Glucose',
  bmi: 'BMI',
  smoking_status: 'Smoking Status',
}

function formatValue(key, value) {
  if (key === 'hypertension' || key === 'heart_disease') {
    return value === 1 ? 'Yes' : 'No'
  }
  if (key === 'work_type') {
    const map = {
      children: 'Children',
      Govt_job: 'Government Job',
      Never_worked: 'Never Worked',
      Private: 'Private',
      'Self-employed': 'Self-employed',
    }
    return map[value] ?? value
  }
  if (key === 'avg_glucose_level') return `${value} mg/dL`
  return String(value ?? '—')
}

export default function Result() {
  const navigate = useNavigate()

  const data = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('lastPrediction')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!data) navigate('/check', { replace: true })
  }, [data, navigate])

  if (!data) return null

  const { input, prediction } = data
  const summaryEntries = Object.entries(FIELD_LABELS).filter(
    ([key]) => input[key] !== undefined && input[key] !== '',
  )

  return (
    <PageWrapper className="max-w-2xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          Your Risk Assessment
        </h1>
        <p className="mt-2 text-sm text-muted">
          Based on the health data you submitted
        </p>
      </div>

      <Card className="mt-8 flex flex-col items-center gap-4">
        <CircularGauge
          percent={prediction.probabilityPercent}
          riskLevel={prediction.riskLevel}
        />
        <RiskBadge riskLevel={prediction.riskLevel} size="lg" />
      </Card>

      {prediction.factors?.length > 0 && (
        <Card className="mt-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-text">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Risk Factors
          </h2>
          <ul className="space-y-2">
            {prediction.factors.map((factor) => (
              <li
                key={factor}
                className="flex items-start gap-2 text-sm text-muted"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {factor}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {prediction.recommendations?.length > 0 && (
        <Card className="mt-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-text">
            <Lightbulb className="h-5 w-5 text-primary" />
            Recommendations
          </h2>
          <ul className="space-y-2">
            {prediction.recommendations.map((rec) => (
              <li
                key={rec}
                className="flex items-start gap-2 text-sm text-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {rec}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {prediction.disclaimer && (
        <div className="mt-6 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-muted">
          <Info className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p>{prediction.disclaimer}</p>
        </div>
      )}

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold text-text">Submitted Summary</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {summaryEntries.map(([key, label]) => (
            <div key={key} className="rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-xs font-medium text-muted">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-text">
                {key === 'name'
                  ? input.name || 'Anonymous'
                  : formatValue(key, input[key])}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/check">
          <Button variant="primary" className="w-full sm:w-auto">
            Check Again
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary" className="w-full sm:w-auto">
            View History
          </Button>
        </Link>
      </div>
    </PageWrapper>
  )
}

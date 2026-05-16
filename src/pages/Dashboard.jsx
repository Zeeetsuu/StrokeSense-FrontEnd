import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Trash2, ClipboardPlus } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import RiskBadge from '../components/ui/RiskBadge'
import {
  getPredictions,
  deletePrediction,
} from '../api/strokesense'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatChartDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function Dashboard() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchPredictions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPredictions()
      const list = response?.data ?? response ?? []
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      )
      setPredictions(sorted)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load predictions. Is the backend running?',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deletePrediction(id)
      await fetchPredictions()
    } catch {
      setError('Failed to delete prediction.')
    } finally {
      setDeletingId(null)
    }
  }

  const latest = predictions[predictions.length - 1]
  const chartData = predictions.map((p) => ({
    date: formatChartDate(p.createdAt),
    score: p.prediction?.probabilityPercent ?? 0,
    fullDate: p.createdAt,
  }))

  if (loading) {
    return (
      <PageWrapper className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </PageWrapper>
    )
  }

  if (error && predictions.length === 0) {
    return (
      <PageWrapper className="text-center">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" onClick={fetchPredictions}>
          Retry
        </Button>
      </PageWrapper>
    )
  }

  if (predictions.length === 0) {
    return (
      <PageWrapper className="max-w-lg text-center">
        <Card>
          <ClipboardPlus className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-bold text-text">No Checks Yet</h2>
          <p className="mt-2 text-sm text-muted">
            Run your first stroke risk assessment to see your history and trends
            here.
          </p>
          <Link to="/check" className="mt-6 inline-block">
            <Button>Start Risk Check</Button>
          </Link>
        </Card>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-text sm:text-3xl">
        Prediction History
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="text-center sm:text-left">
          <p className="text-sm text-muted">Total Checks</p>
          <p className="mt-1 text-2xl font-bold text-text">
            {predictions.length}
          </p>
        </Card>
        <Card className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm text-muted">Latest Risk</p>
          {latest?.prediction?.riskLevel && (
            <RiskBadge riskLevel={latest.prediction.riskLevel} />
          )}
        </Card>
        <Card className="text-center sm:text-left">
          <p className="text-sm text-muted">Latest Score</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {latest?.prediction?.probabilityPercent?.toFixed(1)}%
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold text-text">Risk Trend</h2>
        <div className="min-h-[250px] w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={280} minWidth={300}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#94A3B8"
                unit="%"
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Risk Score']}
              />
              <ReferenceLine
                y={35}
                stroke="#D97706"
                strokeDasharray="5 5"
                label={{ value: 'Medium', position: 'right', fontSize: 10 }}
              />
              <ReferenceLine
                y={70}
                stroke="#DC2626"
                strokeDasharray="5 5"
                label={{ value: 'High', position: 'right', fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0D9488"
                strokeWidth={2}
                dot={{ fill: '#0D9488', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Card className="mt-6 overflow-hidden p-0">
        <h2 className="border-b border-slate-100 px-6 py-4 font-semibold text-text">
          All Predictions
        </h2>

        {/* Mobile cards */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {predictions
            .slice()
            .reverse()
            .map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text">
                    {p.input?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(p.createdAt)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <RiskBadge riskLevel={p.prediction?.riskLevel} />
                    <span className="text-sm font-semibold text-primary">
                      {p.prediction?.probabilityPercent?.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50"
                  aria-label="Delete prediction"
                >
                  {deletingId === p.id ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </li>
            ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Risk</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {predictions
                .slice()
                .reverse()
                .map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-muted">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-text">
                      {p.input?.name || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge riskLevel={p.prediction?.riskLevel} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      {p.prediction?.probabilityPercent?.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50"
                        aria-label="Delete prediction"
                      >
                        {deletingId === p.id ? (
                          <Spinner className="h-5 w-5" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  )
}

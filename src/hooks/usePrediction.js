import { useState, useCallback } from 'react'
import { createPrediction } from '../api/strokesense'

export function usePrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const predict = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const response = await createPrediction(payload)
      return response
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to get prediction. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { predict, loading, error, clearError }
}

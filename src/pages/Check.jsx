import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import StepIndicator from '../components/forms/StepIndicator'
import FormField from '../components/forms/FormField'
import ToggleButton from '../components/forms/ToggleButton'
import SelectField from '../components/forms/SelectField'
import { usePrediction } from '../hooks/usePrediction'

const predictionSchema = z.object({
  name: z.string().max(80, 'Name must be at most 80 characters').optional(),
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required',
  }),
  age: z.coerce
    .number({ invalid_type_error: 'Age is required' })
    .min(0, 'Age must be at least 0')
    .max(120, 'Age must be at most 120'),
  ever_married: z.enum(['Yes', 'No'], {
    required_error: 'This field is required',
  }),
  work_type: z.enum(
    ['children', 'Govt_job', 'Never_worked', 'Private', 'Self-employed'],
    { required_error: 'Work type is required' },
  ),
  residence_type: z.enum(['Urban', 'Rural'], {
    required_error: 'Residence type is required',
  }),
  smoking_status: z.enum(
    ['formerly smoked', 'never smoked', 'smokes', 'Unknown'],
    { required_error: 'Smoking status is required' },
  ),
  hypertension: z.union([z.literal(0), z.literal(1)]),
  heart_disease: z.union([z.literal(0), z.literal(1)]),
  avg_glucose_level: z.coerce
    .number({ invalid_type_error: 'Glucose level is required' })
    .min(0, 'Must be at least 0')
    .max(400, 'Must be at most 400'),
  bmi: z.coerce
    .number({ invalid_type_error: 'BMI is required' })
    .min(5, 'BMI must be at least 5')
    .max(100, 'BMI must be at most 100'),
})

const WORK_OPTIONS = [
  { value: 'children', label: 'Children' },
  { value: 'Govt_job', label: 'Government Job' },
  { value: 'Never_worked', label: 'Never Worked' },
  { value: 'Private', label: 'Private' },
  { value: 'Self-employed', label: 'Self-employed' },
]

const SMOKING_OPTIONS = [
  { value: 'formerly smoked', label: 'Formerly Smoked' },
  { value: 'never smoked', label: 'Never Smoked' },
  { value: 'smokes', label: 'Currently Smokes' },
  { value: 'Unknown', label: 'Unknown' },
]

const STEP_FIELDS = {
  1: ['name', 'age', 'gender', 'ever_married'],
  2: ['work_type', 'residence_type', 'smoking_status'],
  3: ['hypertension', 'heart_disease', 'avg_glucose_level', 'bmi'],
}

const defaultValues = {
  name: '',
  gender: 'Male',
  age: '',
  ever_married: 'Yes',
  work_type: 'Private',
  residence_type: 'Urban',
  smoking_status: 'never smoked',
  hypertension: 0,
  heart_disease: 0,
  avg_glucose_level: '',
  bmi: '',
}

export default function Check() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { predict, loading, error, clearError } = usePrediction()

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(predictionSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const goNext = async () => {
    clearError()
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((s) => Math.min(s + 1, 3))
  }

  const goBack = () => {
    clearError()
    setStep((s) => Math.max(s - 1, 1))
  }

  const onSubmit = async (data) => {
    clearError()
    const payload = { ...data }
    if (!payload.name?.trim()) {
      delete payload.name
    } else {
      payload.name = payload.name.trim()
    }

    try {
      const response = await predict(payload)
      if (response?.success && response?.data) {
        sessionStorage.setItem('lastPrediction', JSON.stringify(response.data))
        navigate('/result')
      }
    } catch {
      // error handled in hook
    }
  }

  return (
    <PageWrapper className="max-w-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          Stroke Risk Check
        </h1>
        <p className="mt-2 text-sm text-muted">
          Complete all steps for an accurate assessment
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 1 && (
            <div className="space-y-5">
              <Input
                label="Name (optional)"
                placeholder="Your name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Age"
                type="number"
                min={0}
                max={120}
                placeholder="e.g. 45"
                error={errors.age?.message}
                {...register('age')}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormField label="Gender" error={errors.gender?.message}>
                    <ToggleButton
                      name="gender"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                      ]}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="ever_married"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Ever Married"
                    error={errors.ever_married?.message}
                  >
                    <ToggleButton
                      name="ever_married"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                    />
                  </FormField>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Controller
                name="work_type"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Work Type"
                    options={WORK_OPTIONS}
                    error={errors.work_type?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="residence_type"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Residence Type"
                    error={errors.residence_type?.message}
                  >
                    <ToggleButton
                      name="residence_type"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'Urban', label: 'Urban' },
                        { value: 'Rural', label: 'Rural' },
                      ]}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="smoking_status"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Smoking Status"
                    options={SMOKING_OPTIONS}
                    error={errors.smoking_status?.message}
                    {...field}
                  />
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <Controller
                name="hypertension"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Hypertension"
                    error={errors.hypertension?.message}
                  >
                    <ToggleButton
                      name="hypertension"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 0, label: 'No' },
                        { value: 1, label: 'Yes' },
                      ]}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="heart_disease"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Heart Disease"
                    error={errors.heart_disease?.message}
                  >
                    <ToggleButton
                      name="heart_disease"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 0, label: 'No' },
                        { value: 1, label: 'Yes' },
                      ]}
                    />
                  </FormField>
                )}
              />
              <Input
                label="Average Glucose Level"
                type="number"
                min={0}
                max={400}
                unit="mg/dL"
                placeholder="e.g. 95"
                error={errors.avg_glucose_level?.message}
                {...register('avg_glucose_level')}
              />
              <Input
                label="BMI"
                type="number"
                min={5}
                max={100}
                step="0.1"
                placeholder="e.g. 24.5"
                error={errors.bmi?.message}
                {...register('bmi')}
              />
            </div>
          )}

          {error && (
            <p
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={goBack}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={goNext} className="flex-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Spinner />
                    Analyzing…
                  </>
                ) : (
                  'Get My Risk Score'
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </PageWrapper>
  )
}

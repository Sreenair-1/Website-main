'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { diagnosticQuestions, diagnosticCategories, calculateScore, getScoreCategoryLabel } from '@/lib/diagnostics'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import Link from 'next/link'

export default function DiagnosticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const question = diagnosticQuestions[currentQuestion]
  const progress = ((Object.keys(answers).length) / diagnosticQuestions.length) * 100

  const handleAnswer = (value: number) => {
    setAnswers({
      ...answers,
      [question.id]: value,
    })

    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmit = async () => {
    const scoreResult = calculateScore(answers)
    setResult(scoreResult)

    setSaving(true)
    try {
      const categoryDimensions: Record<string, number> = {}
      Object.entries(scoreResult.byCategory).forEach(([cat, score]) => {
        categoryDimensions[cat] = score as number
      })

      await addDoc(collection(db, 'diagnostic_results'), {
        user_id: user.uid,
        title: `Transformation Readiness Assessment - ${new Date().toLocaleDateString()}`,
        score: scoreResult.overall,
        category: 'Transformation Readiness',
        dimensions: categoryDimensions,
        recommendations: scoreResult.recommendations,
        createdAt: serverTimestamp(),
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Failed to save result:', err)
      setSubmitted(true) // still show results even if save fails
    } finally {
      setSaving(false)
    }
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8 md:p-12">
              <h1 className="text-4xl font-bold mb-2">Your Assessment Results</h1>
              <p className="text-muted-foreground mb-8">
                Based on your responses, here&apos;s your transformation readiness profile
              </p>

              {/* Overall Score */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 mb-8 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Overall Readiness Score</h2>
                  <div className="text-5xl font-bold text-primary">{result.overall}</div>
                </div>
                <div className="w-full bg-border rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.overall}%` }}
                  />
                </div>
                <p className="text-lg font-semibold">{getScoreCategoryLabel(result.overall)}</p>
              </div>

              {/* Category Breakdown */}
              <h3 className="text-2xl font-bold mb-6">Category Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {Object.entries(result.byCategory).map(([categoryKey, score]: [string, any]) => {
                  const category = diagnosticCategories[categoryKey]
                  return (
                    <div key={categoryKey} className="bg-secondary/5 rounded-lg p-6 border border-border">
                      <h4 className="font-bold mb-2">{category.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <div className="bg-border rounded-full h-2 mb-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-accent">{score}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex gap-3 bg-secondary/5 p-4 rounded-lg border border-border">
                        <div className="text-primary font-bold flex-shrink-0">✓</div>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors text-center"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setCurrentQuestion(0)
                    setAnswers({})
                    setResult(null)
                  }}
                  className="flex-1 border border-border text-foreground py-3 rounded-md font-medium hover:bg-secondary/5 transition-colors"
                >
                  Take Assessment Again
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/dashboard" className="text-primary hover:underline text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2">Transformation Readiness Assessment</h1>
            <p className="text-muted-foreground">
              Answer questions about your organization to get a personalized assessment
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Question {currentQuestion + 1} of {diagnosticQuestions.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-card rounded-lg border border-border p-8 mb-8">
            <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                {diagnosticCategories[question.category].name}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[question.id] === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 border border-border text-foreground py-2 rounded-md font-medium hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {currentQuestion === diagnosticQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(diagnosticQuestions.length - 1, currentQuestion + 1))}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

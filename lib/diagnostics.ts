export interface DiagnosticQuestion {
  id: string
  category: string
  question: string
  options: Array<{ value: number; label: string }>
  weight: number
}

export interface DiagnosticCategory {
  name: string
  description: string
  weight: number
}

export const diagnosticCategories: Record<string, DiagnosticCategory> = {
  strategy: {
    name: 'Strategic Alignment',
    description: 'Alignment between business goals and design thinking initiatives',
    weight: 0.25,
  },
  culture: {
    name: 'Organizational Culture',
    description: 'Readiness for innovation and change management',
    weight: 0.25,
  },
  capability: {
    name: 'Team Capability',
    description: 'Skills, tools, and expertise available within your organization',
    weight: 0.25,
  },
  execution: {
    name: 'Execution Maturity',
    description: 'Track record of project delivery and process improvement',
    weight: 0.25,
  },
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // Strategy Category
  {
    id: 'q1',
    category: 'strategy',
    question: 'How clearly defined is your organization\'s innovation strategy?',
    options: [
      { value: 0, label: 'No formal strategy exists' },
      { value: 25, label: 'Vague or informal strategy' },
      { value: 50, label: 'Strategy exists but inconsistently communicated' },
      { value: 75, label: 'Clear strategy, well communicated' },
      { value: 100, label: 'Clear strategy with measurable metrics' },
    ],
    weight: 1,
  },
  {
    id: 'q2',
    category: 'strategy',
    question: 'To what extent are customer insights integrated into decision-making?',
    options: [
      { value: 0, label: 'Not considered' },
      { value: 25, label: 'Minimal consideration' },
      { value: 50, label: 'Partial integration' },
      { value: 75, label: 'Well integrated' },
      { value: 100, label: 'Central to all decisions' },
    ],
    weight: 1,
  },
  {
    id: 'q3',
    category: 'strategy',
    question: 'How aligned are different departments around innovation goals?',
    options: [
      { value: 0, label: 'Significant misalignment' },
      { value: 25, label: 'Mostly misaligned' },
      { value: 50, label: 'Partially aligned' },
      { value: 75, label: 'Well aligned' },
      { value: 100, label: 'Fully aligned with shared KPIs' },
    ],
    weight: 1,
  },

  // Culture Category
  {
    id: 'q4',
    category: 'culture',
    question: 'How is failure perceived and handled in your organization?',
    options: [
      { value: 0, label: 'Severely punished' },
      { value: 25, label: 'Discouraged, minimal tolerance' },
      { value: 50, label: 'Tolerated when learning occurs' },
      { value: 75, label: 'Seen as learning opportunity' },
      { value: 100, label: 'Embraced as essential to innovation' },
    ],
    weight: 1,
  },
  {
    id: 'q5',
    category: 'culture',
    question: 'What level of cross-functional collaboration exists?',
    options: [
      { value: 0, label: 'Siloed departments' },
      { value: 25, label: 'Minimal collaboration' },
      { value: 50, label: 'Some cross-functional projects' },
      { value: 75, label: 'Regular collaboration' },
      { value: 100, label: 'Deeply embedded in culture' },
    ],
    weight: 1,
  },
  {
    id: 'q6',
    category: 'culture',
    question: 'How receptive is leadership to new ideas and approaches?',
    options: [
      { value: 0, label: 'Not receptive' },
      { value: 25, label: 'Rarely receptive' },
      { value: 50, label: 'Sometimes open' },
      { value: 75, label: 'Generally receptive' },
      { value: 100, label: 'Actively encourages innovation' },
    ],
    weight: 1,
  },

  // Capability Category
  {
    id: 'q7',
    category: 'capability',
    question: 'Does your team have design thinking experience?',
    options: [
      { value: 0, label: 'No experience' },
      { value: 25, label: 'Minimal exposure' },
      { value: 50, label: 'Some trained practitioners' },
      { value: 75, label: 'Several experienced practitioners' },
      { value: 100, label: 'Extensive expertise throughout' },
    ],
    weight: 1,
  },
  {
    id: 'q8',
    category: 'capability',
    question: 'What tools and technology infrastructure supports collaboration?',
    options: [
      { value: 0, label: 'No dedicated tools' },
      { value: 25, label: 'Basic communication tools' },
      { value: 50, label: 'Some collaborative platforms' },
      { value: 75, label: 'Modern integrated tools' },
      { value: 100, label: 'Best-in-class integrated ecosystem' },
    ],
    weight: 1,
  },
  {
    id: 'q9',
    category: 'capability',
    question: 'How well is your team skilled in data analysis and user research?',
    options: [
      { value: 0, label: 'No capability' },
      { value: 25, label: 'Minimal capability' },
      { value: 50, label: 'Basic capability' },
      { value: 75, label: 'Strong capability' },
      { value: 100, label: 'Excellent, dedicated teams' },
    ],
    weight: 1,
  },

  // Execution Category
  {
    id: 'q10',
    category: 'execution',
    question: 'What is your track record for on-time project delivery?',
    options: [
      { value: 0, label: 'Consistently late' },
      { value: 25, label: 'Frequently late' },
      { value: 50, label: 'On time 50% of time' },
      { value: 75, label: 'Usually on time' },
      { value: 100, label: 'Consistently delivered on time' },
    ],
    weight: 1,
  },
  {
    id: 'q11',
    category: 'execution',
    question: 'How effective is your process improvement methodology?',
    options: [
      { value: 0, label: 'No formal process' },
      { value: 25, label: 'Ad-hoc improvements' },
      { value: 50, label: 'Basic process framework' },
      { value: 75, label: 'Structured continuous improvement' },
      { value: 100, label: 'Mature, data-driven optimization' },
    ],
    weight: 1,
  },
  {
    id: 'q12',
    category: 'execution',
    question: 'How well do you measure and track outcomes of initiatives?',
    options: [
      { value: 0, label: 'No measurement' },
      { value: 25, label: 'Minimal metrics' },
      { value: 50, label: 'Some key metrics tracked' },
      { value: 75, label: 'Comprehensive dashboard' },
      { value: 100, label: 'Advanced analytics with AI/ML' },
    ],
    weight: 1,
  },
]

export function calculateScore(answers: Record<string, number>): {
  overall: number
  byCategory: Record<string, number>
  recommendations: string[]
} {
  const categoryScores: Record<string, number[]> = {
    strategy: [],
    culture: [],
    capability: [],
    execution: [],
  }

  // Collect scores by category
  diagnosticQuestions.forEach((q) => {
    const score = answers[q.id] || 0
    categoryScores[q.category].push(score)
  })

  // Calculate category averages
  const categoryAverages: Record<string, number> = {}
  Object.entries(categoryScores).forEach(([category, scores]) => {
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    categoryAverages[category] = Math.round(avg)
  })

  // Calculate overall score
  const overall = Math.round(
    Object.entries(categoryAverages).reduce((sum, [cat, score]) => {
      return sum + score * diagnosticCategories[cat].weight
    }, 0)
  )

  // Generate recommendations
  const recommendations: string[] = []

  if (categoryAverages.strategy < 60) {
    recommendations.push('Develop a clear innovation strategy aligned with business goals')
  }
  if (categoryAverages.culture < 60) {
    recommendations.push('Foster a culture of experimentation and psychological safety')
  }
  if (categoryAverages.capability < 60) {
    recommendations.push('Invest in design thinking training and modern collaboration tools')
  }
  if (categoryAverages.execution < 60) {
    recommendations.push('Establish robust process frameworks and measurement systems')
  }

  if (overall < 50) {
    recommendations.push('Consider a comprehensive organizational transformation program')
  }

  return {
    overall,
    byCategory: categoryAverages,
    recommendations,
  }
}

export function getScoreCategoryLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  if (score >= 20) return 'Needs Improvement'
  return 'Critical'
}

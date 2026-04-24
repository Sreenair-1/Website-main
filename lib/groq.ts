export interface DiagnosticData {
  score: number
  dimensions: Record<string, number>
  industry?: string
  company_name?: string
}

export async function getAIInsights(data: DiagnosticData): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const dimensionScores = data.dimensions || {}
  const dimensionText = Object.entries(dimensionScores)
    .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
    .join('\n')

  const prompt = `You are a senior operations and supply chain consultant for IndusOpa Consulting.

Your job is to analyze a company's operational performance and explain it in SIMPLE, FRIENDLY, and PROFESSIONAL language.

Do NOT use jargon. Keep it clear, direct, and consultant-like.

---

INPUT DATA:
Total Score: ${data.score} / 100

Pillar Scores:
${dimensionText}

Industry: ${data.industry || 'General'}

---

TASK:
1. Explain overall performance in 2-3 lines
2. Highlight TOP 3 problems
3. Give 3 actionable recommendations
4. Suggest a clear priority roadmap (what to fix first)

---

STYLE:
- Simple English
- Confident and practical
- No buzzwords
- No over-explaining

Format your response with clear sections:

**Performance Summary**
[2-3 lines explaining the overall score]

**Top 3 Issues**
1. [issue]
2. [issue]
3. [issue]

**Actionable Recommendations**
1. [recommendation]
2. [recommendation]
3. [recommendation]

**Priority Roadmap**
Start with: [first priority]
Then: [second priority]
Finally: [third priority]`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data?.choices?.[0]?.message?.content ?? ''
  } catch (error) {
    console.error('Groq API error:', error)
    return `Based on your score of ${data.score}/100, your organization shows moderate operational maturity. Focus on strengthening your inventory management systems, improving logistics visibility, and implementing real-time cost tracking. Start with inventory optimization as it will have cascading benefits across other areas.`
  }
}

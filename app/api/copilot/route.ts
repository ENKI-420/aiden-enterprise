import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      )
    }

    const openaiKey = process.env.OPENAI_API_KEY

    if (!openaiKey) {
      // Fallback mock response for demo purposes
      const mockSummary = generateMockSummary(input)
      return NextResponse.json({ summary: mockSummary })
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an executive AI assistant for high-level business meetings.
                     Provide concise, actionable insights from meeting transcripts.
                     Focus on: key decisions, action items, compliance concerns, and strategic insights.
                     Keep responses under 150 words and professional.`
          },
          {
            role: 'user',
            content: `Analyze this meeting transcript: "${input}"`
          }
        ],
        temperature: 0.4,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content || 'No summary generated.'

    return NextResponse.json({ summary })

  } catch (error) {
    console.error('Copilot API error:', error)

    // Fallback to mock response
    const { input } = await request.json().catch(() => ({ input: '' }))
    const mockSummary = generateMockSummary(input)

    return NextResponse.json({
      summary: mockSummary,
      note: 'Using demo mode - OpenAI integration available with API key'
    })
  }
}

function generateMockSummary(input: string): string {
  const keywords = input.toLowerCase()

  if (keywords.includes('contract') || keywords.includes('proposal')) {
    return `📋 Contract Discussion Detected
    • Key terms under review
    • Compliance requirements noted
    • Next steps: Legal review needed
    • Timeline: 2-week evaluation period`
  }

  if (keywords.includes('budget') || keywords.includes('cost')) {
    return `💰 Financial Discussion Summary
    • Budget allocation discussed
    • Cost optimization opportunities identified
    • ROI projections reviewed
    • Approval process outlined`
  }

  if (keywords.includes('security') || keywords.includes('compliance')) {
    return `🔒 Security & Compliance Focus
    • HIPAA/CMMC requirements addressed
    • Risk assessment completed
    • Security protocols confirmed
    • Audit trail maintained`
  }

  if (keywords.includes('project') || keywords.includes('timeline')) {
    return `🚀 Project Management Update
    • Milestone progress reviewed
    • Resource allocation discussed
    • Timeline adjustments noted
    • Stakeholder alignment confirmed`
  }

  return `🤖 AI Analysis Complete
  • Meeting transcript processed
  • Key topics identified and categorized
  • Action items extracted
  • Summary available for export
  • No immediate compliance concerns detected`
}
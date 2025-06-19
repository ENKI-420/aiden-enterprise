import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { input, model, type } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    if (type === 'image') {
      // DALL-E image generation
      const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ prompt: input, n: 1, size: '512x512' }),
      });
      const dalleData = await dalleRes.json();
      return NextResponse.json({ image: dalleData.data?.[0]?.url });
    } else {
      // Text generation (GPT-4o, GPT-3.5, etc.)
      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-4o',
          messages: [{ role: 'user', content: input }],
        }),
      });
      const chatData = await chatRes.json();
      return NextResponse.json({ text: chatData.choices?.[0]?.message?.content });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'AI API error', details: error.message },
      { status: 500 }
    );
  }
}
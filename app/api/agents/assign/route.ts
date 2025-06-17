import { NextResponse } from 'next/server';

interface Agent {
  id: string;
  // add other properties if needed
}

export async function POST(request: Request) {
  const { agents, tasks } = await request.json();
  // Stub: assign tasks to agents round-robin
  const assignments = (agents as Agent[]).map((agent: Agent, idx: number) => ({
    agentId: agent.id,
    task: tasks[idx % tasks.length],
  }));
  return NextResponse.json({ assignments });
}

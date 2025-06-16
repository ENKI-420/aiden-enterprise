import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { agents, tasks } = await request.json();
  // Stub: assign tasks to agents round-robin
  const assignments = agents.map((agent: any, idx: number) => ({
    agentId: agent.id,
    task: tasks[idx % tasks.length],
  }));
  return NextResponse.json({ assignments });
}

import { NextResponse } from 'next/server';

// Agent synthesis: create AI agents based on user request
export async function POST(request: Request) {
  // Parse demoType from client and synthesize agents accordingly
  const { demoType } = await request.json();
  let agents;
  switch (demoType) {
    case 'beam':
      agents = [
        { id: 'agent-1', role: 'Energy Physicist' },
        { id: 'agent-2', role: 'Systems Engineer' },
      ];
      break;
    default:
      agents = [
        { id: 'agent-1', role: 'Researcher' },
        { id: 'agent-2', role: 'Analyst' },
      ];
  }
  return NextResponse.json({ agents });
}

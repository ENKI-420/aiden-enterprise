let agents = [
  { id: 1, name: "PriorAuthAgent", role: "Prior Authorization", status: "Active" },
  { id: 2, name: "SummarizerAgent", role: "Summarization", status: "Active" },
  { id: 3, name: "ComplianceAgent", role: "Compliance", status: "Active" },
];

export async function GET() {
  return Response.json(agents);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newAgent = { ...data, id: Date.now() };
  agents.push(newAgent);
  return Response.json(newAgent);
}

export async function PUT(request: Request) {
  const data = await request.json();
  agents = agents.map(a => (a.id === data.id ? data : a));
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  agents = agents.filter(a => a.id !== data.id);
  return Response.json({ success: true });
}
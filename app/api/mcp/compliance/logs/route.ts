let logs = [];

export async function GET() {
  return Response.json(logs);
}

export async function POST(request: Request) {
  const data = await request.json();
  const log = { ...data, id: Date.now(), timestamp: new Date().toISOString() };
  logs.push(log);
  return Response.json(log);
}
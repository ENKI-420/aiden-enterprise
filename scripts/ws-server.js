// To run: npm install ws && node scripts/ws-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', ws => {
  ws.send('Connected to live data feed.');
});

setInterval(() => {
  const msg = JSON.stringify({
    timestamp: new Date().toISOString(),
    value: (Math.random() * 100).toFixed(2),
    metric: 'DemoMetric',
  });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}, 2000);

console.log('WebSocket server running on ws://localhost:4000');
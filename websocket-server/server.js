const WebSocket = require('ws');
const cors = require('cors');
const http = require('http');

// Create HTTP server for WebSocket upgrade
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Simulated transaction data
const generateTransaction = () => {
  const amounts = [250, 1500, 8500, 3200, 12000, 450, 6800, 9200];
  const merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'eBay', 'Steam', 'Netflix'];
  const locations = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Toronto'];
  
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  const riskScore = Math.random();
  let riskLevel = 'LOW';
  
  if (amount > 5000 || riskScore > 0.7) {
    riskLevel = 'HIGH';
  } else if (amount > 2000 || riskScore > 0.4) {
    riskLevel = 'MEDIUM';
  }
  
  return {
    id: Date.now() + Math.random(),
    amount: amount,
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    time: new Date().toLocaleTimeString(),
    riskScore: Math.round(riskScore * 100),
    riskLevel: riskLevel,
    status: 'PENDING'
  };
};

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);
  
  // Send initial transactions
  const initialTransactions = Array.from({ length: 5 }, generateTransaction);
  ws.send(JSON.stringify({
    type: 'initial',
    data: initialTransactions
  }));
  
  // Send periodic transactions
  const interval = setInterval(() => {
    const transaction = generateTransaction();
    
    // Broadcast to all connected clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'transaction',
          data: transaction
        }));
      }
    });
  }, 3000); // New transaction every 3 seconds
  
  // Handle client messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'analyze') {
      // Simulate analysis and update transaction status
      const updatedTransaction = {
        ...data.transaction,
        status: 'ANALYZED',
        analyzedAt: new Date().toLocaleTimeString()
      };
      
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'update',
            data: updatedTransaction
          }));
        }
      });
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
    clearInterval(interval);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📡 Connect your client to ws://localhost:${PORT}`);
});

// Enable CORS for WebSocket connections
server.on('upgrade', (request, socket, head) => {
  // Handle CORS preflight
  if (request.headers.origin) {
    // Allow any origin for development
    console.log(`WebSocket connection from origin: ${request.headers.origin}`);
  }
});

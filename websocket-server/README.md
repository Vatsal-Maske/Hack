# Real-Time Fraud Detection WebSocket Server

## Features
- Real-time transaction streaming
- WebSocket communication
- Simulated fraud detection
- Live risk analysis
- CORS enabled

## Setup

### 1. Install Dependencies
```bash
cd websocket-server
npm install
```

### 2. Start Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 3. Verify Server
Server will start on `ws://localhost:5000`

## API Messages

### Server → Client
- `initial`: Array of initial transactions
- `transaction`: New transaction data
- `update`: Updated transaction after analysis

### Client → Server
- `analyze`: Request analysis of specific transaction

## Transaction Data Structure
```json
{
  "id": "unique_id",
  "amount": 1500,
  "merchant": "Amazon",
  "location": "New York",
  "time": "14:35:22",
  "riskScore": 75,
  "riskLevel": "HIGH|MEDIUM|LOW",
  "status": "PENDING|ANALYZED|BLOCKED"
}
```

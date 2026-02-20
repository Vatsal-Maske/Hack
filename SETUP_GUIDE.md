# Real-Time Fraud Detection Dashboard - Complete Setup Guide

## 🚀 Project Overview
A real-time fraud detection system with WebSocket communication between Node.js backend and Next.js frontend.

## 📁 Project Structure
```
Hack/
├── websocket-server/          # Node.js WebSocket backend
│   ├── package.json
│   ├── server.js
│   └── README.md
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   └── fraud-dashboard/   # New dashboard page
│   └── components/
│       └── Navbar.tsx        # Updated with new link
└── SETUP_GUIDE.md            # This file
```

## 🛠️ Setup Instructions

### Step 1: Start the WebSocket Server

1. **Navigate to server directory:**
   ```bash
   cd websocket-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   # For development (auto-restart on changes)
   npm run dev
   
   # For production
   npm start
   ```

4. **Verify server is running:**
   - You should see: `🚀 WebSocket server running on port 5000`
   - Server will be available at: `ws://localhost:5000`

### Step 2: Start the Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Fraud Dashboard: `http://localhost:3000/fraud-dashboard`

### Step 3: Test the System

1. **Open the fraud dashboard** in your browser
2. **Check connection status** - should show "Connected to WebSocket"
3. **Wait for transactions** - they appear every 3 seconds
4. **Test analysis** - click "Analyze" on pending transactions
5. **Monitor risk levels** - high-risk transactions are highlighted in red

## 🎯 Features Demonstrated

### Backend Features:
- ✅ WebSocket server on port 5000
- ✅ Real-time transaction generation
- ✅ Risk scoring algorithm
- ✅ Transaction status updates
- ✅ Client connection management
- ✅ CORS support

### Frontend Features:
- ✅ Real-time WebSocket connection
- ✅ Live transaction updates
- ✅ Risk level visualization
- ✅ Transaction analysis
- ✅ Status tracking
- ✅ Dark theme UI
- ✅ Responsive design
- ✅ Auto-reconnection

### Transaction Features:
- ✅ Amount, merchant, location data
- ✅ Risk score (0-100%)
- ✅ Risk levels (LOW/MEDIUM/HIGH)
- ✅ Status tracking (PENDING/ANALYZED/BLOCKED)
- ✅ Visual risk indicators
- ✅ Color-coded highlighting

## 🔧 Technical Details

### WebSocket Messages:

**Server → Client:**
```json
{
  "type": "initial",
  "data": [transaction1, transaction2, ...]
}
```

```json
{
  "type": "transaction", 
  "data": transaction
}
```

```json
{
  "type": "update",
  "data": updatedTransaction
}
```

**Client → Server:**
```json
{
  "type": "analyze",
  "transaction": transaction
}
```

### Transaction Data Structure:
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

## 🎨 UI Features

### Visual Indicators:
- **Red highlighting** for HIGH risk transactions
- **Risk score bars** with color coding
- **Status badges** for transaction states
- **Connection status** indicator
- **Live statistics** cards

### Interactive Elements:
- **Analyze button** for pending transactions
- **Block button** for analyzed transactions
- **Reconnect button** for WebSocket issues
- **Auto-refresh** transaction list

## 🔍 Troubleshooting

### Common Issues:

**1. WebSocket Connection Failed:**
- Ensure server is running on port 5000
- Check for firewall blocking the connection
- Try refreshing the page

**2. No Transactions Appearing:**
- Verify server is running and connected
- Check browser console for errors
- Ensure WebSocket server is sending messages

**3. High CPU Usage:**
- Reduce transaction frequency in server.js
- Implement connection limiting
- Add rate limiting

**4. Frontend Build Errors:**
- Ensure all dependencies are installed
- Check for TypeScript errors
- Verify import paths

### Debug Mode:
- Open browser developer tools
- Check Console tab for WebSocket messages
- Monitor Network tab for WebSocket connection
- Check server console for client connections

## 🚀 Next Steps

### Potential Enhancements:
1. **Database Integration** - Store transactions permanently
2. **Machine Learning** - Real fraud detection algorithms
3. **User Authentication** - Multi-user support
4. **Alert System** - Email/SMS notifications
5. **Advanced Analytics** - Charts and graphs
6. **Mobile App** - React Native implementation
7. **API Integration** - Connect to real payment systems

### Performance Optimizations:
1. **Connection Pooling** - Handle multiple clients
2. **Message Queuing** - Reliable message delivery
3. **Data Compression** - Reduce bandwidth usage
4. **Caching** - Improve response times
5. **Load Balancing** - Scale horizontally

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review browser console errors
3. Verify server logs
4. Test with different browsers
5. Check network connectivity

---

**🎉 Your real-time fraud detection dashboard is now ready!**

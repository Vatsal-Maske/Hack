"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  time: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'ANALYZED' | 'BLOCKED';
  analyzedAt?: string;
}

export default function FraudDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const connectWebSocket = () => {
      try {
        // Check if server is accessible first
        const wsUrl = process.env.NODE_ENV === 'production' 
          ? 'wss://your-production-url.com' 
          : 'ws://localhost:5000';
        
        console.log('Attempting to connect to:', wsUrl);
        ws.current = new WebSocket(wsUrl);
        
        ws.current.onopen = () => {
          console.log('✅ Connected to WebSocket server');
          setIsConnected(true);
        };
        
        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case 'initial':
                console.log('📥 Received initial transactions:', message.data.length);
                setTransactions(message.data);
                break;
              case 'transaction':
                console.log('📥 New transaction received:', message.data);
                setTransactions(prev => [message.data, ...prev].slice(0, 20)); // Keep latest 20
                break;
              case 'update':
                console.log('🔄 Transaction updated:', message.data);
                setTransactions(prev => 
                  prev.map(tx => tx.id === message.data.id ? message.data : tx)
                );
                break;
            }
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
          }
        };
        
        ws.current.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          setIsConnected(false);
          
          // Don't reconnect if it was a normal closure
          if (event.code === 1000) {
            console.log('📡 Normal closure, not reconnecting');
            return;
          }
          
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connectWebSocket();
          }, 3000);
        };
        
        ws.current.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          setIsConnected(false);
          
          // Close the connection to trigger reconnect
          if (ws.current) {
            ws.current.close();
          }
        };
      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        setIsConnected(false);
        
        // Retry connection after 5 seconds
        setTimeout(() => {
          console.log('🔄 Retrying connection...');
          connectWebSocket();
        }, 5000);
      }
    };
    
    // Start connection
    connectWebSocket();
    
    return () => {
      if (ws.current) {
        console.log('🧹 Cleaning up WebSocket connection');
        ws.current.close(1000, 'Component unmounted');
      }
    };
  }, []);

  const handleAnalyze = (transaction: Transaction) => {
    if (!isConnected || !ws.current) return;
    
    setIsAnalyzing(true);
    
    // Send analysis request
    ws.current.send(JSON.stringify({
      type: 'analyze',
      transaction: transaction
    }));
    
    setTimeout(() => setIsAnalyzing(false), 1000);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BLOCKED': return 'text-red-400';
      case 'ANALYZED': return 'text-green-400';
      case 'PENDING': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Real-Time Fraud Detection</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected to WebSocket' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reconnect
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">{transactions.length}</div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-red-400">
              {transactions.filter(tx => tx.riskLevel === 'HIGH').length}
            </div>
            <div className="text-sm text-gray-400">High Risk</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400">
              {transactions.filter(tx => tx.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-400">Pending Analysis</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-green-400">
              {transactions.filter(tx => tx.status === 'ANALYZED').length}
            </div>
            <div className="text-sm text-gray-400">Analyzed</div>
          </div>
        </div>

        {/* Transactions Panel */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Live Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Risk Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Risk Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Waiting for transactions...
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className={`hover:bg-gray-700/50 transition-colors ${
                        transaction.riskLevel === 'HIGH' ? 'bg-red-900/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">{transaction.time}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{transaction.merchant}</td>
                      <td className="px-4 py-3 text-sm">{transaction.location}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(transaction.riskLevel)}`}>
                          {transaction.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                transaction.riskScore > 70 ? 'bg-red-500' :
                                transaction.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${transaction.riskScore}%` }}
                            />
                          </div>
                          <span className="text-xs">{transaction.riskScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {transaction.status === 'PENDING' && (
                          <button
                            onClick={() => handleAnalyze(transaction)}
                            disabled={!isConnected || isAnalyzing}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                          >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                          </button>
                        )}
                        {transaction.status === 'ANALYZED' && (
                          <button
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-3">How to Use</h3>
          <ol className="space-y-2 text-sm text-gray-400">
            <li>1. Make sure the WebSocket server is running on port 5000</li>
            <li>2. Transactions will appear automatically every 3 seconds</li>
            <li>3. High-risk transactions are highlighted in red</li>
            <li>4. Click "Analyze" to process pending transactions</li>
            <li>5. Monitor risk scores and status updates in real-time</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

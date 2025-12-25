'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:8000/api';

interface WalletInfo {
  address: string;
  role: string | null;
  authenticated: boolean;
}

interface BlockchainInfo {
  chain_length: number;
  pending_transactions: number;
  is_valid: boolean;
}

export default function Home() {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    role: null,
    authenticated: false
  });
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Connect Wallet
  const connectWallet = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Check if MetaMask is installed
      if (!window.ethereum) {
        setMessage('⚠️ Please install MetaMask to use this application');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const address = accounts[0];

      // Create signature for authentication
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const authMessage = `Sign this message to authenticate with Web3 Accounting System\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(authMessage);

      // Verify signature with backend
      const response = await axios.post(`${API_URL}/auth/verify`, {
        wallet_address: address,
        signature: signature,
        message: authMessage
      });

      if (response.data.success) {
        setWallet({
          address: address,
          role: response.data.role,
          authenticated: true
        });
        setMessage(`✅ Connected successfully! Role: ${response.data.role || 'None assigned'}`);

        // Load blockchain info
        loadBlockchainInfo();
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      setMessage(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWallet({
      address: '',
      role: null,
      authenticated: false
    });
    setMessage('Disconnected from wallet');
  };

  // Load Blockchain Info
  const loadBlockchainInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/blockchain/info`);
      setBlockchainInfo(response.data);
    } catch (error) {
      console.error('Error loading blockchain info:', error);
    }
  };

  // Refresh blockchain info every 5 seconds if connected
  useEffect(() => {
    if (wallet.authenticated) {
      const interval = setInterval(loadBlockchainInfo, 5000);
      return () => clearInterval(interval);
    }
  }, [wallet.authenticated]);

  return (
    <div dir="ltr" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">
                Web3 Accounting & Audit System
              </h1>
              <p className="text-gray-600 mt-1">
                Decentralized Blockchain-Based Accounting
              </p>
            </div>
            <div>
              {!wallet.authenticated ? (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Connected as:</div>
                  <div className="font-mono text-sm text-indigo-600 mt-1">
                    {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                  </div>
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    Role: {wallet.role || 'Not Assigned'}
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-800' :
            message.includes('❌') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {message}
          </div>
        )}

        {/* Welcome Section */}
        {!wallet.authenticated ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Web3 Accounting System
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Web3 wallet (MetaMask) to access the decentralized accounting system.
              All transactions are blockchain-based, immutable, and cryptographically secured.
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                No traditional username/password
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Immutable blockchain records
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Complete audit trail
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multi-signature approvals
              </li>
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blockchain Status Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Blockchain Status
              </h3>
              {blockchainInfo ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chain Length:</span>
                    <span className="font-semibold text-indigo-600">
                      {blockchainInfo.chain_length} blocks
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending TX:</span>
                    <span className="font-semibold text-orange-600">
                      {blockchainInfo.pending_transactions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chain Valid:</span>
                    <span className={`font-semibold ${
                      blockchainInfo.is_valid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {blockchainInfo.is_valid ? '✓ Valid' : '✗ Invalid'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                  Create Transaction
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  View Transactions
                </button>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                  Audit Trail
                </button>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                User Information
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Wallet Address:</div>
                  <div className="font-mono text-xs text-indigo-600 mt-1 break-all">
                    {wallet.address}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Role:</div>
                  <div className="font-semibold text-green-600 mt-1">
                    {wallet.role || 'Not Assigned'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status:</div>
                  <div className="font-semibold text-green-600 mt-1">
                    ✓ Authenticated
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="font-bold text-gray-800 mb-2">Accounting</h4>
            <p className="text-sm text-gray-600">
              Blockchain-based journal entries with immutable records
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">👥</div>
            <h4 className="font-bold text-gray-800 mb-2">HR Management</h4>
            <p className="text-sm text-gray-600">
              Employee records and payroll on blockchain
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">💼</div>
            <h4 className="font-bold text-gray-800 mb-2">Sales</h4>
            <p className="text-sm text-gray-600">
              Invoice and order management with smart contracts
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-bold text-gray-800 mb-2">Audit</h4>
            <p className="text-sm text-gray-600">
              Complete audit trail with anomaly detection
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Built with ❤️ for the future of decentralized accounting</p>
          <p className="text-sm mt-2">
            Powered by Blockchain Technology | Web3 Authentication
          </p>
        </div>
      </footer>
    </div>
  );
}

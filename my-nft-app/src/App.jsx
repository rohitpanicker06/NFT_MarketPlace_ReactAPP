import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateNFT from './CreateNFT';
import MyNFTs from './MyNFTs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { ConnectWallet } from './ConnectWallet';
import './App.css';

const queryClient = new QueryClient()

function App() {
  return (
    <Router>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <ConnectWallet />
      <div className="App" style={{ textAlign: 'center' }}>
        <h1>NFT MarketPlace</h1>
        <Link to="/"><button>Home</button></Link>
        <Link to="/my-nfts"><button>View My NFTs</button></Link>
        <Routes>
          <Route path="/" element={<CreateNFT />} />
          <Route path="/my-nfts" element={<MyNFTs contractAddress="YOUR_CONTRACT_ADDRESS" />} />
        </Routes>
      </div>
      </QueryClientProvider> 
    </WagmiProvider>
    </Router>
  );

  
}

export default App;
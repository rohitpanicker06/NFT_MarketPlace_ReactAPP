import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateNFT from './CreateNFT';
import MyNFTs from './MyNFTs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ textAlign: 'center' }}>
        <h1>NFT MarketPlace</h1>
        <Link to="/"><button>Home</button></Link>
        <Link to="/my-nfts"><button>View My NFTs</button></Link>
        <Routes>
          <Route path="/" element={<CreateNFT />} />
          <Route path="/my-nfts" element={<MyNFTs contractAddress="YOUR_CONTRACT_ADDRESS" />} />
        </Routes>
      </div>
    </Router>
  );

  
}

export default App;
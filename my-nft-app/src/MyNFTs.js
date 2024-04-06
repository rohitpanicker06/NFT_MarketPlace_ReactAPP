// MyNFTs.js
import React, { useEffect, useState } from 'react';
import NFTMarketplaceABI from './NFTMarketPlaceABI.json';
const ethers = require("ethers");



function MyNFTs({ contractAddress }) {
  const [nfts, setNfts] = useState([]);

  const fetchMyNFTs = async () => {
    if (!window.ethereum) {
      console.log('Ethereum object not found, install MetaMask.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        NFTMarketplaceABI,
        signer
      );

      const listedTokens = await contract.getMyNFTs();
      const nftsWithURI = listedTokens.map(({ tokenId, owner }) => ({
        tokenId,
        owner
      }));

      setNfts(nftsWithURI);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    fetchMyNFTs();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>My NFTs</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {nfts.map(({ tokenId }, index) => (
          <div key={index} style={{ margin: '10px', width: '300px', textAlign: 'center' }}>
            <img src={tokenId} alt={`NFT ${index}`} style={{ width: '100%', marginBottom: '10px' }} />
            <p>Image URL: {tokenId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyNFTs;

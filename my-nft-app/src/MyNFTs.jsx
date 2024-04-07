// MyNFTs.js
import React, { useEffect, useState } from 'react';
import NFTMarketplaceABI from './NFTMarketPlaceABI.json';
import { useEthersSigner } from './getSigner'
import { ethers } from 'ethers';

const contractAddress = "0xdc205b043cc5aBc33e5d7B71f9f888b2F0a7A020"

function MyNFTs() {
  const [nfts, setNfts] = useState([]);

  const signer = useEthersSigner()

  const fetchMyNFTs = async () => {

    try {
      if (!signer) return
      const contract = new ethers.Contract(
        contractAddress,
        NFTMarketplaceABI,
        signer
      );

      const listedTokens = await contract.getMyNFTs();
      const nftsWithURI = listedTokens.map(({ tokenId, owner, tokenURI }) => ({
        tokenId,
        owner,
        tokenURI
      }));

      console.log(nftsWithURI)

      setNfts(nftsWithURI);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    fetchMyNFTs();
  }, []);

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

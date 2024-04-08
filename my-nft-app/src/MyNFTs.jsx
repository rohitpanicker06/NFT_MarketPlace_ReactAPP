// MyNFTs.js
import React, { useEffect, useState } from 'react';
import NFTMarketplaceABI from './NFTMarketPlaceABI.json';
import { useEthersSigner } from './getSigner'
import { ethers } from 'ethers';

const contractAddress = "0xdc008489057cec453d9bd9fe4d096a10caf43512"

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

      const nfts = await Promise.all(listedTokens.map(async i => {
        const imageURI = await contract.tokenURI(i.tokenId);
      
        let nft = {
          tokenId: i.tokenId,
          image: imageURI
        }
        return nft;
      }));
      // const nftsWithURI = listedTokens.map(({ tokenId, owner, tokenURI }) => ({
      //   tokenId,
      //   owner,
      //   tokenURI
      // }));

      console.log(nfts)

      setNfts(nfts);
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
        {nfts.map(({ tokenId, image }, index) => (
          <div key={index} style={{ margin: '10px', width: '300px', textAlign: 'center' }}>
            <img src={image} alt={`NFT ${index}`} style={{ width: '100%', marginBottom: '10px' }} />
            <p>Image URL: {image}</p> {/* Display the correct image URL */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyNFTs;

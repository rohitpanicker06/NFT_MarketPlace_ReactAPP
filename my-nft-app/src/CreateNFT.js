import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import NFTMarketplaceABI from './NFTMarketPlaceABI.json';
import { useEthersSigner } from './getSigner';
import { ethers } from 'ethers';

function CreateNFT() {

    const [file, setFile] = useState(null);
    const [ipfsUrl, setIpfsUrl] = useState('');
    const [nftImage, setNftImage] = useState(''); 

    const signer = useEthersSigner()
  
    const mintNFT = async (tokenURI) => {
      try {        
        if (!signer) return
        const contract = new ethers.Contract(
          '0xdc205b043cc5aBc33e5d7B71f9f888b2F0a7A020', 
          NFTMarketplaceABI,
          signer
        );
  
        const transaction = await contract.createToken(tokenURI);
        await transaction.wait();
  
        console.log(`NFT Created with tokenURI: ${tokenURI}`);
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    };
  
  
    const handleCreateNFT = async (e) => {
      e.preventDefault();
  
      let ipfsHash = '';
  
      if (file) {
    
        try {
          const fileData = new FormData();
          fileData.append("file", file);
  
          const responseData = await axios({
            method: "POST",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: fileData,
            headers: {
              pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
              pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            },
          });
  
          ipfsHash = responseData.data.IpfsHash;
          const fileUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
          setNftImage(fileUrl);
        } catch (err) {
          console.log(err);
          return;
        }
      } else if (ipfsUrl) {
        const urlParts = ipfsUrl.split('/');
        ipfsHash = urlParts[urlParts.length - 1];
        //not storing ipfsHAsh for now, its TODO
        setNftImage(ipfsUrl);
      } else {
        console.log("No file or IPFS URL provided");
        return;
      }
  
      console.log("IPFS Hash for NFT creation:", ipfsHash);
  
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  
       await mintNFT(tokenURI);
      
    };

    return (
        <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <div style={{ maxWidth: '300px', minHeight: '300px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Uploaded NFT:</h3>
            {nftImage ? (
              <img src={nftImage} alt="NFT Preview" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>No Image Uploaded</div>
            )}
          </div>
    
          <h1>NFT Image Uploader</h1>
          <div>
            <h2>Upload Image or Use an IPFS URL</h2>
            <form onSubmit={handleCreateNFT}>
              <input type="file" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFile(file);
                  setNftImage(URL.createObjectURL(file));
                }
              }} />
              <input type="text" placeholder="IPFS URL" value={ipfsUrl} onChange={(e) => setIpfsUrl(e.target.value)} />
              <br></br>
              <button type="submit">Create NFT</button>
            </form>
          </div>
        </div>
      );

}

export default CreateNFT;
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [nftImage, setNftImage] = useState(''); 

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append("file", file);

      console.log(process.env.REACT_APP_PINATA_API_KEY);
      console.log(process.env.REACT_APP_PINATA_SECRET_API_KEY);

      const responseData = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      console.log(responseData);

      const fileUrl = "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
      setNftImage(fileUrl); 
      console.log(fileUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUseIpfsUrl = (e) => {
    e.preventDefault();
    setNftImage(ipfsUrl); 
    console.log("IPFS URL Submitted:", ipfsUrl);
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
        <h2>Upload Image to IPFS</h2>
        <form onSubmit={handleSubmitFile}>
        <input type="file" onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    setFile(file);
    setNftImage(URL.createObjectURL(file));
  }
}} />
          <button type="submit">Upload to IPFS</button>
        </form>
      </div>
      <div>
        <h2>Or Use an IPFS URL</h2>
        <form onSubmit={handleUseIpfsUrl}>
          <input type="text" placeholder="IPFS URL" value={ipfsUrl} onChange={(e) => setIpfsUrl(e.target.value)} />
          <button type="submit">Use This IPFS URL</button>
        </form>
      </div>
    </div>
  );
}

export default App;
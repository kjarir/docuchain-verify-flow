/// <reference types="vite/client" />

import { ethers } from "ethers";
import { MEGAETH_NETWORK_CONFIG } from "@/contracts/contractInfo";
import DocumentVerifierABI from '@/contracts/DocumentVerifier.json';
import axios from 'axios';
import { sha256 } from 'js-sha256';

export const getContract = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  // Get provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Get signer
  const signer = provider.getSigner();
  
  // Create contract instance
  return new ethers.Contract(
    MEGAETH_NETWORK_CONFIG.contractAddress,
    DocumentVerifierABI.abi,
    signer
  );
};

export const verifyDocument = async (documentId: string) => {
  try {
    const contract = await getContract();
    
    // Clean up the document ID
    let cleanDocumentId = documentId.trim();
    if (!cleanDocumentId.startsWith('0x')) {
      cleanDocumentId = '0x' + cleanDocumentId;
    }
    
    const [hash, signature, title, issuer, timestamp, exists] = await contract.getDocument(cleanDocumentId);
    
    if (!exists) {
      return null;
    }

    return {
      hash,
      signature,
      title,
      issuer,
      timestamp: new Date(timestamp.toNumber() * 1000),
      exists
    };
  } catch (error) {
    console.error("Error verifying document:", error);
    throw error;
  }
};

// Helper function to calculate file hash
const calculateFileHash = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result;
        if (buffer) {
          const hash = '0x' + sha256(buffer);
          resolve(hash);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to upload to IPFS via Pinata
const uploadToIPFS = async (file: File, metadata: any) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add metadata
  const metadataJson = JSON.stringify({
    name: metadata.title,
    keyvalues: {
      title: metadata.title,
      issuer: metadata.issuer,
      timestamp: metadata.timestamp,
      documentHash: metadata.documentHash
    }
  });
  formData.append('pinataMetadata', metadataJson);

  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
      }
    }
  );

  return response.data.IpfsHash;
};

// Helper function to get IPFS content
const getIPFSContent = async (ipfsHash: string) => {
  try {
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching IPFS content:", error);
    throw error;
  }
};

export const verifyDocumentByFile = async (file: File) => {
  try {
    // 1. Calculate file hash
    const documentHash = await calculateFileHash(file);

    // 2. Get contract instance
    const contract = await getContract();
    
    try {
      // 3. Check if document exists on blockchain
      const [hash, ipfsHash, title, issuer, timestamp, exists] = await contract.getDocument(documentHash);
      
      if (exists) {
        try {
          // 4. Verify against IPFS content
          const pinataResponse = await axios.get(`https://api.pinata.cloud/data/pinList?hashContains=${ipfsHash}`, {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
            }
          });

          if (pinataResponse.data.rows && pinataResponse.data.rows.length > 0) {
            const pinData = pinataResponse.data.rows[0];
            
            return {
              exists: true,
              verified: true,
              hash: documentHash,
              ipfsHash: ipfsHash,
              title: title,
              issuer: issuer,
              timestamp: new Date(timestamp.toNumber() * 1000),
              signature: "Verified on Blockchain and IPFS",
              message: "Document successfully verified"
            };
          }
        } catch (ipfsError) {
          console.error("Error verifying IPFS content:", ipfsError);
          return {
            exists: true,
            verified: false,
            hash: documentHash,
            message: "Document found on blockchain but IPFS verification failed"
          };
        }
      }
    } catch (error) {
      console.log("Document not found on blockchain");
    }

    return {
      exists: false,
      verified: false,
      message: "Document not found. Please ensure this document was generated through our platform."
    };
  } catch (error) {
    console.error("Error verifying document:", error);
    throw new Error("Failed to verify document. Please try again.");
  }
};

export const generateDocument = async (documentData: any, file: File) => {
  try {
    // 1. Calculate document hash
    const documentHash = await calculateFileHash(file);
    
    // 2. Upload to IPFS with metadata
    const timestamp = Date.now();
    const ipfsHash = await uploadToIPFS(file, {
      title: documentData.title,
      issuer: documentData.issuer || "System",
      timestamp: timestamp,
      documentHash: documentHash
    });

    // 3. Store on blockchain
    const contract = await getContract();
    const tx = await contract.addDocumentWithMetadata(
      documentHash,
      ipfsHash,
      documentData.title,
      documentData.issuer || await contract.signer.getAddress()
    );
    const receipt = await tx.wait();

    return {
      success: true,
      documentHash,
      ipfsHash,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber.toString()
    };
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
};

export const getDocumentByHash = async (ipfsHash: string) => {
  try {
    const contract = await getContract();
    const documentsCount = await contract.getDocumentsCount();
    
    for (let i = 0; i < documentsCount; i++) {
      const doc = await contract.documents(i);
      if (doc.ipfsHash === ipfsHash) {
        return {
          exists: true,
          ...doc
        };
      }
    }
    
    return {
      exists: false
    };
  } catch (error: any) {
    console.error("Error getting document:", error);
    throw error;
  }
};
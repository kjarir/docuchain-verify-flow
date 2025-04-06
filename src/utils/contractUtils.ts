/// <reference types="vite/client" />

import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/contracts/contractInfo";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  // Get provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Get signer
  const signer = provider.getSigner();
  
  // Create contract instance
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const generateDocument = async (templateType: string, documentData: any) => {
  try {
    // Generate document hash
    const documentContent = JSON.stringify({
      template: templateType,
      data: documentData
    });
    const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));

    // Get contract instance
    const contract = await getContract();

    // Call contract to store document
    const tx = await contract.addDocument(documentHash);
    const receipt = await tx.wait();

    return {
      success: true,
      documentId: documentHash,
      timestamp: new Date().toISOString(),
      blockNumber: receipt.blockNumber.toString(),
      transactionHash: receipt.transactionHash
    };
  } catch (error: any) {
    console.error("Error generating document:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
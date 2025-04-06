// ABI + CONTRACT ADDRESS

export const CONTRACT_ADDRESS = "0x2fc631e4b3018258759c52af169200213e84abab";

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "docHash", "type": "bytes32" }
    ],
    "name": "addDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "docHash", "type": "bytes32" }],
    "name": "verifyDocument",
    "outputs": [
      { "internalType": "bool", "name": "exists", "type": "bool" },
      { "internalType": "address", "name": "uploader", "type": "address" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "docHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "uploader", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "DocumentAdded",
    "type": "event"
  }
];

// Network configuration
export const MEGAETH_TESTNET_ID = '0x18c6'; // Replace with actual MegaETH testnet ID
export const MEGAETH_RPC_URL = 'https://rpc.megaeth.io'; // Replace with actual RPC URL
export const MEGAETH_EXPLORER_URL = 'https://explorer.megaeth.io';

// Network configuration object for MetaMask
export const MEGAETH_NETWORK_CONFIG = {
  chainId: MEGAETH_TESTNET_ID,
  chainName: "MegaETH Testnet",
  nativeCurrency: {
    name: "MegaETH",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: [MEGAETH_RPC_URL],
  blockExplorerUrls: [MEGAETH_EXPLORER_URL]
};

import { ethers } from "ethers";
import { getContract } from "../utils/contractUtils";

export const generateDocument = async (templateType: string, documentData: any) => {
  try {
    // Connect to contract
    const contract = await getContract();
    
    // Generate document hash
    const documentContent = JSON.stringify({
      template: templateType,
      data: documentData
    });
    const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
    
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
  } catch (error) {
    console.error("Error generating document:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

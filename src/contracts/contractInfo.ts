// ABI + CONTRACT ADDRESS

export const CONTRACT_ADDRESS = "0x23d351ba89eaac4e328133cb48e050064c219a1e";

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "signature",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "addDocumentWithMetadata",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "getDocument",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "getDocumentsByIssuer",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "getDocumentsByTitle",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "signature",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "verifyDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "signature",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
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
  chainId: "0x1a",  // 26 in decimal
  chainName: "MegaETH",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.megaeth.io"],
  blockExplorerUrls: ["https://megaexplorer.xyz"],
  contractAddress: "0x8990c5daaa40673ef8826990a6fd8284a0a17d61"
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

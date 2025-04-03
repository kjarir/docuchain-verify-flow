
/**
 * Utility functions for blockchain operations
 * This is a mock implementation for demo purposes
 */

// Generate a random hash string of specified length
export const generateHash = (length = 64): string => {
  const characters = "0123456789abcdef";
  return "0x" + Array.from({ length }, () => 
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

// Format a timestamp for display
export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Simulate document validation (would connect to a blockchain in real implementation)
export const validateDocument = async (documentId: string): Promise<{
  valid: boolean;
  documentId: string;
  timestamp: string;
  blockNumber?: string;
  transactionHash?: string;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, consider documents starting with 0x as valid
  const isValid = documentId.startsWith("0x");
  
  console.log(`Validating document ID: ${documentId}, valid: ${isValid}`);
  
  if (isValid) {
    return {
      valid: true,
      documentId,
      timestamp: new Date().toISOString(),
      blockNumber: Math.floor(15000000 + Math.random() * 1000000).toString(),
      transactionHash: generateHash(),
    };
  }
  
  return {
    valid: false,
    documentId,
    timestamp: new Date().toISOString(),
  };
};

// Simulate document generation and registration on blockchain
export const generateDocument = async (templateType: string, documentData: any): Promise<{
  success: boolean;
  documentId: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would create the document and register it on the blockchain
  return {
    success: true,
    documentId: generateHash(),
    timestamp: new Date().toISOString(),
    blockNumber: Math.floor(15000000 + Math.random() * 1000000).toString(),
    transactionHash: generateHash(),
  };
};

// API Service layer (would be connected to a real backend in production)
export const getApiKey = (): string => {
  // In a real implementation, this would connect to an actual server
  // For the demo, we'll generate a random API key
  return "dk_" + generateHash(32);
};

// For the demo, stores documents in localStorage
export const getUserDocuments = (): any[] => {
  const storedDocuments = localStorage.getItem('userDocuments');
  return storedDocuments ? JSON.parse(storedDocuments) : [];
};

export const saveUserDocument = (document: any): void => {
  const documents = getUserDocuments();
  documents.push({
    ...document,
    id: generateHash(16),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('userDocuments', JSON.stringify(documents));
};

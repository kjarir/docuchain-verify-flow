import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MEGAETH_NETWORK_CONFIG } from '@/contracts/contractInfo';
import DocumentVerifierABI from '@/contracts/DocumentVerifier.json';

export const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask is not installed');
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          MEGAETH_NETWORK_CONFIG.contractAddress,
          DocumentVerifierABI.abi,
          signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initContract();
  }, []);

  return { contract };
}; 
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useMetaMask = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    window.ethereum?.on('accountsChanged', checkConnection);
    return () => {
      window.ethereum?.removeListener('accountsChanged', checkConnection);
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsConnected(accounts.length > 0);
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
        setIsConnected(false);
      }
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        toast.success('MetaMask connected successfully');
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        toast.error('Failed to connect MetaMask');
      }
    } else {
      toast.error('Please install MetaMask to continue');
    }
  };

  return { isConnected, connect };
}; 
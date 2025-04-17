import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const uploadToPinata = async (formData: FormData): Promise<PinataResponse> => {
  try {
    const response = await axios.post<PinataResponse>(
      PINATA_API_URL,
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    if (!response.data || !response.data.IpfsHash) {
      throw new Error('Invalid response from Pinata');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error uploading to Pinata:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to upload file to IPFS');
  }
}; 
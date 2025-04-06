import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Blockchain setup
const provider = new ethers.providers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
const contractABI = require('../contracts/CertificateValidator.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS || '';
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Add blockchain logging
const logBlockchainInfo = async () => {
  try {
    const balance = await wallet.getBalance();
    const network = await provider.getNetwork();
    console.log('\n🔗 Blockchain Connection Info:');
    console.log('Network:', network.name);
    console.log('Chain ID:', network.chainId);
    console.log('Wallet Address:', wallet.address);
    console.log('Balance:', ethers.utils.formatEther(balance), 'ETH\n');
  } catch (error) {
    console.error('Error fetching blockchain info:', error);
  }
};

// Log blockchain info on startup
logBlockchainInfo();

app.use(express.json());
app.use(cors());

// Generate certificate endpoint
app.post('/api/generate', async (req, res) => {
  try {
    console.log('\n🔄 Starting certificate generation...');
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // Get gas estimate
    console.log('📊 Estimating gas...');
    const gasEstimate = await contract.estimateGas.generateCertificate(documentId);
    console.log('Estimated gas:', gasEstimate.toString());

    // Get current gas price
    const gasPrice = await provider.getGasPrice();
    console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

    // Calculate total cost
    const totalCost = gasPrice.mul(gasEstimate);
    console.log('Estimated total cost:', ethers.utils.formatEther(totalCost), 'ETH');

    // Generate certificate on blockchain
    console.log('\n📝 Sending transaction...');
    const tx = await contract.generateCertificate(documentId, {
      gasLimit: gasEstimate.mul(12).div(10), // Add 20% buffer
      gasPrice: gasPrice
    });

    console.log('Transaction hash:', tx.hash);
    console.log('Waiting for confirmation...');

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log('\n✅ Transaction confirmed!');
    console.log('Block number:', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    console.log('Actual cost:', ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), 'ETH');

    // Get updated wallet balance
    const newBalance = await wallet.getBalance();
    console.log('New wallet balance:', ethers.utils.formatEther(newBalance), 'ETH\n');

    return res.status(200).json({
      success: true,
      message: 'Certificate generated successfully',
      documentId,
      transactionDetails: {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        cost: ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)),
        confirmations: receipt.confirmations
      }
    });

  } catch (error) {
    console.error('\n❌ Error generating certificate:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Validation endpoint
app.post('/api/validate', async (req, res) => {
  try {
    console.log('\n🔍 Starting certificate validation...');
    console.log('Request:', {
      headers: req.headers,
      body: req.body
    });

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    if (!req.body?.documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    console.log('Querying blockchain...');
    const [docId, issuer, timestamp, isValid] = await contract.getCertificateDetails(req.body.documentId);

    console.log('\n📄 Certificate details:');
    console.log('Document ID:', docId);
    console.log('Issuer:', issuer);
    console.log('Timestamp:', new Date(timestamp.toNumber() * 1000).toISOString());
    console.log('Is Valid:', isValid, '\n');

    return res.status(200).json({
      success: true,
      isValid,
      documentId: docId,
      details: {
        issuer,
        timestamp: new Date(timestamp.toNumber() * 1000).toISOString(),
        isValid
      }
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 Server running at http://localhost:${port}`);
}); 
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
    // Connect to Sepolia testnet
    const provider = new ethers.providers.JsonRpcProvider(
        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    );

    // Create wallet from private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Get contract bytecode and ABI
    const contractBytecode = require('../contracts/CertificateValidator.json').bytecode;
    const contractABI = require('../contracts/CertificateValidator.json').abi;

    // Create contract factory
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

    console.log('Deploying contract...');
    const contract = await factory.deploy();
    await contract.deployed();

    console.log('Contract deployed to:', contract.address);
    return contract;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
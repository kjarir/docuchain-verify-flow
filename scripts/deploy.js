import { ethers } from 'ethers';
import fs from 'fs-extra';
import solc from 'solc';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function main() {
    try {
        // Read the contract source
        const contractPath = path.resolve(__dirname, '../src/contracts/CertificateValidator.sol');
        const source = fs.readFileSync(contractPath, 'utf8');

        // Compile the contract
        console.log('Compiling contract...');
        const input = {
            language: 'Solidity',
            sources: {
                'CertificateValidator.sol': {
                    content: source,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        const contract = output.contracts['CertificateValidator.sol'].CertificateValidator;

        // Save the contract artifacts
        const artifactsDir = path.resolve(__dirname, '../src/contracts');
        fs.ensureDirSync(artifactsDir);
        fs.writeFileSync(
            path.resolve(artifactsDir, 'CertificateValidator.json'),
            JSON.stringify({
                abi: contract.abi,
                bytecode: contract.evm.bytecode.object,
            }, null, 2)
        );

        // Connect to the network
        console.log('Connecting to network...');
        const provider = new ethers.providers.JsonRpcProvider(
            `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        );

        // Create wallet
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log('Deploying from address:', wallet.address);

        // Get wallet balance
        const balance = await wallet.getBalance();
        console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');

        // Deploy contract
        console.log('Deploying contract...');
        const ContractFactory = new ethers.ContractFactory(
            contract.abi,
            contract.evm.bytecode.object,
            wallet
        );

        const deployedContract = await ContractFactory.deploy();
        console.log('Waiting for deployment...');
        await deployedContract.deployed();

        console.log('Contract deployed to:', deployedContract.address);

        // Update .env file with contract address
        const envPath = path.resolve(__dirname, '../.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(
            /CONTRACT_ADDRESS=.*/,
            `CONTRACT_ADDRESS=${deployedContract.address}`
        );
        fs.writeFileSync(envPath, envContent);

        console.log('Updated .env file with contract address');
        return deployedContract;
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
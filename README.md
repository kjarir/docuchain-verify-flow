# 🛡️ TrustIssues

**Blockchain-Powered document Verification System**

**TrustIssues** is a decentralized platform that securely creates and verifies documents by converting user data into **Keccak-256 hashes** and storing them on the MegaETH testnet. This ensures that documents are tamper-proof, verifiable globally, and owned transparently.

🌐 **Live Demo:** [https://trustissues.vercel.app](https://trustissues.vercel.app)

---

## 🚀 Features

- 🔒 Secure document generation using **Keccak-256 hashing**
- ⛓️ Immutable storage on the Ethereum blockchain
- 🧾 Easy verification via a clean and simple UI
- 🌍 Accessible from anywhere—fully decentralized

---

## 🛠️ Tech Stack

- **Frontend:** React.JS, TypeScript, Tailwind CSS
- **Smart Contract:** Solidity, Ethereu (via Remix IDE)
- **Hashing:** Keccak-256 (default in Solidity)
- **Deployment:** Vercel

---

## 📦 Getting Started

### Prerequisites

- Node.js (v16+)
- MetaMask or any Ethereum-compatible wallet
- Vercel (optional, for deployment)

### Clone the Repository

```bash
git clone https://github.com/kjarir/trustissues.git
cd trustissues
Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
Start Development Server
bash
Copy
Edit
npm run dev
# or
yarn dev
🧠 How It Works
User fills form → document data is collected.

Data is hashed using keccak256 algorithm.

Hash is stored on-chain via a Solidity smart contract.

Anyone can verify the document by inputting the hash on the frontend.

Example Solidity Function
solidity
Copy
Edit
function storedocumentHash(bytes32 hash) public {
    require(hash != 0, "Hash cannot be zero");
    documents[msg.sender].push(hash);
}
✅ Verify a document
Go to https://trustissues.vercel.app

Navigate to the "Verify" section

Paste the hash value of a document

The system will confirm if it's on the blockchain

🤝 Contributing
We welcome all contributors!

Fork the repo

Create your branch: git checkout -b feature/awesome-feature

Commit your changes: git commit -m 'Added new stuff'

Push to the branch: git push origin feature/awesome-feature

Open a pull request 🚀

📜 License
Licensed under the MIT License. Use freely for personal or commercial purposes.

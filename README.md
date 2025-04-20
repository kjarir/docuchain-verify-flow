# 🛡️ TrustIssues

**Blockchain-Powered Certificate Verification System**

**TrustIssues** is a decentralized platform that securely creates and verifies certificates by converting user data into **Keccak-256 hashes** and storing them on the Ethereum blockchain. This ensures that certificates are tamper-proof, verifiable globally, and owned transparently.

🌐 **Live Demo:** [https://trustissues.vercel.app](https://trustissues.vercel.app)

---

## 🚀 Features

- 🔒 Secure certificate generation using **Keccak-256 hashing**
- ⛓️ Immutable storage on the Ethereum blockchain
- 🧾 Easy verification via a clean and simple UI
- 🌍 Accessible from anywhere—fully decentralized

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Smart Contract:** Solidity, Ethereum (via Remix IDE)
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
git clone https://github.com/your-username/trustissues.git
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
User fills form → certificate data is collected.

Data is hashed using keccak256 algorithm.

Hash is stored on-chain via a Solidity smart contract.

Anyone can verify the certificate by inputting the hash on the frontend.

Example Solidity Function
solidity
Copy
Edit
function storeCertificateHash(bytes32 hash) public {
    require(hash != 0, "Hash cannot be zero");
    certificates[msg.sender].push(hash);
}
✅ Verify a Certificate
Go to https://trustissues.vercel.app

Navigate to the "Verify" section

Paste the hash value of a certificate

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

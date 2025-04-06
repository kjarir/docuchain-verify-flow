"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ValidationBlock from "@/components/ValidationBlock";
import { ethers } from "ethers";
import contractAbi from "@/lib/TrustIssuesABI.json";

const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere"; // Replace this

export default function ValidatePage() {
  const [documentId, setDocumentId] = useState("");
  const [status, setStatus] = useState<"pending" | "verified" | "failed" | null>(null);
  const [blockNumber, setBlockNumber] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    setStatus("pending");

    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

      const tx = await contract.validateDocument(documentId); // Your smart contract method
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        const block = await provider.getBlock(receipt.blockNumber);
        setBlockNumber(receipt.blockNumber.toString());
        setTxHash(receipt.transactionHash);
        setTimestamp(new Date(block.timestamp * 1000).toLocaleString());
        setStatus("verified");
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error(error);
      setStatus("failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Validate Document</h1>
      <Input
        placeholder="Enter Document ID"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleValidate} disabled={loading || !documentId}>
        {loading ? "Validating..." : "Validate"}
      </Button>

      {status && timestamp && (
        <div className="mt-6">
          <ValidationBlock
            onDownload={() => {}}
            onView={() => {}}
            status={status}
            documentId={documentId}
            timestamp={timestamp}
            blockNumber={blockNumber}
            transactionHash={txHash}
          />
        </div>
      )}
    </div>
  );
}

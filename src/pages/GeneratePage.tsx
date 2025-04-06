import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValidationBlock from "@/components/ValidationBlock";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getContract } from "@/utils/contractUtils";
import { MEGAETH_NETWORK_CONFIG } from "@/contracts/contractInfo";

const GeneratePage = () => {
  const [template, setTemplate] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    parties: "",
    content: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [documentResult, setDocumentResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to generate documents");
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateDocument = async () => {
    if (!template || !formData.title) {
      toast.error("Please select a template and enter a title");
      return;
    }

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error("Please install MetaMask to connect to the blockchain");
        return;
      }

      // First, get accounts to ensure MetaMask is connected
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        toast.error("Please connect your MetaMask wallet");
        return;
      }

      // Get current network
      const currentNetwork = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Check if we're on the correct network
      if (currentNetwork !== MEGAETH_NETWORK_CONFIG.chainId) {
        // Try to switch to MegaETH testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MEGAETH_NETWORK_CONFIG.chainId }]
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [MEGAETH_NETWORK_CONFIG]
              });
            } catch (addError: any) {
              toast.error("Failed to add MegaETH network to MetaMask: " + addError.message);
              return;
            }
          } else {
            toast.error("Failed to switch to MegaETH network: " + switchError.message);
            return;
          }
        }
      }

      // Re-check accounts after network switch
      const accountsAfterSwitch = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accountsAfterSwitch || accountsAfterSwitch.length === 0) {
        toast.error("Please connect your MetaMask wallet after network switch");
        return;
      }

      setGenerating(true);

      // Generate document hash
      const documentContent = JSON.stringify({
        template: template,
        data: formData
      });
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));

      // Call contract to store document
      const contract = await getContract();
      const tx = await contract.addDocument(documentHash);
      const receipt = await tx.wait();

      setGenerated(true);
      setDocumentResult({
        status: "verified",
        documentId: documentHash,
        timestamp: new Date().toISOString(),
        blockNumber: receipt.blockNumber.toString(),
        transactionHash: receipt.transactionHash
      });
      
      toast.success(
        `Document successfully generated and registered on blockchain. ` +
        `Transaction: ${receipt.transactionHash}`
      );
    } catch (error: any) {
      console.error("Error generating document:", error);
      toast.error("An error occurred while generating the document: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadDocument = () => {
    if (!documentResult) {
      toast.error("No document to download");
      return;
    }

    const documentContent = `
      Document ID: ${documentResult.documentId}
      Title: ${formData.title}
      Description: ${formData.description}
      Parties: ${formData.parties}
      Date: ${new Date(documentResult.timestamp).toLocaleString()}
      Transaction Hash: ${documentResult.transactionHash}
      Block Number: ${documentResult.blockNumber}

      CONTENT:
      ${formData.content}
    `;

    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '_')}_${documentResult.documentId.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Document</CardTitle>
                <CardDescription>
                  Create and verify documents using blockchain technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    <Select
                      value={template}
                      onValueChange={setTemplate}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                        <SelectItem value="contract">Service Contract</SelectItem>
                        <SelectItem value="custom">Custom Document</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="space-y-4">
                      <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Document Title"
                        required
                      />
                      <Input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description"
                      />
                      <Input
                        type="text"
                        name="parties"
                        value={formData.parties}
                        onChange={handleInputChange}
                        placeholder="Parties involved"
                      />
                      <Textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Document content"
                        className="min-h-[200px]"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleGenerateDocument}
                      disabled={generating}
                      className="w-full"
                    >
                      {generating ? "Generating..." : "Generate Document"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {generated && documentResult && (
              <ValidationBlock
                onDownload={handleDownloadDocument}
                onView={() => {
                  window.open(`https://explorer.megaeth.com/tx/${documentResult.transactionHash}`);
                }}
                status={documentResult.status}
                documentId={documentResult.documentId}
                timestamp={documentResult.timestamp}
                blockNumber={documentResult.blockNumber}
                transactionHash={documentResult.transactionHash}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GeneratePage;

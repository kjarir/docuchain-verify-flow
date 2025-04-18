"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import axios from 'axios';
import { ethers } from "ethers";
import { getContract } from "@/utils/contractUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ValidationResult {
  verified: boolean;
  documentData?: {
    ipfsHash: string;
    name: string;
    timestamp: string;
    issuer: string;
    blockchainHash: string;
    transactionHash?: string;
  };
  error?: string;
}

const ValidatePage = () => {
  const [documentId, setDocumentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyOnBlockchain = async (documentHash: string) => {
    try {
      const contract = await getContract();
      const [hash, ipfsHash, title, issuer, timestamp, exists] = await contract.getDocument(documentHash);
      
      if (!exists) {
        return null;
      }

      return {
        blockchainHash: hash,
        ipfsHash,
        title,
        issuer,
        timestamp: new Date(timestamp.toNumber() * 1000)
      };
    } catch (error) {
      console.error("Error verifying on blockchain:", error);
      return null;
    }
  };

  const checkPinataDocument = async (cid: string) => {
    try {
      const response = await axios.get(
        `https://api.pinata.cloud/data/pinList?hashContains=${cid}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
          }
        }
      );

      if (response.data.rows && response.data.rows.length > 0) {
        const pinData = response.data.rows[0];
        
        // Get blockchain verification
        const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(cid));
        const blockchainData = await verifyOnBlockchain(documentHash);
        
        if (!blockchainData) {
          return {
            verified: false,
            error: "Document not found on blockchain"
          };
        }

        return {
          verified: true,
          documentData: {
            ipfsHash: cid,
            name: blockchainData.title,
            timestamp: blockchainData.timestamp.toLocaleString(),
            issuer: blockchainData.issuer,
            blockchainHash: blockchainData.blockchainHash
          }
        };
      }
      
      return {
        verified: false,
        error: "Document not found on IPFS"
      };
    } catch (error: any) {
      console.error("Error verifying document:", error);
      throw new Error("Failed to verify document");
    }
  };

  const verifyWithId = async () => {
    if (!documentId) {
      toast.error("Please enter a document ID");
      return;
    }

    try {
      setLoading(true);
      const verificationResult = await checkPinataDocument(documentId);
      setResult(verificationResult);

      if (verificationResult.verified) {
        toast.success("Document verified successfully");
      } else {
        toast.error(verificationResult.error || "Document verification failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setResult({
        verified: false,
        error: error.message || "Failed to verify document"
      });
      toast.error(error.message || "Failed to verify document");
    } finally {
      setLoading(false);
    }
  };

  const verifyWithFile = async (file: File) => {
    try {
      setLoading(true);
      
      // Upload file to get CID
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
          }
        }
      );
      
      if (!response.data.IpfsHash) {
        throw new Error("Failed to get document hash");
      }

      // Check if this CID exists and verify on blockchain
      const verificationResult = await checkPinataDocument(response.data.IpfsHash);
      setResult(verificationResult);

      if (verificationResult.verified) {
        toast.success("Document verified successfully on IPFS and blockchain");
      } else {
        toast.error("Document not found in our records");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setResult({
        verified: false,
        error: "Failed to verify document. Please ensure you're uploading a valid file."
      });
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      verifyWithFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Verify Document</CardTitle>
            <CardDescription className="text-lg">
              Verify the authenticity of a document using its IPFS hash or by uploading the PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Document Verification Process</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <div className="text-sm">Documents are verified on both IPFS and blockchain:</div>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li className="text-gray-600">IPFS ensures content integrity</li>
                    <li className="text-gray-600">Blockchain provides immutable proof of existence</li>
                    <li className="text-gray-600">Both checks must pass for verification</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="id" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="id">Verify with IPFS Hash</TabsTrigger>
                <TabsTrigger value="file">Verify with File</TabsTrigger>
              </TabsList>

              <TabsContent value="id" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">IPFS Hash</Label>
                    <Input
                      placeholder="Enter IPFS hash"
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={verifyWithId}
                    disabled={!documentId || loading}
                    className="w-full bg-gradient-blockchain text-white"
                  >
                    {loading ? "Verifying..." : "Verify Document"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Upload PDF</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? "Verifying..." : "Upload PDF"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {result && (
              <div className={`mt-6 p-6 rounded-lg space-y-4 border ${
                result.verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {result.verified ? "Document Verified!" : "Verification Failed"}
                  </h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    result.verified 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-red-800 bg-red-100'
                  }`}>
                    {result.verified ? "Verified" : "Invalid"}
                  </span>
                </div>

                {result.verified && result.documentData && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">Document Name</p>
                      <p className="text-gray-900">{result.documentData.name}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">IPFS Hash</p>
                      <p className="text-gray-900 font-mono text-sm break-all">{result.documentData.ipfsHash}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">Blockchain Hash</p>
                      <p className="text-gray-900 font-mono text-sm break-all">{result.documentData.blockchainHash}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">Issuer</p>
                      <p className="text-gray-900 font-mono text-sm break-all">{result.documentData.issuer}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">Timestamp</p>
                      <p className="text-gray-900">{result.documentData.timestamp}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">View Document</p>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${result.documentData.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View on IPFS
                      </a>
                    </div>
                  </div>
                )}

                {!result.verified && (
                  <div className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800 whitespace-normal break-words">
                          {result.error || "Document verification failed"}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ValidatePage;

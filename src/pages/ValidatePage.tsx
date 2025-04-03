
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValidationBlock from "@/components/ValidationBlock";

const ValidatePage = () => {
  const [documentId, setDocumentId] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: "verified" | "pending" | "failed";
    documentId: string;
    timestamp: string;
    blockNumber?: string;
    transactionHash?: string;
  } | null>(null);
  
  const handleValidate = () => {
    if (!documentId.trim()) return;
    
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      
      if (documentId.startsWith("0x")) {
        // Successful validation
        setValidationResult({
          status: "verified",
          documentId: documentId,
          timestamp: new Date().toISOString(),
          blockNumber: "15482931",
          transactionHash: "0x9a7c7b0e902f9e2e68f799778b568c383ad5cef1bbc6e5678c9d9bc6eb0a3521",
        });
      } else {
        // Failed validation
        setValidationResult({
          status: "failed",
          documentId: documentId,
          timestamp: new Date().toISOString(),
        });
      }
    }, 2000);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate file hash generation
    setTimeout(() => {
      const fileHash = "0x" + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      
      setDocumentId(fileHash);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Validate Document</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Verify the authenticity of documents by providing a document ID or uploading a file for validation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Document Validation</CardTitle>
                <CardDescription>
                  Enter document ID or upload a document to verify its authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter document ID (e.g., 0x1a2b3c...)"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                      />
                      <Button 
                        onClick={handleValidate} 
                        disabled={isValidating || !documentId.trim()}
                        className="bg-gradient-blockchain hover:opacity-90 flex-shrink-0"
                      >
                        {isValidating ? "Validating..." : "Validate"}
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-sm text-gray-500">or</span>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <label className="cursor-pointer inline-block">
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div className="space-y-3">
                          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Upload className="text-blue-500" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Drop your document here or{" "}
                              <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOCX, JPG, PNG (max. 10MB)
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-sm">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Enter a document ID or upload a document file</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>Our system checks the blockchain for verification</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>View the authentication result and document details</span>
                  </li>
                </ol>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-start gap-2 text-amber-600">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="text-xs">
                      Only documents that have been previously registered on our blockchain can be validated.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {validationResult && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Validation Result</h2>
              <ValidationBlock {...validationResult} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ValidatePage;

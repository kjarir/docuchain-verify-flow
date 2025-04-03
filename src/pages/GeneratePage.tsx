
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Save, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValidationBlock from "@/components/ValidationBlock";

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
  const [documentResult, setDocumentResult] = useState<{
    status: "verified" | "pending" | "failed";
    documentId: string;
    timestamp: string;
    blockNumber?: string;
    transactionHash?: string;
  } | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGenerateDocument = () => {
    if (!template || !formData.title) return;
    
    setGenerating(true);
    
    // Simulate document generation process
    setTimeout(() => {
      const documentId = "0x" + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      
      setGenerated(true);
      setGenerating(false);
      setDocumentResult({
        status: "verified",
        documentId,
        timestamp: new Date().toISOString(),
        blockNumber: "15483012",
        transactionHash: "0x8b7c7d5e902f9e2e68f799778b568c383ad5cef1bbc6e5678c9d9bc6eb0a3521",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Generate Secure Document</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create and register new documents on the blockchain for immutable record-keeping and verification.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Document Generator</CardTitle>
                <CardDescription>
                  Fill in the details to generate a secure document on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium" htmlFor="template">
                      Document Template
                    </label>
                    <Select value={template} onValueChange={setTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contract">Legal Contract</SelectItem>
                        <SelectItem value="agreement">Service Agreement</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="custom">Custom Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium" htmlFor="title">
                      Document Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter document title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium" htmlFor="description">
                      Description
                    </label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Brief description of the document"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium" htmlFor="parties">
                      Parties Involved
                    </label>
                    <Input
                      id="parties"
                      name="parties"
                      placeholder="Names of parties involved, separated by commas"
                      value={formData.parties}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium" htmlFor="content">
                      Document Content
                    </label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Enter the main content of your document"
                      rows={6}
                      value={formData.content}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerateDocument} 
                    disabled={generating || !template || !formData.title}
                    className="w-full bg-gradient-blockchain hover:opacity-90"
                  >
                    {generating ? "Generating..." : "Generate & Register Document"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Template Info</CardTitle>
              </CardHeader>
              <CardContent>
                {!template ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <FileText className="text-gray-400 mb-2" size={40} />
                    <p className="text-sm text-gray-500">
                      Select a template to see information
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {template === "contract" && "Legal Contract"}
                          {template === "agreement" && "Service Agreement"}
                          {template === "certificate" && "Certificate"}
                          {template === "custom" && "Custom Document"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {template === "contract" && "Standard legal contract with terms and conditions."}
                          {template === "agreement" && "Agreement between service provider and client."}
                          {template === "certificate" && "Certificate of completion or achievement."}
                          {template === "custom" && "Fully customizable document template."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Required fields:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={14} />
                          <span>Document Title</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={14} />
                          <span>Description (optional)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={14} />
                          <span>Parties Involved</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={14} />
                          <span>Document Content</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-start gap-2 text-amber-600">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p className="text-xs">
                          Once generated, documents cannot be altered due to blockchain immutability.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {documentResult && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <Save className="text-green-500" size={20} />
                <h2 className="text-xl font-semibold">Document Successfully Generated</h2>
              </div>
              
              <ValidationBlock {...documentResult} />
              
              <div className="mt-4 flex gap-3">
                <Button variant="outline">
                  Download Document
                </Button>
                <Button variant="outline">
                  View on Blockchain
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GeneratePage;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadToPinata } from '@/utils/ipfsUtils';
import { ethers } from "ethers";
import { getContract } from "@/utils/contractUtils";
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import Navbar from "@/components/Navbar";

// Configure fonts for pdfMake
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

const GeneratePage = () => {
  const [formData, setFormData] = useState({
    template: "",
    title: "",
    description: "",
    parties: "",
    content: "",
    ipfsHash: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ipfsHash: string;
    transactionHash: string;
    documentId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (data: typeof formData): Promise<Blob> => {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: data.title,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: data.template,
          style: 'content',
          margin: [0, 0, 0, 20]
        },
        {
          stack: [
            {
              columns: [
                {
                  stack: [
                    { text: 'Document Details', style: 'subheader', margin: [0, 0, 0, 10] },
                    { text: 'Title:', style: 'label', margin: [0, 0, 0, 5] },
                    { text: data.title, style: 'value', margin: [0, 0, 0, 10] },
                    { text: 'Generated on:', style: 'label', margin: [0, 0, 0, 5] },
                    { text: new Date().toLocaleString(), style: 'value', margin: [0, 0, 0, 10] },
                    { text: 'IPFS Hash:', style: 'label', margin: [0, 0, 0, 5] },
                    { text: data.ipfsHash || 'Pending...', style: 'hash' }
                  ],
                  width: '*'
                }
              ]
            }
          ],
          style: 'metadata'
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#2563eb',
          font: 'Roboto'
        },
        subheader: {
          fontSize: 18,
          bold: true,
          color: '#1e40af',
          font: 'Roboto'
        },
        content: {
          fontSize: 12,
          lineHeight: 1.5,
          font: 'Roboto'
        },
        label: {
          fontSize: 10,
          color: '#6b7280',
          bold: true,
          font: 'Roboto'
        },
        value: {
          fontSize: 12,
          font: 'Roboto'
        },
        hash: {
          fontSize: 10,
          color: '#4b5563',
          font: 'Roboto'
        },
        metadata: {
          margin: [10, 20, 10, 10],
          background: '#f3f4f6'
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    return new Promise((resolve) => {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.template) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First generate PDF without IPFS hash
      const initialPdfBlob = await generatePDF(formData);
      
      // Upload to IPFS
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', new File([initialPdfBlob], `${formData.title}.pdf`));
      
      const ipfsResult = await uploadToPinata(formDataWithFile);
      const ipfsHash = ipfsResult.IpfsHash;

      // Generate final PDF with IPFS hash
      const finalPdfBlob = await generatePDF({ ...formData, ipfsHash });
      
      // Upload final version to IPFS
      const finalFormData = new FormData();
      finalFormData.append('file', new File([finalPdfBlob], `${formData.title}.pdf`));
      
      const finalIpfsResult = await uploadToPinata(finalFormData);

      // Store on blockchain
      const contract = await getContract();
      const tx = await contract.addDocumentWithMetadata(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(finalIpfsResult.IpfsHash)),
        finalIpfsResult.IpfsHash,
        formData.title,
        await contract.signer.getAddress()
      );
      const receipt = await tx.wait();
      
      setResult({
        ipfsHash: finalIpfsResult.IpfsHash,
        documentId: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(finalIpfsResult.IpfsHash)),
        transactionHash: receipt.transactionHash
      });

      // Clear form
      setFormData({
        title: '',
        template: '',
        description: '',
        parties: '',
        content: '',
        ipfsHash: ''
      });
      
      toast.success('Document generated and stored on blockchain successfully');
    } catch (err) {
      console.error('Error generating document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate document';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Generate Document</CardTitle>
            <CardDescription className="text-lg">
              Create a document that will be stored on IPFS and verified on blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <Select
                    value={formData.template}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                  <Input
                    placeholder="Enter document title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  placeholder="Enter document description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parties Involved</label>
                <Input
                  placeholder="Enter parties involved (comma separated)"
                  value={formData.parties}
                  onChange={(e) => setFormData(prev => ({ ...prev, parties: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Content</label>
                <Textarea
                  placeholder="Enter document content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[200px]"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-blockchain text-white"
              >
                {loading ? "Processing..." : "Generate Document"}
              </Button>

              {result && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Document Generated Successfully!</h3>
                    <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      Verified
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">Document ID</p>
                      <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-100">
                        {result.documentId}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">View Document</p>
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          View on IPFS
                        </a>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">Transaction</p>
                        <a
                          href={`https://megaexplorer.xyz/tx/${result.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          View on Explorer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneratePage;

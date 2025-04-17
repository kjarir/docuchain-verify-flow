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
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { Document, Page } from 'react-pdf';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import QRCode from 'qrcode';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (vfsFonts as any).default || vfsFonts;

// Define fonts
const fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

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
  const [documentResult, setDocumentResult] = useState<any>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
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

  const generateQRCode = async (verificationData: string) => {
    try {
      // Create a verification URL with all necessary data
      const verificationUrl = `${window.location.origin}/verify?data=${encodeURIComponent(verificationData)}`;
      const qrDataUrl = await QRCode.toDataURL(verificationUrl);
      return qrDataUrl;
    } catch (err) {
      console.error("Error generating QR code:", err);
      return null;
    }
  };

  const generatePDF = async (documentData: any): Promise<Blob> => {
    const currentDate = new Date().toLocaleDateString();
    const { hash, signature, verificationData } = documentData;
    const qrCodeDataUrl = await generateQRCode(verificationData);
    
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: formData.title, style: 'header' as const },
        { text: currentDate, alignment: 'right' as const, margin: [0, 0, 0, 20] },
        { text: 'Description:', style: 'subheader' as const },
        { text: formData.description, margin: [0, 0, 0, 10] },
        { text: 'Parties Involved:', style: 'subheader' as const },
        { text: formData.parties, margin: [0, 0, 0, 10] },
        { text: 'Content:', style: 'subheader' as const },
        { text: formData.content, margin: [0, 0, 0, 20] },
        { text: '───────────────────────────────', alignment: 'center' as const },
        { text: 'Document Verification', style: 'subheader' as const, alignment: 'center' as const },
        { text: 'This document is digitally signed and verified on blockchain', style: 'caption' as const },
        { text: `Document ID: ${hash}`, style: 'verification' as const },
        { text: `Digital Signature: ${signature}`, style: 'verification' as const },
        qrCodeDataUrl ? { image: qrCodeDataUrl, width: 100, alignment: 'center' as const } : [],
        { text: 'Scan QR code or visit our website to verify this document', style: 'caption' as const },
        { text: 'Any modification to this document will invalidate the digital signature', style: 'warning' as const },
        { text: '───────────────────────────────', alignment: 'center' as const },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        verification: {
          fontSize: 10,
          color: 'grey',
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        caption: {
          fontSize: 8,
          color: 'grey',
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        warning: {
          fontSize: 8,
          color: 'red',
          alignment: 'center',
          margin: [0, 5, 0, 20]
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

  const handleGenerateDocument = async () => {
    if (!template || !formData.title) {
      toast.error("Please select a template and enter a title");
      return;
    }

    try {
      setGenerating(true);

      // Get the signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Create document data
      const documentData = {
        template,
        title: formData.title,
        description: formData.description,
        parties: formData.parties,
        content: formData.content,
        issuer: address,
        timestamp: new Date().toISOString()
      };

      // Create document hash
      const contentHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(JSON.stringify(documentData))
      );

      // Sign the hash
      const signature = await signer.signMessage(ethers.utils.arrayify(contentHash));

      // Create verification data
      const verificationData = JSON.stringify({
        hash: contentHash,
        signature,
        issuer: address,
        title: formData.title,
        timestamp: documentData.timestamp
      });

      // Generate PDF with embedded verification data
      const pdfBlob = await generatePDF({
        hash: contentHash,
        signature,
        verificationData
      });
      setPdfBlob(pdfBlob);

      // Store on blockchain with searchable data
      const contract = await getContract();
      const tx = await contract.addDocumentWithMetadata(
        contentHash,
        signature,
        formData.title,
        address
      );
      const receipt = await tx.wait();

      setGenerated(true);
      setDocumentResult({
        status: "verified",
        documentId: contentHash,
        signature,
        issuer: address,
        timestamp: documentData.timestamp,
        blockNumber: receipt.blockNumber.toString(),
        transactionHash: receipt.transactionHash
      });
      
      toast.success('Document successfully generated and verified on blockchain');
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadDocument = async () => {
    if (!documentResult || !pdfBlob) {
      toast.error("No document to download");
      return;
    }

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '_')}.pdf`;
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
                  window.open(`https://megaexplorer.xyz/tx/${documentResult.transactionHash}`);
                }}
                status={documentResult.status}
                documentId={documentResult.documentId}
                signature={documentResult.signature}
                issuer={documentResult.issuer}
                timestamp={documentResult.timestamp}
                blockNumber={documentResult.blockNumber}
                transactionHash={documentResult.transactionHash}
              >
                <div className="mt-4">
                  <h3>Document Preview</h3>
                  <div className="pdf-viewer border rounded p-4 mt-2">
                    <Document file={pdfBlob}>
                      <Page pageNumber={1} />
                    </Document>
                  </div>
                </div>
              </ValidationBlock>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GeneratePage;

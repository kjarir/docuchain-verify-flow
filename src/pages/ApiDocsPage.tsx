
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Key, Lock, FileText, Code, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ApiDocsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">API Documentation</h1>
          </div>
          
          <div className="space-y-12">
            {/* Getting Started Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <p className="text-gray-600">
                Our API allows you to integrate document generation and validation services directly into your applications.
                Follow these steps to get started:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Key className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">1. Get API Key</h3>
                  <p className="text-gray-600 text-sm">
                    Sign up for an account and generate an API key from your dashboard.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Lock className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">2. Authentication</h3>
                  <p className="text-gray-600 text-sm">
                    Use your API key in the Authorization header for all API requests.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">3. Start Using</h3>
                  <p className="text-gray-600 text-sm">
                    Make API calls to generate and validate documents with blockchain security.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Authentication Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Authentication</h2>
              <p className="text-gray-600">
                All API requests must include your API key in the Authorization header.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg border overflow-x-auto">
                <code className="text-sm">
                  <span className="text-blue-600">Authorization:</span> Bearer <span className="text-green-600">your-api-key</span>
                </code>
              </div>
            </section>
            
            {/* API Reference Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">API Reference</h2>
              
              {/* Generate Document Endpoint */}
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">POST</span>
                    <h3 className="font-mono font-medium">/api/v1/documents/generate</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Copy size={14} />
                    <span>Copy</span>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Generate a new document and record it on the blockchain.</p>
                  
                  <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`{
  "template": "contract",
  "data": {
    "title": "Service Agreement",
    "parties": [
      {
        "name": "Company A",
        "address": "123 Business St."
      },
      {
        "name": "Company B",
        "address": "456 Corporate Ave."
      }
    ],
    "terms": "These are the contract terms...",
    "effectiveDate": "2025-05-01"
  }
}`}
                    </pre>
                  </div>
                  
                  <h4 className="text-sm font-semibold mb-2">Response</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`{
  "success": true,
  "documentId": "0xf7c6bac9e644b8c4536c17954d9516be721bc3bc5e",
  "transactionHash": "0x8a294c2f5b7356c42dbb6c1af8155bf81b5166e89e364652dd3d11f38d228160",
  "blockNumber": 15482931,
  "timestamp": "2025-04-03T14:32:11Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Validate Document Endpoint */}
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">GET</span>
                    <h3 className="font-mono font-medium">/api/v1/documents/validate/{'{documentId}'}</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Copy size={14} />
                    <span>Copy</span>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Validate a document's authenticity on the blockchain.</p>
                  
                  <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                  <div className="mb-4">
                    <p className="text-sm"><span className="font-mono font-medium">documentId</span> - The blockchain ID of the document to validate</p>
                  </div>
                  
                  <h4 className="text-sm font-semibold mb-2">Response</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`{
  "isValid": true,
  "documentId": "0xf7c6bac9e644b8c4536c17954d9516be721bc3bc5e",
  "transactionHash": "0x8a294c2f5b7356c42dbb6c1af8155bf81b5166e89e364652dd3d11f38d228160",
  "blockNumber": 15482931,
  "timestamp": "2025-04-03T14:32:11Z",
  "documentDetails": {
    "title": "Service Agreement",
    "parties": [
      {
        "name": "Company A",
        "address": "123 Business St."
      },
      {
        "name": "Company B",
        "address": "456 Corporate Ave."
      }
    ]
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
            
            {/* SDK Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">SDK Integration</h2>
              <p className="text-gray-600 mb-6">
                Use our JavaScript SDK for easy integration with your applications.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Installation</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">npm install @docuchain/sdk</code>
                </div>
                
                <h3 className="text-lg font-semibold mt-6">Quick Start Example</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`// Import the DocuChain SDK
import { DocuChain } from '@docuchain/sdk';

// Initialize with your API key
const docuchain = new DocuChain({
  apiKey: 'YOUR_API_KEY'
});

// Generate a document
async function generateDocument() {
  const document = await docuchain.generate({
    template: 'contract',
    data: {
      title: 'Service Agreement',
      parties: [
        {
          name: 'Company A',
          address: '123 Business St.'
        },
        {
          name: 'Company B',
          address: '456 Corporate Ave.'
        }
      ],
      terms: 'These are the contract terms...',
      effectiveDate: '2025-05-01'
    }
  });
  
  console.log('Document generated:', document.documentId);
  return document;
}

// Validate a document
async function validateDocument(documentId) {
  const result = await docuchain.validate({
    documentId: documentId
  });
  
  console.log('Document is valid:', result.isValid);
  return result;
}`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocsPage;

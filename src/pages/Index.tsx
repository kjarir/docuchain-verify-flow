
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, FileText, Lock, RefreshCw, Key, Database, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockchainAnimation from "@/components/BlockchainAnimation";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Blockchain-Powered Documents
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Secure Document Validation on the Blockchain
                </h1>
                <p className="text-lg text-gray-600">
                  Generate and validate documents with unmatched security, transparency, and immutability using our blockchain technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-blockchain hover:opacity-90" asChild>
                    <Link to="/validate">Validate Document</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/generate">Generate Document</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={16} className="text-blue-500" />
                  <span>Enterprise-grade security with blockchain verification</span>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl border p-6 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-blockchain flex items-center justify-center">
                        <FileText className="text-white" size={16} />
                      </div>
                      <span className="font-semibold">Contract Validation</span>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Verified
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Document Hash</div>
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                        0xf7c6bac9e644b8c4536c17954d9516be721bc3bc5e
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Block Number</div>
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                        15482931
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Timestamp</div>
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                        2025-04-03 14:32:11 UTC
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-0 -bottom-10 -right-10">
                  <BlockchainAnimation />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powered by Blockchain Technology</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our platform leverages blockchain technology to ensure document authenticity, immutability, and easy verification across organizations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="Immutable Records"
                description="Once documents are recorded on the blockchain, they cannot be altered or tampered with, ensuring data integrity."
                icon={Lock}
              />
              <FeatureCard 
                title="Instant Verification"
                description="Verify document authenticity in seconds using our blockchain verification system."
                icon={RefreshCw}
              />
              <FeatureCard 
                title="Secure API Access"
                description="Generate and validate documents programmatically with our secure API integration."
                icon={Key}
              />
              <FeatureCard 
                title="Transparent Audit Trail"
                description="Every action is recorded on the blockchain, creating a transparent and immutable audit trail."
                icon={Database}
              />
              <FeatureCard 
                title="Document Generation"
                description="Create tamper-proof documents directly on our platform with customizable templates."
                icon={FileText}
              />
              <FeatureCard 
                title="Enterprise Security"
                description="Enterprise-grade security protocols protect your sensitive documents and data."
                icon={Shield}
              />
            </div>
          </div>
        </section>
        
        {/* Integration Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                  <div className="font-mono text-sm text-gray-800">
                    <div className="text-gray-400">// Initialize TrustIssues client</div>
                    <div className="mt-2">
                      <span className="text-blue-600">const</span> TrustIssues = <span className="text-blue-600">new</span> TrustIssues({'{'} 
                      <br />
                      <span className="pl-4">apiKey: </span><span className="text-green-600">'YOUR_API_KEY'</span>
                      <br />
                      {'}'});
                    </div>
                    <div className="mt-4 text-gray-400">// Generate a new document</div>
                    <div className="mt-2">
                      <span className="text-blue-600">const</span> document = <span className="text-blue-600">await</span> TrustIssues.generate({'{'} 
                      <br />
                      <span className="pl-4">template: </span><span className="text-green-600">'contract'</span>,
                      <br />
                      <span className="pl-4">data: </span>{'{'} <span className="text-green-600">/* your data */</span> {'}'}
                      <br />
                      {'}'});
                    </div>
                    <div className="mt-4 text-gray-400">// Validate a document</div>
                    <div className="mt-2">
                      <span className="text-blue-600">const</span> result = <span className="text-blue-600">await</span> TrustIssues.validate({'{'} 
                      <br />
                      <span className="pl-4">documentId: </span><span className="text-green-600">'0xf7c6...'</span>
                      <br />
                      {'}'});
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Easy Integration for Companies</h2>
                <p className="text-gray-600">
                  Integrate TrustIssues into your existing systems with our simple API. Generate and validate documents with just a few lines of code.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-green-500 flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <span className="text-gray-700">Get your API key from the dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-green-500 flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <span className="text-gray-700">Use our SDK to connect to the TrustIssues service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-green-500 flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <span className="text-gray-700">Generate and validate documents programmatically</span>
                  </li>
                </ul>
                <Button className="bg-gradient-blockchain hover:opacity-90" asChild>
                  <Link to="/api">Get API Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

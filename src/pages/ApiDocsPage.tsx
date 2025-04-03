import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Copy, Plus, Trash2, RefreshCw, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ensureDefaultApiKey, getAllApiKeys, generateApiKey, deleteApiKey, ApiKey, validateApiKey } from "@/utils/apiKeyService";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ApiTester from "@/components/ApiTester";

const ApiDocsPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to access API documentation");
      navigate("/login");
      return;
    }
    
    loadApiKeys();
  }, [navigate]);
  
  const loadApiKeys = () => {
    ensureDefaultApiKey();
    const keys = getAllApiKeys();
    setApiKeys(keys);
    if (keys.length > 0 && !selectedKey) {
      setSelectedKey(keys[0].key);
    }
  };
  
  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }
    
    setLoading(true);
    try {
      const newKey = generateApiKey(newKeyName);
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName("");
      toast.success("New API key created successfully");
    } catch (error) {
      toast.error("Failed to create API key");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteApiKey = (key: string) => {
    setLoading(true);
    try {
      const success = deleteApiKey(key);
      if (success) {
        setApiKeys(prev => prev.filter(k => k.key !== key));
        toast.success("API key deleted successfully");
        if (selectedKey === key && apiKeys.length > 1) {
          setSelectedKey(apiKeys[0].key !== key ? apiKeys[0].key : apiKeys[1].key);
        }
      } else {
        toast.error("Failed to delete API key");
      }
    } catch (error) {
      toast.error("Error deleting API key");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("API key copied to clipboard");
      },
      () => {
        toast.error("Failed to copy API key");
      }
    );
  };

  const getBaseUrl = () => {
    return window.location.origin;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">API Documentation</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access DocuChain's blockchain document services programmatically through our REST API.
            </p>
          </div>
          
          <Alert className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Local API Only</AlertTitle>
            <AlertDescription>
              Currently, the API is running locally and accessible only through this application. 
              To use the API endpoints, please use the base URL: <code className="bg-gray-100 px-2 py-1 rounded">{getBaseUrl()}/api</code>
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys to authenticate requests to the DocuChain API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="flex gap-3">
                      <Input 
                        placeholder="API Key Name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                      <Button 
                        onClick={handleCreateApiKey} 
                        disabled={loading || !newKeyName.trim()}
                        className="bg-gradient-blockchain hover:opacity-90"
                      >
                        <Plus size={16} /> Create Key
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg divide-y">
                      {apiKeys.length === 0 ? (
                        <div className="py-6 text-center text-gray-500">
                          No API keys found. Create one to get started.
                        </div>
                      ) : (
                        apiKeys.map((apiKey) => (
                          <div key={apiKey.key} className="p-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{apiKey.name}</div>
                              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <span className="font-mono">{apiKey.key}</span>
                                <button 
                                  onClick={() => copyToClipboard(apiKey.key)} 
                                  className="text-primary hover:text-primary/90"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Created: {new Date(apiKey.createdAt).toLocaleDateString()} • 
                                Used: {apiKey.usageCount} time{apiKey.usageCount !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteApiKey(apiKey.key)}
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>
                    Use these endpoints to interact with DocuChain services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Authentication</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        All API requests require authentication using an API key. Include your API key in the header of your requests.
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        Authorization: Bearer {selectedKey || "YOUR_API_KEY"}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Validate Document</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Validate a document's authenticity on the blockchain.
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        POST {getBaseUrl()}/api/validate
                      </div>
                      <div className="mt-2 mb-3 text-sm">
                        <span className="font-semibold">Request Body:</span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                        {`{
  "documentId": "0x1234567890abcdef1234567890abcdef"
}`}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Generate Document</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Create and register a new document on the blockchain.
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        POST {getBaseUrl()}/api/generate
                      </div>
                      <div className="mt-2 mb-3 text-sm">
                        <span className="font-semibold">Request Body:</span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                        {`{
  "template": "contract",
  "title": "Document Title",
  "description": "Document Description",
  "parties": "Party A, Party B",
  "content": "Document content goes here"
}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-medium">CURL Example</h3>
                    <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap">
{`curl -X POST ${getBaseUrl()}/api/validate \\
  -H "Authorization: Bearer ${selectedKey || "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "documentId": "0x1234567890abcdef1234567890abcdef"
  }'`}
                    </div>
                    
                    <h3 className="font-medium mt-6">Node.js Example</h3>
                    <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap">
{`const axios = require('axios');

async function validateDocument(documentId) {
  try {
    const response = await axios.post(
      '${getBaseUrl()}/api/validate',
      { documentId },
      {
        headers: {
          'Authorization': 'Bearer ${selectedKey || "YOUR_API_KEY"}',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}`}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    API requests are subject to the following rate limits:
                  </p>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span>Validate Document:</span>
                      <span className="font-medium">100 requests/minute</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Generate Document:</span>
                      <span className="font-medium">20 requests/minute</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Total Requests:</span>
                      <span className="font-medium">1000 requests/day</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    Need higher limits? Contact our sales team for enterprise pricing options.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocsPage;

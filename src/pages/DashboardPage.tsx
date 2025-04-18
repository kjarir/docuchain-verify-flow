import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, FileText, Key, RefreshCw, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValidationBlock from "@/components/ValidationBlock";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage = () => {
  const [apiKey, setApiKey] = useState("sk_test_TrustIssues_7f8a9b5c3d2e1f0g");
  const { toast } = useToast();
  
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key copied",
      description: "Your API key has been copied to clipboard.",
      duration: 3000,
    });
  };
  
  const handleRegenerateApiKey = () => {
    // In a real app, this would call an API to regenerate the key
    const newKey = "sk_test_TrustIssues_" + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast({
      title: "API Key regenerated",
      description: "Your new API key has been generated successfully.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Manage your documents, view activity, and access your API keys.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={18} />
                  <span>Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-gray-500 mt-1">Total documents registered</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield size={18} />
                  <span>Validations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-sm text-gray-500 mt-1">Document validations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key size={18} />
                  <span>API Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89%</div>
                <p className="text-sm text-gray-500 mt-1">Of monthly allowance</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>
                    Documents you've recently generated or validated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-blockchain flex items-center justify-center">
                            <FileText className="text-white" size={18} />
                          </div>
                          <div>
                            <div className="font-medium">Service Agreement #{i}</div>
                            <div className="text-xs text-gray-500">
                              Generated on {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Documents
                  </Button>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidationBlock
                  status="verified"
                  documentId="0x9a7c7b0e902f9e2e68f799778b568c383ad5cef1"
                  timestamp="2025-04-02T14:32:11.000Z"
                  blockNumber="15482931"
                  transactionHash="0x9a7c7b0e902f9e2e68f799778b568c383ad5cef1bbc6e5678c9d9bc6eb0a3521"
                  signature="0x..."
                  issuer="0x1234..."
                  onDownload={() => {}}
                  onView={() => {}}
                />
                <ValidationBlock
                  status="pending"
                  documentId="0x8b7c7d5e902f9e2e68f799778b568c383ad5cef1"
                  timestamp="2025-04-03T10:15:22.000Z"
                  signature="0x..."
                  issuer="0x1234..."
                  onDownload={() => {}}
                  onView={() => {}}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Recent activity on your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Document Generated", time: "Today, 2:45 PM", icon: FileText },
                      { action: "Document Validated", time: "Today, 10:23 AM", icon: Shield },
                      { action: "API Key Generated", time: "Yesterday, 4:12 PM", icon: Key },
                      { action: "Document Generated", time: "Apr 1, 9:30 AM", icon: FileText },
                      { action: "Document Validated", time: "Mar 31, 3:45 PM", icon: Shield },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <activity.icon className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Key Management</CardTitle>
                  <CardDescription>
                    Manage and regenerate your API keys for integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Your API Key
                      </label>
                      <div className="flex">
                        <Input
                          type="text"
                          value={apiKey}
                          readOnly
                          className="font-mono bg-gray-50"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={handleCopyApiKey}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use this key to authenticate requests to the TrustIssues API.
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={handleRegenerateApiKey}
                      >
                        <RefreshCw size={16} />
                        <span>Regenerate API Key</span>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Regenerating your API key will invalidate the current key.
                        Make sure to update any applications using the API.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Usage Stats</CardTitle>
                  <CardDescription>
                    Monitor your API usage and limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Monthly Usage</span>
                        <span className="text-sm text-gray-500">89% (890/1000)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "89%" }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">245</div>
                        <div className="text-xs text-gray-500">Document Generations</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">645</div>
                        <div className="text-xs text-gray-500">Document Validations</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        View Detailed API Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ApiTesterProps {
  apiKey: string;
  baseUrl: string;
}

const ApiTester = ({ apiKey, baseUrl }: ApiTesterProps) => {
  const [documentId, setDocumentId] = useState("0x1234567890abcdef1234567890abcdef");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleTestValidate = async () => {
    if (!documentId) {
      toast.error("Please enter a document ID");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ documentId })
      });
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      
      if (res.ok) {
        toast.success("API request successful");
      } else {
        toast.error(`API request failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("API test error:", error);
      setResponse(JSON.stringify({ error: "Failed to send request" }, null, 2));
      toast.error("Failed to send API request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test API Locally</CardTitle>
        <CardDescription>
          Try out the API endpoints directly from your browser
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Document ID</label>
            <Input 
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="Enter document ID"
            />
          </div>
          
          <Button 
            onClick={handleTestValidate}
            disabled={loading || !apiKey}
            className="w-full bg-gradient-blockchain hover:opacity-90"
          >
            {loading ? "Testing..." : "Test Validate API"}
          </Button>
          
          {response && (
            <div>
              <label className="text-sm font-medium block mb-1">Response</label>
              <Textarea 
                value={response}
                readOnly
                className="font-mono text-xs h-40"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTester;

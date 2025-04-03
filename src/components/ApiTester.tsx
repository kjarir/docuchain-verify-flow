
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ValidationBlock from "@/components/ValidationBlock";
import { AlertCircle, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiTesterProps {
  apiKey: string;
  baseUrl: string;
}

const ApiTester = ({ apiKey, baseUrl }: ApiTesterProps) => {
  const [documentId, setDocumentId] = useState("0x1234567890abcdef1234567890abcdef");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

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
      
      // Set validation result for visual display
      if (res.ok) {
        setValidationResult({
          status: data.valid ? "verified" : "failed",
          documentId: data.documentId,
          timestamp: data.timestamp,
          blockNumber: data.blockNumber,
          transactionHash: data.transactionHash
        });
        toast.success("API request successful");
      } else {
        toast.error(`API request failed: ${data.message || 'Unknown error'}`);
        setValidationResult(null);
      }
    } catch (error) {
      console.error("API test error:", error);
      setResponse(JSON.stringify({ error: "Failed to send request" }, null, 2));
      toast.error("Failed to send API request");
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurlCommand = () => {
    return `curl -X POST "${baseUrl}/api/validate" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"documentId": "${documentId}"}'`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(err => toast.error("Failed to copy: " + err));
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
        <Alert className="mb-4 border-amber-300 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Our API is currently running in-browser and can only be tested using this interface. 
            External HTTP requests (like curl) will not work.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Document ID</label>
            <div className="flex gap-2">
              <Input 
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Enter document ID"
                className="flex-1"
              />
              <Button 
                onClick={handleTestValidate}
                disabled={loading || !apiKey}
                className="bg-gradient-blockchain hover:opacity-90"
              >
                {loading ? "Testing..." : "Test Validate API"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Note: Document IDs starting with "0x" will be validated as legitimate.
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">cURL Command (for reference)</label>
            <div className="relative">
              <Textarea 
                value={getCurlCommand()}
                readOnly
                className="font-mono text-xs pr-10"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getCurlCommand())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {validationResult && (
            <div>
              <label className="text-sm font-medium block mb-3">Validation Result</label>
              <ValidationBlock {...validationResult} />
            </div>
          )}
          
          {response && (
            <div>
              <label className="text-sm font-medium block mb-1">Raw Response</label>
              <div className="relative">
                <Textarea 
                  value={response}
                  readOnly
                  className="font-mono text-xs h-40 pr-10"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(response)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTester;

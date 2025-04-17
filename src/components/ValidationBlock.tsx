import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ValidationBlockProps {
  status: string;
  documentId: string;
  signature: string;
  issuer: string;
  timestamp: string;
  title?: string;
  content?: any;
  blockNumber?: string;
  transactionHash?: string;
  onDownload: () => void;
  onView: () => void;
  children?: React.ReactNode;
}

const ValidationBlock: React.FC<ValidationBlockProps> = ({
  status,
  documentId,
  signature,
  issuer,
  timestamp,
  title,
  content,
  blockNumber,
  transactionHash,
  onDownload,
  onView,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'Document Verified'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Verification Failed'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'Pending Verification'
        };
    }
  };

  const formatTitle = (title: string) => {
    try {
      // Check if the title is a JSON string
      const parsed = JSON.parse(title);
      if (typeof parsed === 'object' && parsed.title) {
        return parsed.title;
      }
      return title;
    } catch {
      return title;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const shortenAddress = (address: string) => {
    if (address.length > 10) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const formattedTitle = title ? formatTitle(title) : '';

  return (
    <Card className={cn("border-2", statusConfig.borderColor)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-5 w-5", statusConfig.color)} />
              <h3 className={cn("text-lg font-semibold", statusConfig.color)}>
                {statusConfig.text}
              </h3>
            </div>
            <div className="space-x-2">
              <Button 
                onClick={onDownload} 
                variant="outline"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                onClick={onView}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
            </div>
          </div>

          <div className={cn("p-4 rounded-lg space-y-3", statusConfig.bgColor)}>
            {formattedTitle && (
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700 min-w-[120px]">Title:</span>
                <div className="text-gray-900 text-right flex-1 ml-4 break-words">
                  {formattedTitle}
                </div>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 min-w-[120px]">Document ID:</span>
              <div className="text-gray-900 font-mono text-sm text-right flex-1 ml-4 break-all">
                {documentId}
              </div>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 min-w-[120px]">Issuer:</span>
              <div className="text-gray-900 font-mono text-sm text-right flex-1 ml-4">
                {issuer.startsWith('0x') ? shortenAddress(issuer) : issuer}
              </div>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 min-w-[120px]">Timestamp:</span>
              <div className="text-gray-900 text-right flex-1 ml-4">
                {formatDate(timestamp)}
              </div>
            </div>
            {blockNumber && (
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700 min-w-[120px]">Block Number:</span>
                <div className="text-gray-900 font-mono text-sm text-right flex-1 ml-4">
                  {blockNumber}
                </div>
              </div>
            )}
            {transactionHash && (
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700 min-w-[120px]">Transaction:</span>
                <div className="text-gray-900 font-mono text-sm text-right flex-1 ml-4 break-all">
                  {transactionHash}
                </div>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 min-w-[120px]">Signature:</span>
              <div className="text-gray-900 font-mono text-sm text-right flex-1 ml-4 break-all">
                {signature}
              </div>
            </div>
          </div>

          {content && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-700">Additional Details</h4>
              <pre className="text-sm overflow-auto bg-white p-3 rounded border">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationBlock;

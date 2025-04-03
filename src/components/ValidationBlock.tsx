
import { Check, Clock, AlertTriangle } from "lucide-react";

type ValidationStatus = "verified" | "pending" | "failed";

interface ValidationBlockProps {
  status: ValidationStatus;
  documentId: string;
  timestamp: string;
  blockNumber?: string;
  transactionHash?: string;
}

const ValidationBlock = ({
  status,
  documentId,
  timestamp,
  blockNumber,
  transactionHash,
}: ValidationBlockProps) => {
  const getStatusContent = () => {
    switch (status) {
      case "verified":
        return {
          icon: <Check className="text-green-500" />,
          text: "Verified",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
        };
      case "pending":
        return {
          icon: <Clock className="text-amber-500" />,
          text: "Pending",
          bgColor: "bg-amber-100",
          borderColor: "border-amber-200",
        };
      case "failed":
        return {
          icon: <AlertTriangle className="text-red-500" />,
          text: "Failed",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: <Clock className="text-gray-500" />,
          text: "Unknown",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div
      className={`rounded-lg ${statusContent.bgColor} ${statusContent.borderColor} border p-5 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {statusContent.icon}
          <span className="font-medium">{statusContent.text}</span>
        </div>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Document ID:</span>
          <span className="font-mono font-medium truncate max-w-[200px]">
            {documentId}
          </span>
        </div>

        {blockNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Block Number:</span>
            <span className="font-mono font-medium">{blockNumber}</span>
          </div>
        )}

        {transactionHash && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TX Hash:</span>
            <span className="font-mono font-medium truncate max-w-[200px]">
              {transactionHash}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationBlock;

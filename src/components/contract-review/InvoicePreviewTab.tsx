import { AlertTriangle, Download } from "lucide-react";
import type { Address, InvoiceData, LineItem } from "@/data/mock-contracts";
import { InvoicePDFPreview } from "./InvoicePDFPreview";

interface InvoicePreviewTabProps {
  lineItems: LineItem[];
  invoiceData: InvoiceData;
  customerName: string;
  contractId: string;
  billingAddress: Address;
  onNavigateToReview?: () => void;
}

export function InvoicePreviewTab({
  lineItems,
  invoiceData,
  customerName,
  contractId,
  billingAddress,
  onNavigateToReview,
}: InvoicePreviewTabProps) {
  const unmappedCount = lineItems.filter((i) => i.mappingStatus === "needs_mapping").length;
  const hasUnresolved = unmappedCount > 0;

  return (
    <div className="flex flex-col items-center px-6">
      {/* Toolbar - same width as invoice */}
      <div className="flex w-full max-w-3xl items-center justify-between gap-3 py-3">
        {/* Warning banner or empty space */}
        {hasUnresolved ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5">
            <AlertTriangle size={13} className="shrink-0 text-amber-600" />
            <p className="min-w-0 flex-1 truncate text-[12px] text-amber-800">
              <span className="font-medium">{unmappedCount} item{unmappedCount > 1 ? "s" : ""}</span> need{unmappedCount === 1 ? "s" : ""} resolution
            </p>
            {onNavigateToReview && (
              <button
                type="button"
                onClick={onNavigateToReview}
                className="shrink-0 text-[12px] font-medium text-amber-700 underline-offset-2 hover:underline"
              >
                Resolve
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Download button */}
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <Download size={13} />
          Download
        </button>
      </div>

      {/* PDF Preview Container */}
      <div className="w-full overflow-auto rounded-xl bg-gray-100 p-6">
        <InvoicePDFPreview
          invoiceId={invoiceData.invoiceId}
          invoiceDate={invoiceData.invoiceDate}
          dueDate={invoiceData.dueDate}
          status={invoiceData.status}
          lineItems={lineItems}
          customerName={customerName}
          contractId={contractId}
          billingAddress={billingAddress}
          zoom={100}
          onUnresolvedItemClick={onNavigateToReview}
        />
      </div>
    </div>
  );
}

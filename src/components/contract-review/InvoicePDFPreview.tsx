import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import type { Address, LineItem } from "@/data/mock-contracts";
import { cn, formatCurrency } from "@/lib/utils";

function WarningTooltip({
  children,
  content,
  onClick,
}: {
  children: React.ReactNode;
  content: string;
  onClick?: () => void;
}) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      setPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    }
    setShow(true);
  };

  return (
    <div
      ref={setRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
      onClick={onClick}
      className={cn("inline-flex", onClick && "cursor-pointer")}
    >
      {children}
      {show &&
        createPortal(
          <div
            className="fixed z-[9999] -translate-x-1/2 -translate-y-full rounded-lg bg-red-600 px-3 py-2 text-[12px] text-white shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {content}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-red-600" />
          </div>,
          document.body
        )}
    </div>
  );
}

interface InvoicePDFPreviewProps {
  invoiceId: string;
  invoiceDate: string;
  dueDate: string;
  status: "Draft" | "Posted";
  lineItems: LineItem[];
  customerName: string;
  contractId: string;
  billingAddress: Address;
  zoom: number;
  onUnresolvedItemClick?: () => void;
}

export function InvoicePDFPreview({
  invoiceId,
  invoiceDate,
  dueDate,
  status,
  lineItems,
  customerName,
  contractId,
  billingAddress,
  zoom,
  onUnresolvedItemClick,
}: InvoicePDFPreviewProps) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Math.round(subtotal * 0.0875);
  const total = subtotal + tax;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white shadow-sm"
      style={{ zoom: zoom / 100 }}
    >
      <div className="min-h-[640px] p-8 font-sans text-[13px] leading-relaxed text-gray-900">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between border-b border-gray-200 pb-5">
          <div>
            <p className="text-[18px] font-bold tracking-tight text-[#012A38]">APEX</p>
            <p className="mt-0.5 text-[11px] text-gray-500">Your Company Name</p>
            <p className="text-[11px] text-gray-500">123 Business St, Suite 100</p>
            <p className="text-[11px] text-gray-500">San Francisco, CA 94104</p>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-bold uppercase tracking-widest text-gray-400">
              Invoice
            </p>
            <div className="mt-2 inline-block rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-left">
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                <span className="text-[11px] text-gray-500">Invoice #</span>
                <span className="text-[11px] font-semibold text-gray-900">{invoiceId}</span>
                <span className="text-[11px] text-gray-500">Date</span>
                <span className="text-[11px] font-semibold">{formatDate(invoiceDate)}</span>
                <span className="text-[11px] text-gray-500">Due Date</span>
                <span className="text-[11px] font-semibold text-amber-700">
                  {formatDate(dueDate)}
                </span>
                <span className="text-[11px] text-gray-500">Status</span>
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    status === "Posted" ? "text-emerald-600" : "text-amber-600"
                  )}
                >
                  {status || "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To / Reference */}
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Bill To
            </p>
            <p className="font-semibold text-gray-900">{customerName}</p>
            <p className="text-[12px] text-gray-600">{billingAddress.line1}</p>
            {billingAddress.line2 && (
              <p className="text-[12px] text-gray-600">{billingAddress.line2}</p>
            )}
            <p className="text-[12px] text-gray-600">
              {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
            </p>
            <p className="text-[12px] text-gray-600">{billingAddress.country}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Reference
            </p>
            <p className="text-[12px] text-gray-600">
              Contract: <span className="font-medium text-gray-900">{contractId}</span>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b-2 border-[#012A38]">
              <th className="pb-2 text-left font-semibold text-gray-600">Description</th>
              <th className="pb-2 text-center font-semibold text-gray-600">Qty</th>
              <th className="pb-2 text-right font-semibold text-gray-600">Unit Price</th>
              <th className="pb-2 text-right font-semibold text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => {
              const needsMapping = item.mappingStatus === "needs_mapping";
              return (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2.5 pr-4 text-gray-900">
                    <div className="flex items-center gap-1.5">
                      {needsMapping && (
                        <WarningTooltip
                          content="Item not mapped. Click to resolve."
                          onClick={onUnresolvedItemClick}
                        >
                          <AlertTriangle
                            size={14}
                            className="shrink-0 text-red-500 hover:text-red-600"
                          />
                        </WarningTooltip>
                      )}
                      <span className={cn(needsMapping && "text-red-600")}>{item.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">{item.frequency}</div>
                  </td>
                  <td className="py-2.5 text-center tabular-nums text-gray-600">{item.quantity}</td>
                  <td className="py-2.5 text-right tabular-nums text-gray-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-gray-900">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 flex flex-col items-end gap-1 border-t border-gray-200 pt-4">
          <div className="flex w-56 items-center justify-between text-[12px]">
            <span className="text-gray-600">Subtotal</span>
            <span className="tabular-nums font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex w-56 items-center justify-between text-[12px]">
            <span className="text-gray-600">Tax (8.75%)</span>
            <span className="tabular-nums font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex w-56 items-center justify-between border-t border-gray-200 pt-2 text-[14px]">
            <span className="font-bold text-gray-900">Total Due</span>
            <span className="tabular-nums font-bold text-[#012A38]">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-[11px] text-gray-500">
          <p className="font-medium text-gray-600">Payment Instructions</p>
          <p className="mt-0.5">Please make payment via ACH or Wire transfer.</p>
        </div>
      </div>
    </div>
  );
}

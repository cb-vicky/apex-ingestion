import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { BillingInfo } from "@/data/mock-contracts";
import { cn } from "@/lib/utils";

function InlineEditField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
          className="w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none ring-2 ring-blue-100"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={cn(
            "w-full cursor-text rounded-md px-3 py-2 text-[13px] transition-all",
            value ? "text-gray-900" : "text-gray-400",
            isHovered ? "bg-gray-100 ring-1 ring-gray-200" : "bg-transparent"
          )}
        >
          {value || placeholder || "—"}
        </div>
      )}
    </div>
  );
}

function InlineSelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[13px] text-gray-900 transition-all",
          isOpen
            ? "border border-blue-400 bg-white ring-2 ring-blue-100"
            : isHovered
              ? "bg-gray-100 ring-1 ring-gray-200"
              : "bg-transparent"
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-gray-50",
                value === option.value ? "font-medium text-blue-600" : "text-gray-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BillingInfoTable({
  data,
  onChange,
}: {
  data: BillingInfo;
  onChange: (data: BillingInfo) => void;
}) {
  const labelClasses =
    "flex items-center bg-gray-100 px-4 py-3 text-[13px] font-medium text-gray-600";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-2">
        {/* Row 1 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Term</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.term}
            onChange={(v) => onChange({ ...data, term: v })}
          />
        </div>

        {/* Row 2 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Billing cycle</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.billingCycle}
            onChange={(v) => onChange({ ...data, billingCycle: v })}
          />
        </div>

        {/* Row 3 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Start date</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.startDate}
            onChange={(v) => onChange({ ...data, startDate: v })}
          />
        </div>

        {/* Row 4 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Auto collection</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineSelectField
            value={data.autoCollection}
            onChange={(v) => onChange({ ...data, autoCollection: v as BillingInfo["autoCollection"] })}
            options={[
              { value: "Use customer's settings", label: "Use customer's settings" },
              { value: "On", label: "On" },
              { value: "Off", label: "Off" },
            ]}
          />
        </div>

        {/* Row 5 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>PO number</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.poNumber}
            onChange={(v) => onChange({ ...data, poNumber: v })}
            placeholder="Enter PO number"
          />
        </div>

        {/* Row 6 */}
        <div className={`${labelClasses} border-r border-gray-100`}>Payment terms</div>
        <div className="flex items-center px-2">
          <InlineSelectField
            value={data.paymentTerms}
            onChange={(v) => onChange({ ...data, paymentTerms: v })}
            options={[
              { value: "Net 15", label: "Net 15" },
              { value: "Net 30", label: "Net 30" },
              { value: "Net 45", label: "Net 45" },
              { value: "Net 60", label: "Net 60" },
              { value: "Due on receipt", label: "Due on receipt" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

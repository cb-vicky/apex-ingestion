import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import type { LineItem } from "@/data/mock-contracts";
import { cn, formatCurrency } from "@/lib/utils";

const FREQUENCY_OPTIONS = ["Monthly", "Quarterly", "Yearly", "One-time"];
const QUANTITY_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 25, 50, 100];

const PRODUCT_CATALOG = [
  { name: "Growth CRM", family: "CRM Products" },
  { name: "Enterprise CRM", family: "CRM Products" },
  { name: "Sales Cloud", family: "CRM Products" },
  { name: "Onboarding & Training", family: "Professional Services" },
  { name: "Implementation Services", family: "Professional Services" },
  { name: "Data Migration", family: "Professional Services" },
  { name: "Premium Support Add-on", family: "Support Plans" },
  { name: "24/7 Support", family: "Support Plans" },
  { name: "Dedicated CSM", family: "Support Plans" },
  { name: "Apex Platform – Growth", family: "Platform Licenses" },
  { name: "Apex Platform – Enterprise", family: "Platform Licenses" },
  { name: "API Access", family: "Add-ons" },
  { name: "Custom Integrations", family: "Add-ons" },
];

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    }
    setShow(true);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
      className="inline-flex"
    >
      {children}
      {show &&
        createPortal(
          <div
            className="fixed z-[9999] -translate-x-1/2 -translate-y-full rounded-lg bg-gray-900 px-3 py-2 text-[12px] text-white shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {content}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>,
          document.body
        )}
    </div>
  );
}

function ItemNameCell({
  value,
  needsMapping,
  onChange,
}: {
  value: string;
  needsMapping: boolean;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [open]);

  const buttonContent = (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => setOpen((o) => !o)}
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-left text-[13px] font-semibold transition-colors",
        needsMapping
          ? "text-red-700 hover:border-red-200 hover:bg-red-50"
          : "text-gray-900 hover:border-gray-200 hover:bg-gray-50",
        open && (needsMapping ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50")
      )}
    >
      <span>{value}</span>
      {needsMapping && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
      <ChevronDown size={12} className="shrink-0 text-gray-400" />
    </button>
  );

  return (
    <>
      {needsMapping ? (
        <Tooltip content="Item not mapped to product catalog. Click to resolve.">
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] max-h-[300px] w-[280px] overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
            style={{ top: position.top, left: position.left }}
          >
            {PRODUCT_CATALOG.map((product) => (
              <button
                key={product.name}
                type="button"
                onClick={() => {
                  onChange(product.name);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full flex-col items-start px-3 py-2 text-left hover:bg-gray-100",
                  product.name === value && "bg-blue-50"
                )}
              >
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    product.name === value ? "text-blue-700" : "text-gray-900"
                  )}
                >
                  {product.name}
                </span>
                <span className="text-[11px] text-gray-500">Family: {product.family}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

function EditableCell({
  value,
  options,
  onChange,
  align = "left",
}: {
  value: string | number;
  options: (string | number)[];
  onChange: (val: string | number) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-[13px] transition-colors hover:border-gray-200 hover:bg-gray-50",
          align === "right" && "justify-end",
          open && "border-blue-200 bg-blue-50"
        )}
      >
        <span className={cn(align === "right" && "tabular-nums")}>{value}</span>
        <ChevronDown size={12} className="shrink-0 text-gray-400" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] min-w-[100px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
            style={{
              top: position.top,
              ...(align === "right" ? { right: position.right } : { left: position.left }),
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3 py-1.5 text-left text-[13px] hover:bg-gray-100",
                  opt === value && "bg-blue-50 font-medium text-blue-700"
                )}
              >
                {opt}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

export function LineItemsTable({
  items,
  onChange,
}: {
  items: LineItem[];
  onChange?: (items: LineItem[]) => void;
}) {
  const handleItemChange = (itemId: string, field: keyof LineItem, value: string | number) => {
    if (!onChange) return;
    const updated = items.map((item) => {
      if (item.id !== itemId) return item;
      const newItem = { ...item, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        newItem.totalPrice = newItem.quantity * newItem.unitPrice;
      }
      if (field === "name") {
        newItem.mappingStatus = "mapped";
      }
      return newItem;
    });
    onChange(updated);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-gray-100">
            <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 font-semibold">Frequency</th>
              <th className="px-4 py-3 text-right font-semibold">Qty</th>
              <th className="px-4 py-3 text-right font-semibold">Unit price</th>
              <th className="px-4 py-3 text-right font-semibold">Total price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="group">
                <td className="px-2 py-2">
                  <ItemNameCell
                    value={item.name}
                    needsMapping={item.mappingStatus === "needs_mapping"}
                    onChange={(name) => handleItemChange(item.id, "name", name)}
                  />
                </td>
                <td className="px-2 py-2">
                  <EditableCell
                    value={item.frequency}
                    options={FREQUENCY_OPTIONS}
                    onChange={(val) => handleItemChange(item.id, "frequency", val)}
                  />
                </td>
                <td className="px-2 py-2 text-right">
                  <EditableCell
                    value={item.quantity}
                    options={QUANTITY_OPTIONS}
                    onChange={(val) => handleItemChange(item.id, "quantity", val)}
                    align="right"
                  />
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-900">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">
                  {formatCurrency(item.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

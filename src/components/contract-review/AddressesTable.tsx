import { useState, useRef, useEffect } from "react";
import type { Address } from "@/data/mock-contracts";
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
          className="w-full rounded-md border border-blue-400 bg-white px-3 py-1.5 text-[13px] text-gray-900 outline-none ring-2 ring-blue-100"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={cn(
            "w-full cursor-text rounded-md px-3 py-1.5 text-[13px] transition-all",
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

function AddressBlock({
  address,
  onChange,
}: {
  address: Address;
  onChange: (addr: Address) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <InlineEditField
        value={address.line1}
        onChange={(v) => onChange({ ...address, line1: v })}
        placeholder="Address line 1"
      />
      <InlineEditField
        value={address.line2 || ""}
        onChange={(v) => onChange({ ...address, line2: v })}
        placeholder="Address line 2"
      />
      <div className="grid grid-cols-2 gap-1">
        <InlineEditField
          value={address.city}
          onChange={(v) => onChange({ ...address, city: v })}
          placeholder="City"
        />
        <InlineEditField
          value={address.state}
          onChange={(v) => onChange({ ...address, state: v })}
          placeholder="State"
        />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <InlineEditField
          value={address.postalCode}
          onChange={(v) => onChange({ ...address, postalCode: v })}
          placeholder="Postal code"
        />
        <InlineEditField
          value={address.country}
          onChange={(v) => onChange({ ...address, country: v })}
          placeholder="Country"
        />
      </div>
    </div>
  );
}

export function AddressesTable({
  billing,
  shipping,
  sameAsBilling,
  onBillingChange,
  onShippingChange,
  onSameAsBillingChange,
}: {
  billing: Address;
  shipping: Address;
  sameAsBilling: boolean;
  onBillingChange: (addr: Address) => void;
  onShippingChange: (addr: Address) => void;
  onSameAsBillingChange: (same: boolean) => void;
}) {
  const shippingDisplay = sameAsBilling ? billing : shipping;
  const labelClasses =
    "flex items-start bg-gray-50/80 px-4 py-3 text-[13px] font-medium text-gray-600";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-2">
        {/* Billing Address */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Billing</div>
        <div className="border-b border-gray-100 px-2 py-2">
          <AddressBlock address={billing} onChange={onBillingChange} />
        </div>

        {/* Shipping Address */}
        <div className={`${labelClasses} border-r border-gray-100`}>Shipping</div>
        <div className="px-2 py-2">
          <label className="mb-2 flex items-center gap-2 px-3 py-1 text-[13px] font-medium text-gray-900">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => onSameAsBillingChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            Same as billing address
          </label>

          {!sameAsBilling && (
            <AddressBlock address={shippingDisplay} onChange={onShippingChange} />
          )}
        </div>
      </div>
    </div>
  );
}

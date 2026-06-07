import { useState, useRef, useEffect } from "react";
import type { CustomerDetails } from "@/data/mock-contracts";
import { cn } from "@/lib/utils";

function InlineEditField({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type={type}
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

export function CustomerDetailsTable({
  data,
  onChange,
}: {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}) {
  const labelClasses =
    "flex items-center bg-gray-50/80 px-4 py-3 text-[13px] font-medium text-gray-600";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-2">
        {/* Row 1 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Account name</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.accountName}
            onChange={(v) => onChange({ ...data, accountName: v })}
          />
        </div>

        {/* Row 2 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Legal entity</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.legalEntity}
            onChange={(v) => onChange({ ...data, legalEntity: v })}
          />
        </div>

        {/* Row 3 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Contact name</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.contactName}
            onChange={(v) => onChange({ ...data, contactName: v })}
          />
        </div>

        {/* Row 4 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Email</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.contactEmail}
            onChange={(v) => onChange({ ...data, contactEmail: v })}
            type="email"
          />
        </div>

        {/* Row 5 */}
        <div className={`${labelClasses} border-b border-r border-gray-100`}>Phone</div>
        <div className="flex items-center border-b border-gray-100 px-2">
          <InlineEditField
            value={data.contactPhone}
            onChange={(v) => onChange({ ...data, contactPhone: v })}
            type="tel"
          />
        </div>

        {/* Row 6 */}
        <div className={`${labelClasses} border-r border-gray-100`}>Industry</div>
        <div className="flex items-center px-2">
          <InlineEditField
            value={data.industry}
            onChange={(v) => onChange({ ...data, industry: v })}
          />
        </div>
      </div>
    </div>
  );
}

import { CircleCheck } from "lucide-react";

export function ReadyBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold leading-4 text-emerald-800">
      <CircleCheck size={12} strokeWidth={2.25} className="shrink-0 text-emerald-600" />
      Ready
    </span>
  );
}

export function NeedsMappingBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold leading-4 text-amber-800">
      {count} item{count === 1 ? "" : "s"} need mapping
    </span>
  );
}

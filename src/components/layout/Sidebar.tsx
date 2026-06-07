import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  ChartLine,
  Coins,
  Command,
  File,
  FileSignature,
  Home,
  List,
  Mail,
  MinusCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Search,
  Shield,
  Tag,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { navItems } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const PRODUCT_NAV_FULL_W = 210;
const PRODUCT_NAV_COLLAPSED_W = 48;
const STORAGE_KEY = "apex-360:nav-collapsed";

const ICONS: Record<string, LucideIcon> = {
  Home,
  Users,
  UserPlus,
  File,
  FileSignature,
  Receipt,
  MinusCircle,
  Coins,
  ChartLine,
  Mail,
  List,
  Tag,
  Shield,
  Activity,
  BarChart3,
  Zap,
};

function NavRow({
  label,
  icon: Icon,
  active,
  disabled,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "group/navrow relative flex w-full items-center gap-1.5 overflow-hidden rounded-md px-2 py-[6px] text-left font-sans text-[13px] font-normal leading-tight transition-[colors,font-weight] duration-150",
        disabled
          ? "cursor-not-allowed text-gray-400 opacity-55"
          : active
            ? "bg-gradient-to-r from-cb-orange/25 via-cb-orange/10 to-transparent font-bold text-cb-orange"
            : "text-gray-600 hover:bg-black/[0.06] hover:font-semibold hover:text-gray-900",
      )}
    >
      <Icon size={14} strokeWidth={active ? 2.25 : 2} aria-hidden className="shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

/**
 * Grey integrated product nav. Defaults to collapsed (48px), expands to 210px,
 * persisted in localStorage. Collapse/expand affordances appear on hover.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const width = collapsed ? PRODUCT_NAV_COLLAPSED_W : PRODUCT_NAV_FULL_W;

  return (
    <aside
      aria-label="Primary navigation"
      style={{ width }}
      className="group/sidebar relative z-[0] flex h-full shrink-0 flex-col overflow-hidden border-r border-gray-300 bg-grey-100 font-sora transition-[width] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col pt-5",
          collapsed ? "items-center overflow-hidden" : "overflow-y-auto pl-3",
        )}
      >
        <div className={cn("flex gap-1.5", collapsed ? "w-full flex-col items-center gap-0" : "items-center")}>
          <div
            className={cn(
              "rounded-md bg-transparent p-px",
              collapsed ? "w-8 shrink-0" : "min-w-0 flex-1",
            )}
          >
            <button
              type="button"
              aria-label="Go to"
              className={cn(
                "group/goto flex items-center gap-2 rounded-[5px] border border-black/[0.06] bg-white font-sans text-[13px] font-normal text-gray-700 transition-colors hover:bg-white",
                collapsed ? "h-8 w-8 shrink-0 justify-center gap-0 p-0" : "w-full px-2 py-[6px] text-left",
              )}
            >
              <Search size={14} strokeWidth={2} className="shrink-0 transition-colors group-hover/goto:text-cb-orange" aria-hidden />
              {!collapsed && (
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate">Go to</span>
                  <span className="flex shrink-0 items-center gap-px rounded border border-black/[0.1] px-1 py-0.5 text-[11px] font-normal leading-none text-[#9aa5ad]">
                    <Command size={11} strokeWidth={2} aria-hidden />
                    <span>K</span>
                  </span>
                </span>
              )}
            </button>
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="pointer-events-none flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 opacity-0 transition-[opacity,colors] duration-150 hover:bg-black/[0.06] hover:text-cb-orange group-hover/sidebar:pointer-events-auto group-hover/sidebar:opacity-100"
              title="Collapse navigation"
              aria-label="Collapse navigation"
            >
              <PanelLeftClose size={16} strokeWidth={2.25} aria-hidden />
            </button>
          )}
        </div>

        {collapsed ? (
          <div className="mt-3 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="pointer-events-none flex h-8 w-full items-center justify-center rounded-md text-gray-600 opacity-0 transition-[opacity,colors] duration-150 hover:bg-black/[0.06] hover:text-cb-orange group-hover/sidebar:pointer-events-auto group-hover/sidebar:opacity-100"
              title="Expand navigation"
              aria-label="Expand navigation"
            >
              <PanelLeftOpen size={16} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        ) : (
          <div className="mt-1 flex min-h-0 flex-1 flex-col font-sans">
            {navItems.map((item) => (
              <NavRow
                key={item.label}
                label={item.label}
                icon={ICONS[item.icon] ?? File}
                active={!item.disabled && Boolean(item.active)}
                disabled={item.disabled}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

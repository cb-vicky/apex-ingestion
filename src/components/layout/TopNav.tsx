import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bell,
  ChartLine,
  ChevronDown,
  Code2,
  Coins,
  File,
  FileSignature,
  HelpCircle,
  Home,
  Lightbulb,
  List,
  Mail,
  MinusCircle,
  Receipt,
  Search,
  Settings,
  Shield,
  Star,
  Tag,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { moreNavIds, navItems, primaryNavIds, type NavItem } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "apex-360:top-nav-visible";

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

function NavIconButton({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/[0.05] hover:text-gray-800"
    >
      {children}
    </button>
  );
}

function CbMark() {
  return (
    <svg width={13} height={13} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M12 7.88164V12H7.84264L3.97746 5.99453L12 7.88164Z" fill="#fff" />
      <path d="M5.15726 11.9336C3.66295 11.7338 2.3484 10.9788 1.41583 9.89102L3.97746 5.99453L5.15726 11.9336Z" fill="#fff" />
      <path d="M3.97746 5.99453L0.179895 7.34883C0.0563017 6.89369 0 6.41617 0 5.92773C0 5.48384 0.0560453 5.05101 0.145893 4.6293L3.97746 5.99453Z" fill="#fff" />
      <path d="M12 4.10742L3.97746 5.99453L7.84264 0H12V4.10742Z" fill="#fff" />
      <path d="M3.97746 5.99453L1.41583 2.09805C2.3484 1.01018 3.66292 0.266382 5.15726 0.0554688L3.97746 5.99453Z" fill="#fff" />
    </svg>
  );
}

function SiteRegionPopover({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-50"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900">Echo-corp</div>
          <div className="truncate text-[11px] text-gray-500">echocorp.test.chargebee.com</div>
        </div>
        <ChevronDown size={12} className="shrink-0 text-gray-400" />
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900">Germany</div>
          <div className="text-[11px] text-gray-500">Europe/Berlin (CET)</div>
        </div>
        <ChevronDown size={12} className="shrink-0 text-gray-400" />
      </button>
    </div>
  );
}

function TopNavItem({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const label = item.shortLabel ?? item.label;
  return (
    <button
      type="button"
      disabled={item.disabled}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-md px-2.5 py-1 font-sans text-[13px] font-normal transition-[colors,font-weight] duration-150",
        item.disabled
          ? "cursor-not-allowed text-gray-400 opacity-55"
          : active
            ? "font-bold text-cb-orange"
            : "text-gray-600 hover:bg-black/[0.04] hover:font-semibold hover:text-gray-900",
      )}
    >
      {label}
    </button>
  );
}

function useVisibleNavIds() {
  const [visibleIds, setVisibleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [...primaryNavIds];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleIds));
    } catch {
      /* ignore */
    }
  }, [visibleIds]);

  const swapFromMore = (itemId: string) => {
    setVisibleIds((prev) => {
      const next = [...prev];
      const lastIdx = next.length - 1;
      const moreIdx = next.indexOf(itemId);
      if (moreIdx >= 0) return next;
      next[lastIdx] = itemId;
      return next;
    });
  };

  const visibleItems = visibleIds
    .map((id) => navItems.find((n) => n.id === id))
    .filter((n): n is NavItem => n != null);

  const moreItems = moreNavIds
    .map((id) => navItems.find((n) => n.id === id))
    .filter((n): n is NavItem => n != null);

  return { visibleItems, moreItems, swapFromMore };
}

/** Grey top nav with product menu, site/region popover on logo hover, and utility icons. */
export function TopNav() {
  const [logoHover, setLogoHover] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeId, setActiveId] = useState("customers");
  const moreRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const { visibleItems, moreItems, swapFromMore } = useVisibleNavIds();

  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  return (
    <header
      className="relative z-30 flex h-9 shrink-0 items-center gap-2 bg-grey-100 px-3 font-sora"
      aria-label="Application header"
    >
      {/* Logo + site/region popover */}
      <div
        ref={logoRef}
        className="relative shrink-0"
        onMouseEnter={() => setLogoHover(true)}
        onMouseLeave={() => setLogoHover(false)}
      >
        <div className="squircle flex h-7 w-7 items-center justify-center rounded-[10px] bg-cb-orange">
          <CbMark />
        </div>
        <SiteRegionPopover open={logoHover} />
      </div>

      {/* Primary nav items */}
      <nav className="flex min-w-0 flex-1 items-center gap-0.5" aria-label="Product navigation">
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
          {visibleItems.map((item) => (
            <TopNavItem
              key={item.id}
              item={item}
              active={activeId === item.id}
              onClick={() => setActiveId(item.id)}
            />
          ))}
        </div>

        {/* More menu - outside overflow container */}
        <div ref={moreRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={cn(
              "flex items-center gap-0.5 rounded-md px-2 py-1 text-[13px] font-medium text-gray-600 transition-colors hover:bg-black/[0.04] hover:text-gray-900",
              moreOpen && "bg-black/[0.04] text-gray-900",
            )}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
          >
            More
            <ChevronDown size={12} className={cn("transition-transform", moreOpen && "rotate-180")} />
          </button>
          {moreOpen && (
            <div
              role="menu"
              className="absolute left-0 top-[calc(100%+6px)] z-[100] max-h-72 w-48 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            >
              {moreItems.map((item) => {
                const Icon = ICONS[item.icon] ?? File;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      if (!item.disabled) {
                        swapFromMore(item.id);
                        setActiveId(item.id);
                      }
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium transition-colors",
                      item.disabled
                        ? "cursor-not-allowed text-gray-400 opacity-55"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <Icon size={14} strokeWidth={2} aria-hidden className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Right utilities — search first */}
      <div className="flex shrink-0 items-center gap-1 text-gray-500">
        <NavIconButton label="Search">
          <Search size={15} />
        </NavIconButton>
        <NavIconButton label="Notifications">
          <Bell size={15} />
        </NavIconButton>
        <NavIconButton label="Settings">
          <Settings size={15} />
        </NavIconButton>
        <NavIconButton label="Developer">
          <Code2 size={15} />
        </NavIconButton>
        <NavIconButton label="Ideas">
          <Lightbulb size={15} />
        </NavIconButton>
        <NavIconButton label="Favorites">
          <Star size={15} />
        </NavIconButton>
        <NavIconButton label="Help">
          <HelpCircle size={15} />
        </NavIconButton>
        <div className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-cb-orange text-[10px] font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}

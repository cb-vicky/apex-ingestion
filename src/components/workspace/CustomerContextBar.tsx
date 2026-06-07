import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, ChevronRight, FileText, MoreHorizontal, RotateCcw, Trash2, X } from "lucide-react";
import {
  breadcrumbs,
  ingestionSubTabs,
  priorityChips,
  workflowTabs,
  type Customer,
  type IngestionStepStatus,
  type StageId,
} from "@/data/mock-data";
import { cn, formatCompactCurrency, formatShortDate } from "@/lib/utils";
import type { SourcePDF } from "@/components/contract-review/SummaryTab";

// ─────────────────────────────────────────────────────────────────────────────
// Trapezoidal tab shape constants — narrower top, wider bottom (file-folder look)
// ─────────────────────────────────────────────────────────────────────────────
const TOP_INSET = 18; // how much narrower the top is than the bottom (px)
const TOP_R = 10; // top corner radius
const TAB_BLUE = "#2563eb";
const TAB_BLUE_DARK = "#1d4ed8";
const PAGE_BG = "#f3f4f6";
const TAB_HOVER_BG = "#e9eaed";
const BORDER_GREY = "#d1d5db";

const TAB_OVERLAP_CLASS = "-ml-[22px]"; // negative margin so adjacent tabs overlap
const TAB_HEIGHT = { expanded: 62, collapsed: 30 } as const;
const TAB_MIN_WIDTH = 92;

// Inverted pill (hangs below the tab line — wider top, narrower bottom)
const PILL_INSET = 10;
const PILL_R = 8;
const CONTEXT_PILL_HEIGHT = 34;
const INGESTION_BAR_HEIGHT = 56;
const HEADER_TABS_GAP = { expanded: 12, collapsed: 10 } as const;

/** Trapezoid path — OPEN (no Z) so the bottom edge isn't stroked. */
function buildTabPath(W: number, H: number, inset = TOP_INSET, R = TOP_R): string {
  const L = Math.sqrt(inset * inset + H * H);
  const ux = inset / L;
  const uy = H / L;
  return [
    `M 0 ${H}`,
    `L ${inset - R * ux} ${R * uy}`,
    `Q ${inset} 0 ${inset + R} 0`,
    `L ${W - inset - R} 0`,
    `Q ${W - inset} 0 ${W - inset + R * ux} ${R * uy}`,
    `L ${W} ${H}`,
  ].join(" ");
}

/** Inverted trapezoid — OPEN (no Z) so the top edge isn't stroked. */
function buildInvertedPillPath(W: number, H: number, inset = PILL_INSET, R = PILL_R): string {
  const L = Math.sqrt(inset * inset + H * H);
  const ux = inset / L;
  const uy = H / L;
  return [
    `M 0 0`,
    `L ${inset - R * ux} ${H - R * uy}`,
    `Q ${inset} ${H} ${inset + R} ${H}`,
    `L ${W - inset - R} ${H}`,
    `Q ${W - inset} ${H} ${W - inset + R * ux} ${H - R * uy}`,
    `L ${W} 0`,
  ].join(" ");
}

function TabSVG({
  width,
  height,
  active,
  hovered,
  collapsed,
}: {
  width: number;
  height: number;
  active: boolean;
  hovered?: boolean;
  collapsed?: boolean;
}) {
  if (width < 10 || height < 10) return null;
  const path = buildTabPath(width, height);
  const fill = active ? (collapsed ? "#ffffff" : TAB_BLUE) : hovered ? TAB_HOVER_BG : PAGE_BG;
  const stroke = active && !collapsed ? TAB_BLUE_DARK : hovered ? "#9ca3af" : BORDER_GREY;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
    >
      <path d={path} fill={fill} stroke={stroke} strokeWidth={1} style={{ transition: "fill 160ms ease, stroke 160ms ease" }} />
    </svg>
  );
}

function InvertedPillSVG({ width, height }: { width: number; height: number }) {
  if (width < 10 || height < 10) return null;
  const path = buildInvertedPillPath(width, height);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
    >
      <path d={path} fill="rgba(255,255,255,0.85)" stroke={BORDER_GREY} strokeWidth={1} style={{ filter: "drop-shadow(0 4px 12px rgba(17,24,39,0.08))" }} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Workspace tab button — self-measuring so the SVG trapezoid matches its width
// ─────────────────────────────────────────────────────────────────────────────
function WorkspaceTabButton({
  label,
  active,
  collapsed,
  first,
  zIndex,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  collapsed: boolean;
  first: boolean;
  zIndex: number;
  disabled?: boolean;
  onClick: () => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);
  const tabHeight = collapsed ? TAB_HEIGHT.collapsed : TAB_HEIGHT.expanded;

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) setSize({ w: rect.width, h: rect.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label, collapsed]);

  return (
    <div
      className={cn("group/tab relative inline-flex shrink-0 transition-[height]", !first && TAB_OVERLAP_CLASS)}
      style={{ zIndex: active ? 100 : zIndex, height: tabHeight, transitionDuration: "280ms" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={innerRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && onClick()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) onClick();
        }}
        style={{ height: tabHeight }}
        className={cn(
          "relative inline-flex w-max max-w-[140px] items-center justify-center text-center transition-[height]",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          active && "cursor-default",
        )}
      >
        <TabSVG width={size.w} height={size.h} active={active} hovered={hovered && !disabled} collapsed={collapsed} />
        <span
          className="relative z-[2] flex w-full min-w-0 flex-col items-center justify-center overflow-hidden px-6 text-center"
          style={{ minWidth: TAB_MIN_WIDTH }}
        >
          <span
            className={cn(
              "w-full whitespace-nowrap text-center font-semibold leading-tight transition-all duration-200",
              collapsed ? "text-[12px]" : "text-[14px]",
              active && collapsed
                ? "text-blue-600"
                : active
                  ? "text-white"
                  : "text-slate-600 group-hover/tab:text-slate-800",
            )}
            style={{ fontFamily: "'Sora', 'Inter', sans-serif" }}
          >
            {label}
          </span>
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header sub-components
// ─────────────────────────────────────────────────────────────────────────────
function Breadcrumbs({ collapsed }: { collapsed: boolean }) {
  return (
    <nav
      className={cn(
        "flex w-full min-w-0 items-center gap-1 whitespace-nowrap leading-none text-text-muted transition-all duration-300 ease-out",
        collapsed ? "text-[11px]" : "text-[13px]",
      )}
    >
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <span key={`${crumb.label}-${idx}`} className="inline-flex items-center gap-1">
            {idx > 0 && <ChevronRight size={collapsed ? 10 : 12} className="text-text-muted/50" />}
            {crumb.href && !isLast ? (
              <a href={crumb.href} className="text-text-secondary underline-offset-2 transition-colors hover:text-text-primary hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span className={cn("font-medium", isLast ? "text-text-primary" : "text-text-secondary")}>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function CustomerTeamMeta({ customer, collapsed }: { customer: Customer; collapsed: boolean }) {
  return (
    <p
      className={cn(
        "shrink-0 whitespace-nowrap text-[12px] text-text-muted transition-all duration-300 ease-out",
        collapsed && "pointer-events-none opacity-0",
      )}
    >
      AE: {customer.ae}&ensp;·&ensp;CSM: {customer.csm}&ensp;·&ensp;Billing: {customer.billingOwner}
    </p>
  );
}

const PRIORITY_CHIP_TONE: Record<"red" | "amber", string> = {
  red: "border-red-200/90 bg-red-50 text-red-800",
  amber: "border-amber-200/90 bg-amber-50 text-amber-900",
};

function CustomerPriorityChips({ collapsed }: { collapsed: boolean }) {
  if (priorityChips.length === 0) return null;
  return (
    <div
      className={cn(
        "flex max-w-[58%] shrink-0 flex-wrap items-center justify-end gap-1.5 transition-all duration-300 ease-out",
        collapsed && "pointer-events-none opacity-0",
      )}
      aria-label="Customer priority signals"
    >
      {priorityChips.map((chip) => (
        <span
          key={chip.label}
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
            PRIORITY_CHIP_TONE[chip.severity],
          )}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Contract-ingestion sub-tab strip (document switcher + sequential flow tabs)
// ─────────────────────────────────────────────────────────────────────────────
function stepBadge(status: IngestionStepStatus, index: number): string {
  if (status === "complete") return "✓";
  if (status === "error") return "!";
  return String(index + 1);
}

type ContractStatus = "in-review" | "awaiting-data" | "on-hold" | "needs-clarification";

const CONTRACT_STATUSES: { id: ContractStatus; label: string; color: string; bgColor: string; borderColor: string }[] = [
  { id: "in-review", label: "In Review", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { id: "awaiting-data", label: "Awaiting Data", color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  { id: "on-hold", label: "On Hold", color: "text-gray-600", bgColor: "bg-gray-100", borderColor: "border-gray-300" },
  { id: "needs-clarification", label: "Needs Clarification", color: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
];

function IngestionTabPill({
  activeSubTab,
  onSubTabChange,
  hasUnresolvedItems = false,
  openPDFs = [],
  activePDF,
  onSelectPDF,
  onClosePDF,
}: {
  activeSubTab: string;
  onSubTabChange: (id: string) => void;
  hasUnresolvedItems?: boolean;
  openPDFs?: SourcePDF[];
  activePDF?: SourcePDF | null;
  onSelectPDF?: (pdf: SourcePDF | null) => void;
  onClosePDF?: (pdfId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ContractStatus>("in-review");
  const [hoveredPDF, setHoveredPDF] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const isPreviewInvoice = activeSubTab === "preview-invoice";
  const activeStatus = CONTRACT_STATUSES.find((s) => s.id === currentStatus)!;

  useEffect(() => {
    if (!menuOpen && !statusMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) setStatusMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, statusMenuOpen]);

  const handlePrimaryAction = () => {
    if (!isPreviewInvoice) onSubTabChange("preview-invoice");
  };

  const truncateName = (name: string, maxLen = 12) => {
    if (name.length <= maxLen) return name;
    return name.slice(0, maxLen) + "…";
  };

  const isMainContentActive = !activePDF;

  return (
    <div className="flex items-end justify-between px-6">
      {/* Left: sequential flow tabs + PDF tabs */}
      <div className="flex shrink-0 items-end">
        {/* Main ingestion tabs */}
        {ingestionSubTabs.map((tab, idx) => {
          const isActive = isMainContentActive && activeSubTab === tab.id;
          return (
            <Fragment key={tab.id}>
              <button
                type="button"
                onClick={() => {
                  if (!tab.disabled) {
                    onSubTabChange(tab.id);
                    onSelectPDF?.(null);
                  }
                }}
                disabled={tab.disabled}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 pb-2.5 pt-2 font-sora text-[13px] font-semibold transition-all",
                  tab.disabled && "cursor-not-allowed opacity-40",
                  isActive
                    ? "text-blue-700"
                    : tab.status === "complete"
                      ? "text-emerald-600 hover:text-emerald-700"
                      : "text-slate-500 hover:text-slate-700",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : tab.status === "complete"
                        ? "bg-emerald-100 text-emerald-600"
                        : tab.status === "error"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-200 text-gray-500",
                  )}
                >
                  {stepBadge(tab.status, idx)}
                </span>
                <span>{tab.label}</span>
                {/* Active indicator - thick underline flush with bottom */}
                {isActive && (
                  <span className="absolute bottom-0 left-1 right-1 h-[3px] rounded-t-full bg-blue-600" />
                )}
              </button>
            </Fragment>
          );
        })}

        {/* PDF tabs */}
        {openPDFs.map((pdf) => {
          const isActive = activePDF?.id === pdf.id;
          const isHovered = hoveredPDF === pdf.id;
          return (
            <button
              key={pdf.id}
              type="button"
              onClick={() => onSelectPDF?.(pdf)}
              onMouseEnter={() => setHoveredPDF(pdf.id)}
              onMouseLeave={() => setHoveredPDF(null)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 pb-2.5 pt-2 font-sora text-[13px] font-semibold transition-all",
                isActive ? "text-blue-700" : "text-slate-500 hover:text-slate-700",
              )}
            >
              <FileText size={14} className={isActive ? "text-blue-600" : "text-slate-400"} />
              <span>{truncateName(pdf.name)}</span>
              {/* Close button - only show on hover */}
              {isHovered && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClosePDF?.(pdf.id);
                  }}
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded text-slate-400 hover:bg-gray-200 hover:text-slate-600"
                >
                  <X size={12} />
                </span>
              )}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-1 right-1 h-[3px] rounded-t-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right: status + action area - no housing */}
      <div className="flex items-end gap-3">
        {/* Status selector */}
        <div ref={statusMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setStatusMenuOpen((o) => !o)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-t-lg rounded-b-none border border-b-0 px-3 text-[12px] font-medium transition-colors",
              activeStatus.borderColor,
              activeStatus.bgColor,
              activeStatus.color,
              "hover:opacity-90"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus.color.replace("text-", "bg-"))} />
            {activeStatus.label}
            <ChevronDown size={14} className={cn("transition-transform", statusMenuOpen && "rotate-180")} />
          </button>
          {statusMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              {CONTRACT_STATUSES.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => {
                    setCurrentStatus(status.id);
                    setStatusMenuOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-gray-50",
                    currentStatus === status.id ? status.color : "text-gray-700"
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", status.color.replace("text-", "bg-"))} />
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA buttons - sitting on the line */}
        <div className="flex items-end gap-1">
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isPreviewInvoice && hasUnresolvedItems}
            className={cn(
              "flex h-8 items-center rounded-t-lg rounded-b-none px-4 font-sora text-[13px] font-semibold transition-colors",
              isPreviewInvoice && hasUnresolvedItems
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isPreviewInvoice ? "Send for approval" : "Preview"}
          </button>
          <div ref={menuRef} className="relative flex h-8 items-center">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="More actions"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-t-lg rounded-b-none text-slate-500 transition-colors hover:bg-gray-200 hover:text-slate-700",
                menuOpen && "bg-gray-200 text-slate-700",
              )}
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+6px)] z-30 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-slate-700 hover:bg-gray-100"
                >
                  <RotateCcw size={14} strokeWidth={2} />
                  Restart Ingestion
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} strokeWidth={2} />
                  Discard Contract
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic context info pill (used for non-ingestion stages)
// ─────────────────────────────────────────────────────────────────────────────
function ContextInfoPill({ stage, customer }: { stage: StageId; customer: Customer }) {
  const pillRef = useRef<HTMLDivElement>(null);
  const [pillWidth, setPillWidth] = useState(0);

  useEffect(() => {
    setPillWidth(0);
    const raf = requestAnimationFrame(() => {
      if (pillRef.current) setPillWidth(pillRef.current.offsetWidth);
    });
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  let content: ReactNode = null;
  switch (stage) {
    case "customer":
      content = (
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">ARR</span>
            <span className="text-[12px] font-semibold text-slate-700">{formatCompactCurrency(customer.arr)}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Renewal</span>
            <span className="text-[12px] font-medium text-slate-600">{formatShortDate(customer.nextRenewalDate)}</span>
          </span>
        </span>
      );
      break;
    default:
      content = (
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {workflowTabs.find((t) => t.id === stage)?.label ?? stage}
          </span>
          <span className="text-[12px] font-medium text-slate-600">Placeholder</span>
        </span>
      );
  }

  return (
    <div ref={pillRef} className="relative inline-flex items-center justify-center" style={{ height: CONTEXT_PILL_HEIGHT, minWidth: 120 }}>
      <InvertedPillSVG width={pillWidth} height={CONTEXT_PILL_HEIGHT} />
      <span className="relative z-10 px-4 py-1.5">{content}</span>
    </div>
  );
}

function ActionsPillWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CustomerContextBar
// ─────────────────────────────────────────────────────────────────────────────
export function CustomerContextBar({
  customer,
  activeStage,
  onStageChange,
  collapsed,
  ingestionSubTab,
  onIngestionSubTabChange,
  hasUnresolvedItems = false,
  openPDFs = [],
  activePDF,
  onSelectPDF,
  onClosePDF,
}: {
  customer: Customer;
  activeStage: StageId;
  onStageChange: (s: StageId) => void;
  collapsed: boolean;
  ingestionSubTab: string;
  onIngestionSubTabChange: (id: string) => void;
  hasUnresolvedItems?: boolean;
  openPDFs?: SourcePDF[];
  activePDF?: SourcePDF | null;
  onSelectPDF?: (pdf: SourcePDF | null) => void;
  onClosePDF?: (pdfId: string) => void;
}) {
  const isIngestion = activeStage === "ingestion";
  const gap = collapsed ? HEADER_TABS_GAP.collapsed : HEADER_TABS_GAP.expanded;
  const hangingHeight = (isIngestion ? INGESTION_BAR_HEIGHT : CONTEXT_PILL_HEIGHT) + 1 + gap;

  return (
    <div className="sticky top-0 z-20 bg-transparent">
      <div
        className={cn(
          "transition-[background-color,backdrop-filter] duration-300 ease-out",
          collapsed && "bg-gray-100/75 backdrop-blur-md backdrop-saturate-150",
        )}
      >
        <div
          className="flex flex-col gap-1 pl-7 pr-8 transition-all duration-300 ease-out"
          style={{
            paddingTop: collapsed ? 8 : 18,
            paddingBottom: collapsed ? 10 : 16,
          }}
        >
          {/* Breadcrumb + team meta */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Breadcrumbs collapsed={collapsed} />
            </div>
            <CustomerTeamMeta customer={customer} collapsed={collapsed} />
          </div>
          {/* Customer name + priority chips */}
          <div className="flex items-center justify-between gap-4">
            <h1
              className="min-w-0 flex-1 truncate font-bold leading-tight tracking-tight text-text-primary transition-all duration-300 ease-out"
              style={{ fontSize: collapsed ? 16 : 28 }}
            >
              {customer.name}
            </h1>
            <CustomerPriorityChips collapsed={collapsed} />
          </div>
        </div>
      </div>

      {/* Tab strip */}
      <div
        className={cn(
          "relative -mt-px w-full min-w-0 overflow-x-clip overflow-y-visible transition-[background-color,backdrop-filter] duration-300 ease-out",
          collapsed && "bg-gray-100/75 backdrop-blur-md backdrop-saturate-150",
        )}
      >
        <div className="relative flex w-full min-w-0 items-end justify-center overflow-x-clip overflow-y-visible px-4">
          {workflowTabs.map((tab, idx) => {
            const isActive = activeStage === tab.id;
            return (
              <WorkspaceTabButton
                key={tab.id}
                label={tab.label}
                active={isActive}
                collapsed={collapsed}
                first={idx === 0}
                zIndex={isActive ? 50 : 10 - idx}
                disabled={tab.disabled}
                onClick={() => onStageChange(tab.id)}
              />
            );
          })}
          {/* "More" affordance */}
          <button
            type="button"
            className={cn("group/more relative ml-1 inline-flex shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-black/[0.05] hover:text-slate-700")}
            style={{ height: collapsed ? TAB_HEIGHT.collapsed : TAB_HEIGHT.expanded, width: 44 }}
            title="More"
            aria-label="More tabs"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Separator line below workflow tabs */}
      <div className="h-px w-full" style={{ background: BORDER_GREY }} />

      {isIngestion ? (
        <>
          {/* Ingestion bar with blurred background and shadow */}
          <div className="relative w-full bg-gray-100/80 pt-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] backdrop-blur-md backdrop-saturate-150">
            <IngestionTabPill
              activeSubTab={ingestionSubTab}
              onSubTabChange={onIngestionSubTabChange}
              hasUnresolvedItems={hasUnresolvedItems}
              openPDFs={openPDFs}
              activePDF={activePDF}
              onSelectPDF={onSelectPDF}
              onClosePDF={onClosePDF}
            />
            {/* Edge-to-edge horizontal line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: BORDER_GREY }} />
          </div>
          {/* Spacer */}
          <div className="h-4" />
        </>
      ) : (
        <>
          <div className="relative">
            <div className="flex items-start justify-between px-6 pt-2">
              <ContextInfoPill stage={activeStage} customer={customer} />
              <ActionsPillWrapper>
                <button className="flex h-7 items-center rounded-md px-3 text-[12px] font-semibold text-slate-600 hover:bg-gray-100">
                  Action
                </button>
              </ActionsPillWrapper>
            </div>
          </div>
          {/* Spacer for the hanging pills */}
          <div className="transition-all duration-300 ease-out" style={{ height: hangingHeight }} />
        </>
      )}
    </div>
  );
}

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowRight, ChevronDown, ChevronRight, FileText, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { contractPDFs } from "@/components/contract-review/SummaryTab";
import { openPDFInNewWindow } from "@/lib/open-pdf";
import {
  ingestionSubTabs,
  priorityChips,
  workflowTabs,
  type Customer,
  type IngestionStepStatus,
  type StageId,
} from "@/data/mock-data";
import { cn, formatCompactCurrency, formatShortDate } from "@/lib/utils";

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

// Ingestion tab — work-in-progress purple tint (subtle when elsewhere, strong when active)
const INGESTION_WIP_SUBTLE_FILL = "#faf5ff";
const INGESTION_WIP_SUBTLE_HOVER = "#f3e8ff";
const INGESTION_WIP_SUBTLE_STROKE = "#e9d5ff";
const INGESTION_WIP_ACTIVE_FILL = "#9333ea";
const INGESTION_WIP_ACTIVE_STROKE = "#7e22ce";

type IngestionWipState = "subtle" | "active";

const TAB_OVERLAP_CLASS = "-ml-[8px]"; // small negative margin for minimal tab overlap
const TAB_HEIGHT = { expanded: 62, collapsed: 30 } as const;
const TAB_MIN_WIDTH = 110;

// Inverted pill (hangs below the tab line — wider top, narrower bottom)
const PILL_INSET = 10;
const PILL_R = 8;
const CONTEXT_PILL_HEIGHT = 34;
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
  ingestionWip,
}: {
  width: number;
  height: number;
  active: boolean;
  hovered?: boolean;
  collapsed?: boolean;
  ingestionWip?: IngestionWipState;
}) {
  if (width < 10 || height < 10) return null;
  const path = buildTabPath(width, height);

  let fill: string;
  let stroke: string;

  if (ingestionWip === "active") {
    fill = collapsed ? INGESTION_WIP_SUBTLE_FILL : INGESTION_WIP_ACTIVE_FILL;
    stroke = collapsed ? INGESTION_WIP_SUBTLE_STROKE : INGESTION_WIP_ACTIVE_STROKE;
  } else if (ingestionWip === "subtle") {
    fill = hovered ? INGESTION_WIP_SUBTLE_HOVER : INGESTION_WIP_SUBTLE_FILL;
    stroke = hovered ? "#d8b4fe" : INGESTION_WIP_SUBTLE_STROKE;
  } else {
    fill = active ? (collapsed ? "#ffffff" : TAB_BLUE) : hovered ? TAB_HOVER_BG : PAGE_BG;
    stroke = active && !collapsed ? TAB_BLUE_DARK : hovered ? "#9ca3af" : BORDER_GREY;
  }

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
  ingestionWip,
  onClick,
}: {
  label: string;
  active: boolean;
  collapsed: boolean;
  first: boolean;
  zIndex: number;
  disabled?: boolean;
  ingestionWip?: IngestionWipState;
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
        <TabSVG
          width={size.w}
          height={size.h}
          active={active}
          hovered={hovered && !disabled}
          collapsed={collapsed}
          ingestionWip={ingestionWip}
        />
        <span
          className="relative z-[2] flex w-full min-w-0 flex-col items-center justify-center overflow-hidden px-6 text-center"
          style={{ minWidth: TAB_MIN_WIDTH }}
        >
          <span
            className={cn(
              "w-full whitespace-nowrap text-center font-semibold leading-tight transition-all duration-200",
              collapsed ? "text-[12px]" : "text-[14px]",
              ingestionWip === "active" && collapsed
                ? "text-purple-700"
                : ingestionWip === "active"
                  ? "text-white"
                  : ingestionWip === "subtle"
                    ? "text-purple-800 group-hover/tab:text-purple-900"
                    : active && collapsed
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

const PRIORITY_CHIP_TONE: Record<"red" | "amber", string> = {
  red: "border-red-200/90 bg-red-50 text-red-800",
  amber: "border-amber-200/90 bg-amber-50 text-amber-900",
};

function CustomerPriorityChips() {
  if (priorityChips.length === 0) return null;
  return (
    <div
      className="flex shrink-0 flex-wrap items-center justify-end gap-1.5"
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

function ViewPDFDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="View contract PDFs"
        className="flex h-7 items-center gap-0.5 text-gray-500 transition-colors hover:text-gray-800"
      >
        <FileText size={15} strokeWidth={2} />
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {contractPDFs.map((pdf) => (
            <button
              key={pdf.id}
              type="button"
              onClick={() => {
                openPDFInNewWindow(pdf);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-gray-700 hover:bg-gray-50"
            >
              <FileText size={13} className="shrink-0 text-gray-400" />
              <span className="truncate">{pdf.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function IngestionSegmentedControl({
  activeSubTab,
  onSubTabChange,
}: {
  activeSubTab: string;
  onSubTabChange: (id: string) => void;
}) {
  const tabs = ingestionSubTabs;

  return (
    <div className="relative inline-flex">
      <div className="flex items-center rounded-lg border border-gray-300 bg-gray-100 p-1">
        {tabs.map((tab, idx) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => !tab.disabled && onSubTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "relative flex items-center gap-1.5 rounded-md px-3 py-1 font-sora text-[12px] transition-all",
                tab.disabled && "cursor-not-allowed opacity-40",
                isActive
                  ? "bg-blue-600 font-bold text-white shadow-md"
                  : "font-semibold text-slate-600 hover:bg-gray-200 hover:text-slate-800",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                  isActive
                    ? "bg-white text-blue-600"
                    : tab.status === "complete"
                      ? "bg-emerald-500 text-white"
                      : tab.status === "error"
                        ? "bg-red-500 text-white"
                        : "bg-gray-400 text-white",
                )}
              >
                {stepBadge(tab.status, idx)}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IngestionTabPill({
  activeSubTab,
  onSubTabChange,
  hasUnresolvedItems = false,
}: {
  activeSubTab: string;
  onSubTabChange: (id: string) => void;
  hasUnresolvedItems?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ContractStatus>("in-review");
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

  return (
    <div className="flex items-center justify-between gap-4 py-1.5 pl-6 pr-6">
      <div className="flex min-w-0 items-center gap-2">
        <ViewPDFDropdown />
        <IngestionSegmentedControl activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <div ref={statusMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setStatusMenuOpen((o) => !o)}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[11px] font-medium transition-colors",
              activeStatus.borderColor,
              activeStatus.bgColor,
              activeStatus.color,
              "hover:opacity-90",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus.color.replace("text-", "bg-"))} />
            {activeStatus.label}
            <ChevronDown size={12} className={cn("transition-transform", statusMenuOpen && "rotate-180")} />
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
                    currentStatus === status.id ? status.color : "text-gray-700",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", status.color.replace("text-", "bg-"))} />
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isPreviewInvoice && hasUnresolvedItems}
          className={cn(
            "flex h-7 items-center gap-0.5 rounded-full px-3.5 font-sora text-[12px] font-semibold transition-colors",
            isPreviewInvoice && hasUnresolvedItems
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-blue-600 text-white hover:bg-blue-700",
          )}
        >
          {isPreviewInvoice ? (
            "Send for approval"
          ) : (
            <>
              Preview invoice
              <ArrowRight size={13} strokeWidth={2.5} className="ml-1" />
            </>
          )}
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="More actions"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-gray-200/80 hover:text-slate-700",
              menuOpen && "bg-gray-200/80 text-slate-700",
            )}
          >
            <MoreHorizontal size={15} />
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

const WORKFLOW_MORE_BTN_W = 64;
const WORKFLOW_TAB_OVERLAP = 8;

function ResponsiveWorkflowTabStrip({
  activeStage,
  onStageChange,
}: {
  activeStage: StageId;
  onStageChange: (s: StageId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(workflowTabs.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const collapsed = true;
  const tabHeight = TAB_HEIGHT.collapsed;

  const renderTab = (tab: (typeof workflowTabs)[number], idx: number, first: boolean) => {
    const isActive = activeStage === tab.id;
    const isIngestionTab = tab.id === "ingestion";
    const ingestionWip: IngestionWipState | undefined = isIngestionTab
      ? isActive
        ? "active"
        : "subtle"
      : undefined;

    return (
      <WorkspaceTabButton
        label={tab.label}
        active={isActive}
        collapsed={collapsed}
        first={first}
        zIndex={isActive ? 50 : isIngestionTab ? 20 - idx : 10 - idx}
        disabled={tab.disabled}
        ingestionWip={ingestionWip}
        onClick={() => onStageChange(tab.id)}
      />
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const calc = () => {
      const tabEls = Array.from(measure.querySelectorAll("[data-wf-measure]")) as HTMLElement[];
      if (tabEls.length === 0) return;

      const widths = tabEls.map((el) => el.offsetWidth);
      const containerWidth = container.clientWidth;
      // Reserve space for the More button
      const availableWidth = containerWidth - WORKFLOW_MORE_BTN_W - 4;
      
      // Find the index of the active tab
      const activeIndex = workflowTabs.findIndex((t) => t.id === activeStage);
      
      // Calculate how many tabs fit, but ensure active tab is always visible
      let used = 0;
      let count = 0;
      let activeTabIncluded = false;

      for (let i = 0; i < widths.length; i++) {
        const overlap = i > 0 ? WORKFLOW_TAB_OVERLAP : 0;
        const nextUsed = used + widths[i] - overlap;
        
        // Always include the active tab
        if (i === activeIndex) {
          used = nextUsed;
          count = i + 1;
          activeTabIncluded = true;
          continue;
        }
        
        if (nextUsed > availableWidth && i > 0) break;
        used = nextUsed;
        count = i + 1;
      }

      // If active tab wasn't included in the natural flow, we need to ensure it is
      // by potentially removing earlier tabs
      if (!activeTabIncluded && activeIndex >= count) {
        // Include all tabs up to and including the active tab
        count = activeIndex + 1;
      }

      setVisibleCount(Math.max(1, count));
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(container);
    return () => ro.disconnect();
  }, [activeStage]);

  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  const visibleTabs = workflowTabs.slice(0, visibleCount);
  const hiddenTabs = workflowTabs.slice(visibleCount);
  const hasHiddenTabs = hiddenTabs.length > 0;

  return (
    <div className="flex min-w-0 flex-1 items-end">
      {/* Tab measurement and display container */}
      <div ref={containerRef} className="relative flex min-w-0 flex-1 items-end overflow-hidden">
        {/* Hidden measurement row */}
        <div ref={measureRef} className="pointer-events-none invisible absolute left-0 top-0 flex items-end" aria-hidden>
          {workflowTabs.map((tab, idx) => (
            <div
              key={`measure-${tab.id}`}
              data-wf-measure=""
              className={cn("inline-flex shrink-0", idx > 0 && TAB_OVERLAP_CLASS)}
            >
              {renderTab(tab, idx, idx === 0)}
            </div>
          ))}
        </div>

        {/* Visible tabs */}
        <div className="flex items-end">
          {visibleTabs.map((tab, idx) => (
            <div key={tab.id} className={cn("inline-flex shrink-0", idx > 0 && TAB_OVERLAP_CLASS)}>
              {renderTab(tab, workflowTabs.indexOf(tab), idx === 0)}
            </div>
          ))}
        </div>
      </div>

      {/* More button - positioned outside overflow-hidden container */}
      <div ref={moreRef} className="relative shrink-0" style={{ zIndex: 60 }}>
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center gap-0.5 rounded-md px-2 text-slate-500 transition-colors hover:bg-black/[0.05] hover:text-slate-700",
            moreOpen && "bg-black/[0.05] text-slate-700",
          )}
          style={{ height: tabHeight, minWidth: WORKFLOW_MORE_BTN_W }}
          title="More options"
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={moreOpen}
        >
          <span className="text-[11px] font-semibold">More</span>
          <ChevronDown size={12} className={cn("transition-transform", moreOpen && "rotate-180")} />
        </button>
        {moreOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+4px)] z-[100] min-w-[10rem] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          >
            {hasHiddenTabs && (
              <>
                {hiddenTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="menuitem"
                    disabled={tab.disabled}
                    onClick={() => {
                      if (!tab.disabled) onStageChange(tab.id);
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-left text-[12px] font-medium transition-colors",
                      tab.disabled
                        ? "cursor-not-allowed text-gray-400 opacity-55"
                        : activeStage === tab.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="my-1 h-px bg-gray-200" aria-hidden />
              </>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => setMoreOpen(false)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span>Riveric</span>
              <ChevronRight size={14} className="text-gray-400" />
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setMoreOpen(false)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span>Connect</span>
              <ChevronRight size={14} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
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
  ingestionSubTab,
  onIngestionSubTabChange,
  hasUnresolvedItems = false,
}: {
  customer: Customer;
  activeStage: StageId;
  onStageChange: (s: StageId) => void;
  ingestionSubTab: string;
  onIngestionSubTabChange: (id: string) => void;
  hasUnresolvedItems?: boolean;
}) {
  const isIngestion = activeStage === "ingestion";
  const hangingHeight = CONTEXT_PILL_HEIGHT + HEADER_TABS_GAP.collapsed + 1;

  return (
    <div className="sticky top-0 z-20 mt-2 bg-gray-100/90 backdrop-blur-md backdrop-saturate-150">
      {/* Customer name + chips on left, workflow tabs on right */}
      <div className="relative flex items-end px-6 pt-2 pb-0">
        <div className="flex shrink-0 items-center gap-2 pb-2">
          <h1 className="truncate text-[16px] font-bold leading-tight tracking-tight text-text-primary">
            {customer.name}
          </h1>
          <CustomerPriorityChips />
        </div>
        <div className="ml-4 min-w-0 flex-1 pb-0">
          <ResponsiveWorkflowTabStrip activeStage={activeStage} onStageChange={onStageChange} />
        </div>
      </div>
      {/* Horizontal line under workflow tabs - extends edge to edge */}
      <div className="h-px bg-gray-300" aria-hidden="true" />

      {isIngestion ? (
        <div className="relative z-30 w-full pb-1">
          <IngestionTabPill
            activeSubTab={ingestionSubTab}
            onSubTabChange={onIngestionSubTabChange}
            hasUnresolvedItems={hasUnresolvedItems}
          />
        </div>
      ) : (
        <>
          <div className="relative px-6 pb-2">
            <div className="flex items-start justify-between">
              <ContextInfoPill stage={activeStage} customer={customer} />
              <ActionsPillWrapper>
                <button className="flex h-7 items-center rounded-md px-3 text-[12px] font-semibold text-slate-600 hover:bg-gray-100">
                  Action
                </button>
              </ActionsPillWrapper>
            </div>
          </div>
          <div style={{ height: hangingHeight }} aria-hidden />
        </>
      )}
    </div>
  );
}

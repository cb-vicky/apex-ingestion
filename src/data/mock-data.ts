/**
 * Single source of truth for the Customer 360 starter.
 *
 * Everything the chrome renders (customer header, workflow tabs, priority
 * chips, the contract-ingestion sub-tab strip and its documents) is driven
 * from this file. Edit / extend these to power your micro-work — the shell,
 * context bar and placeholder content all read from here.
 */

// ─── Lifecycle stages (the workflow tabs) ───────────────────────────────────
export type StageId =
  | "customer"
  | "tasks"
  | "threads"
  | "quote"
  | "contract"
  | "ingestion"
  | "invoicing"
  | "payment"
  | "revrec";

export interface WorkflowTab {
  id: StageId;
  /** Tab label (folder-tab text) */
  label: string;
  /** Breadcrumb label when this stage is active */
  crumb: string;
  /** Whether the tab is locked (greyed out, not clickable) */
  disabled?: boolean;
}

/**
 * The workflow tabs, left → right. `ingestion` is the contract-ingestion tab
 * and is the active tab on load. Reorder / add stages here.
 */
export const workflowTabs: WorkflowTab[] = [
  { id: "customer", label: "Overview", crumb: "Overview" },
  { id: "tasks", label: "Tasks", crumb: "Tasks" },
  { id: "threads", label: "Threads", crumb: "Threads" },
  { id: "quote", label: "Quotes", crumb: "Quote" },
  { id: "contract", label: "Contracts", crumb: "Contract" },
  { id: "ingestion", label: "Ingestion", crumb: "Ingestion" },
  { id: "invoicing", label: "Invoicing", crumb: "Invoice" },
  { id: "payment", label: "Collections", crumb: "Collection" },
  { id: "revrec", label: "RevRec", crumb: "Arrangement" },
];

/** Stage that is active when the page loads. */
export const initialStage: StageId = "ingestion";

// ─── Customer ────────────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  ae: string;
  csm: string;
  billingOwner: string;
  arr: number;
  nextRenewalDate: string;
}

export const customer: Customer = {
  id: "CUST-ZENITH",
  name: "Zenith Analytics",
  ae: "Priya Nair",
  csm: "Marcus Webb",
  billingOwner: "Dana Lopez",
  arr: 480_000,
  nextRenewalDate: "2026-12-01",
};

/** Breadcrumb trail shown above the customer name. */
export const breadcrumbs: { label: string; href?: string }[] = [
  { label: "Customers", href: "#" },
  { label: customer.name },
];

// ─── Priority chips (top-right of the header) ────────────────────────────────
export interface PriorityChip {
  label: string;
  severity: "red" | "amber";
}

export const priorityChips: PriorityChip[] = [
  { label: "New deal ingestion", severity: "amber" },
];

// ─── Contract-ingestion sub-tab strip ────────────────────────────────────────
export type IngestionStepStatus = "complete" | "active" | "pending" | "error";

export interface IngestionDocument {
  id: string;
  name: string;
  kind: "contract" | "sow" | "addendum";
}

/** Documents shown in the left "document switcher" pill. */
export const ingestionDocuments: IngestionDocument[] = [
  { id: "doc-msa", name: "Zenith_MSA_2026.pdf", kind: "contract" },
  { id: "doc-sow", name: "Zenith_SOW_Q1.pdf", kind: "sow" },
];

export interface IngestionSubTab {
  id: string;
  label: string;
  status: IngestionStepStatus;
  /** When true, the step is locked (e.g. preview not ready yet). */
  disabled?: boolean;
}

/**
 * The centered sequential flow tabs inside the ingestion bar.
 * Status drives the numbered badge: complete → ✓, error → !, else step number.
 */
export const ingestionSubTabs: IngestionSubTab[] = [
  { id: "review-schedule", label: "Schedule", status: "active" },
  { id: "preview-invoice", label: "Invoice", status: "pending" },
];

/** Sub-tab active on load. */
export const initialIngestionSubTab = "review-schedule";

// ─── Left product-nav items ──────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  /** Shorter label for the top nav bar */
  shortLabel?: string;
  /** lucide-react icon name (resolved in TopNav / Sidebar) */
  icon: string;
  active?: boolean;
  disabled?: boolean;
}

/** Default visible items in the top nav (rest go in More). */
export const primaryNavIds = [
  "workbench",
  "customers",
  "quotes",
  "contracts",
  "collections",
  "revrec",
] as const;

/** Curated items shown in the top-nav More menu. */
export const moreNavIds = [
  "prospects",
  "invoices",
  "credit-notes",
  "product-catalog",
  "entitlements",
  "features",
  "usages",
  "revenue-story",
] as const;

export const navItems: NavItem[] = [
  { id: "workbench", label: "My Workbench", shortLabel: "Workbench", icon: "Home" },
  { id: "customers", label: "Customers", icon: "Users", active: true },
  { id: "prospects", label: "Prospects", icon: "UserPlus" },
  { id: "quotes", label: "Quotes", icon: "File" },
  { id: "contracts", label: "Contracts", icon: "FileSignature" },
  { id: "invoices", label: "Invoices", icon: "Receipt" },
  { id: "credit-notes", label: "Credit notes", icon: "MinusCircle" },
  { id: "collections", label: "Collections", icon: "Coins" },
  { id: "revrec", label: "RevRec", icon: "ChartLine" },
  { id: "communications", label: "Communications", icon: "Mail" },
  { id: "tasks", label: "Tasks", icon: "List" },
  { id: "product-catalog", label: "Catalog", icon: "Tag" },
  { id: "entitlements", label: "Entitlements", icon: "Shield" },
  { id: "features", label: "Features", icon: "Zap" },
  { id: "usages", label: "Usages", icon: "Activity" },
  { id: "revenue-story", label: "Revenue story", icon: "BarChart3" },
  { id: "signals", label: "Signals", icon: "Zap", disabled: true },
];

// ─── Contract Review Types ───────────────────────────────────────────────────

export type LineItemMappingStatus = "mapped" | "needs_mapping";

export interface LineItem {
  id: string;
  name: string;
  frequency: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  mappingStatus: LineItemMappingStatus;
}

export interface BillingInfo {
  term: string;
  billingCycle: string;
  startDate: string;
  autoCollection: "Use customer's settings" | "On" | "Off";
  poNumber: string;
  paymentTerms: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerDetails {
  accountName: string;
  legalEntity: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
}

export interface ContractData {
  id: string;
  customerName: string;
  customerLegalEntity: string;
  customerDetails: CustomerDetails;
  lineItems: LineItem[];
  billingInfo: BillingInfo;
  billingAddress: Address;
  shippingAddress: Address;
  shippingSameAsBilling: boolean;
}

export interface InvoiceData {
  invoiceId: string;
  invoiceDate: string;
  dueDate: string;
  status: "Draft" | "Posted";
}

// ─── Zenith Analytics Sample Data ────────────────────────────────────────────

export const zenithContractData: ContractData = {
  id: "CTR-ZA-2026-001",
  customerName: "Zenith Analytics",
  customerLegalEntity: "Zenith Analytics Inc.",
  customerDetails: {
    accountName: "Zenith Analytics",
    legalEntity: "Zenith Analytics Inc.",
    contactName: "Priya Sharma",
    contactEmail: "priya.sharma@zenithanalytics.com",
    contactPhone: "+91 98765 43210",
    industry: "Data & Analytics",
  },
  lineItems: [
    {
      id: "li-growth-crm",
      name: "Growth CRM",
      frequency: "Yearly",
      quantity: 25,
      unitPrice: 1200,
      totalPrice: 30000,
      mappingStatus: "mapped",
    },
    {
      id: "li-onboarding",
      name: "Onboarding & Training",
      frequency: "One-time",
      quantity: 1,
      unitPrice: 2500,
      totalPrice: 2500,
      mappingStatus: "needs_mapping",
    },
    {
      id: "li-support",
      name: "Premium Support Add-on",
      frequency: "Monthly",
      quantity: 1,
      unitPrice: 4200,
      totalPrice: 4200,
      mappingStatus: "mapped",
    },
  ],
  billingInfo: {
    term: "12 months",
    billingCycle: "Annual, billed upfront",
    startDate: "15-Jul-2026",
    autoCollection: "Use customer's settings",
    poNumber: "",
    paymentTerms: "Net 30",
  },
  billingAddress: {
    line1: "4th Floor, Lattice Tower",
    line2: "MG Road",
    city: "Bengaluru",
    state: "KA",
    postalCode: "560001",
    country: "India",
  },
  shippingAddress: {
    line1: "4th Floor, Lattice Tower",
    line2: "MG Road",
    city: "Bengaluru",
    state: "KA",
    postalCode: "560001",
    country: "India",
  },
  shippingSameAsBilling: true,
};

export const zenithInvoiceData: InvoiceData = {
  invoiceId: "INV-ZA-2026-001",
  invoiceDate: "2026-05-01",
  dueDate: "2026-05-31",
  status: "Draft",
};

// ─── Pioneer Systems Sample Data ─────────────────────────────────────────────

export const pioneerContractData: ContractData = {
  id: "CTR-PS-2026-001",
  customerName: "Pioneer Systems",
  customerLegalEntity: "Pioneer Systems Corp.",
  customerDetails: {
    accountName: "Pioneer Systems",
    legalEntity: "Pioneer Systems Corp.",
    contactName: "Marcus Chen",
    contactEmail: "marcus.chen@pioneersystems.com",
    contactPhone: "+1 512 555 0123",
    industry: "Enterprise Software",
  },
  lineItems: [
    {
      id: "li-pioneer-platform",
      name: "Apex Platform – Growth",
      frequency: "Yearly",
      quantity: 50,
      unitPrice: 2400,
      totalPrice: 120000,
      mappingStatus: "mapped",
    },
    {
      id: "li-pioneer-impl",
      name: "Implementation Services",
      frequency: "One-time",
      quantity: 1,
      unitPrice: 18000,
      totalPrice: 18000,
      mappingStatus: "needs_mapping",
    },
  ],
  billingInfo: {
    term: "12 months",
    billingCycle: "Annual, billed upfront",
    startDate: "01-May-2026",
    autoCollection: "Use customer's settings",
    poNumber: "",
    paymentTerms: "Net 30",
  },
  billingAddress: {
    line1: "1200 Congress Ave",
    line2: "Suite 400",
    city: "Austin",
    state: "Texas",
    postalCode: "78701",
    country: "United States",
  },
  shippingAddress: {
    line1: "1200 Congress Ave",
    line2: "Suite 400",
    city: "Austin",
    state: "Texas",
    postalCode: "78701",
    country: "United States",
  },
  shippingSameAsBilling: true,
};

export const pioneerInvoiceData: InvoiceData = {
  invoiceId: "INV-PS-2026-001",
  invoiceDate: "2026-05-01",
  dueDate: "2026-05-31",
  status: "Draft",
};

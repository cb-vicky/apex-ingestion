import { useState } from "react";
import { CustomerContextBar } from "./CustomerContextBar";
import {
  customer,
  initialIngestionSubTab,
  initialStage,
  workflowTabs,
  type StageId,
} from "@/data/mock-data";
import {
  zenithContractData,
  zenithInvoiceData,
  type Address,
  type BillingInfo,
  type CustomerDetails,
  type LineItem,
} from "@/data/mock-contracts";
import { cn } from "@/lib/utils";
import { SummaryTab, type SourcePDF } from "@/components/contract-review/SummaryTab";
import { InvoicePreviewTab } from "@/components/contract-review/InvoicePreviewTab";
import { ContractPDFViewer } from "@/components/contract-review/ContractPDFViewer";

function PlaceholderContent({ stage }: { stage: StageId }) {
  const stageLabel = workflowTabs.find((t) => t.id === stage)?.label ?? stage;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Content placeholder</p>
        <h2 className="mt-1 font-sora text-[18px] font-bold text-text-primary">{stageLabel}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          This is the working canvas for the <span className="font-semibold">{stageLabel}</span> stage. Build your
          stage content here — it renders inside the same shared customer workspace shell.
        </p>
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div className="h-3 w-40 rounded bg-gray-100" />
          <div className="mt-3 space-y-2">
            <div className="h-2.5 w-full rounded bg-gray-100" />
            <div className="h-2.5 w-11/12 rounded bg-gray-100" />
            <div className="h-2.5 w-3/4 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Customer360Page() {
  const [activeStage, setActiveStage] = useState<StageId>(initialStage);
  const [ingestionSubTab, setIngestionSubTab] = useState<string>(initialIngestionSubTab);
  const collapsed = true;

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(zenithContractData.customerDetails);
  const [lineItems, setLineItems] = useState<LineItem[]>(zenithContractData.lineItems);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(zenithContractData.billingInfo);
  const [billingAddress, setBillingAddress] = useState<Address>(zenithContractData.billingAddress);
  const [shippingAddress, setShippingAddress] = useState<Address>(zenithContractData.shippingAddress);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(zenithContractData.shippingSameAsBilling);

  // Open PDF tabs state
  const [openPDFs, setOpenPDFs] = useState<SourcePDF[]>([]);
  const [activePDF, setActivePDF] = useState<SourcePDF | null>(null);

  const isIngestion = activeStage === "ingestion";

  const handleOpenPDF = (pdf: SourcePDF) => {
    // Check if already open
    if (!openPDFs.some((p) => p.id === pdf.id)) {
      setOpenPDFs([...openPDFs, pdf]);
    }
    setActivePDF(pdf);
  };

  const handleClosePDF = (pdfId: string) => {
    const newOpenPDFs = openPDFs.filter((p) => p.id !== pdfId);
    setOpenPDFs(newOpenPDFs);
    if (activePDF?.id === pdfId) {
      setActivePDF(null);
    }
  };

  const handleSelectPDF = (pdf: SourcePDF | null) => {
    setActivePDF(pdf);
  };

  const renderIngestionContent = () => {
    if (ingestionSubTab === "review-schedule") {
      return (
        <SummaryTab
          customerDetails={customerDetails}
          lineItems={lineItems}
          billingInfo={billingInfo}
          billingAddress={billingAddress}
          shippingAddress={shippingAddress}
          shippingSameAsBilling={shippingSameAsBilling}
          onCustomerDetailsChange={setCustomerDetails}
          onLineItemsChange={setLineItems}
          onBillingInfoChange={setBillingInfo}
          onBillingAddressChange={setBillingAddress}
          onShippingAddressChange={setShippingAddress}
          onSameAsBillingChange={setShippingSameAsBilling}
          onOpenPDF={handleOpenPDF}
        />
      );
    }

    if (ingestionSubTab === "preview-invoice") {
      return (
        <InvoicePreviewTab
          lineItems={lineItems}
          invoiceData={zenithInvoiceData}
          customerName={zenithContractData.customerName}
          contractId={zenithContractData.id}
          billingAddress={billingAddress}
          onNavigateToReview={() => setIngestionSubTab("review-schedule")}
        />
      );
    }

    return <PlaceholderContent stage={activeStage} />;
  };

  const renderContent = () => {
    if (activePDF) {
      return <ContractPDFViewer pdf={activePDF} />;
    }

    return (
      <div
        className={cn(
          "min-w-0 pb-12 pt-2",
          isIngestion ? "px-6 lg:px-10" : "mx-auto grid max-w-[860px] px-6",
        )}
      >
        {isIngestion ? renderIngestionContent() : <PlaceholderContent stage={activeStage} />}
      </div>
    );
  };

  const hasUnresolvedItems = lineItems.some((item) => item.mappingStatus === "needs_mapping");

  return (
    <div className="flex flex-1 flex-col bg-gray-100">
      <CustomerContextBar
        customer={customer}
        activeStage={activeStage}
        onStageChange={setActiveStage}
        collapsed={collapsed}
        ingestionSubTab={ingestionSubTab}
        onIngestionSubTabChange={(id) => {
          setIngestionSubTab(id);
          setActivePDF(null); // Go back to main content when changing sub-tabs
        }}
        hasUnresolvedItems={hasUnresolvedItems}
        openPDFs={openPDFs}
        activePDF={activePDF}
        onSelectPDF={handleSelectPDF}
        onClosePDF={handleClosePDF}
      />

      <div className="relative flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

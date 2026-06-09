import type { SourcePDF } from "@/components/contract-review/SummaryTab";

/** Open a contract PDF in a new browser window with in-page viewer controls. */
export function openPDFInNewWindow(pdf: SourcePDF) {
  const url = `${window.location.origin}${window.location.pathname}?pdf=${encodeURIComponent(pdf.id)}`;
  window.open(url, "_blank", "noopener,noreferrer,width=960,height=720");
}

import { AppShell } from "@/components/layout/AppShell";
import { PDFViewerWindow } from "@/components/contract-review/PDFViewerWindow";
import { Customer360Page } from "@/components/workspace/Customer360Page";

export default function App() {
  const pdfId = new URLSearchParams(window.location.search).get("pdf");
  if (pdfId) {
    return <PDFViewerWindow pdfId={pdfId} />;
  }

  return (
    <AppShell>
      <Customer360Page />
    </AppShell>
  );
}

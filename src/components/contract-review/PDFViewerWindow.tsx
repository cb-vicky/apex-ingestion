import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { contractPDFs } from "./SummaryTab";
import { ContractPDFViewer } from "./ContractPDFViewer";

export function PDFViewerWindow({ pdfId }: { pdfId: string }) {
  const pdf = useMemo(() => contractPDFs.find((p) => p.id === pdfId), [pdfId]);
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const totalPages = pdf?.id === "msa-main" ? 2 : 1;

  if (!pdf) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-100 font-sans text-sm text-gray-500">
        PDF not found
      </div>
    );
  }

  const handleClose = () => window.close();

  return (
    <div className="flex h-dvh flex-col bg-gray-100 font-sora">
      <header className="flex shrink-0 items-center gap-3 border-b border-gray-200/80 bg-white px-4 py-2">
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-gray-900">{pdf.name}</span>

        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1 py-0.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-gray-800"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-[11px] font-medium text-gray-600">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-gray-800"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1 py-0.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-gray-800 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-1 text-[11px] font-medium text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-gray-800 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close window"
        >
          <X size={15} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div
          className="mx-auto max-w-2xl origin-top transition-transform duration-150"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <ContractPDFViewer pdf={pdf} activePage={page} />
        </div>
      </div>
    </div>
  );
}

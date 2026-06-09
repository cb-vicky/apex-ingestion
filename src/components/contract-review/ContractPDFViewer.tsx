import type { SourcePDF } from "./SummaryTab";

const pdfContent: Record<string, { title: string; pages: React.ReactNode[] }> = {
  "msa-main": {
    title: "Master Services Agreement",
    pages: [
      <PDFPage1 key="p1" />,
      <PDFPage2 key="p2" />,
    ],
  },
  "schedule-a": {
    title: "Schedule A - Pricing",
    pages: [<ScheduleAPage key="p1" />],
  },
  "addendum": {
    title: "Addendum - Terms",
    pages: [<AddendumPage key="p1" />],
  },
};

function PDFPage1() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Master Services Agreement
          </div>
          <div className="mt-1 text-[18px] font-bold text-slate-800">
            MSA-2026-ZA-001
          </div>
        </div>
        <div className="rounded bg-blue-900 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white">
          APEX CORP
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">1. PARTIES</h2>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-[13px] leading-relaxed text-slate-700">
            This Master Services Agreement ("Agreement") is entered into as of{" "}
            <span className="font-semibold">July 15, 2026</span> ("Effective Date")
          </p>
          <p className="mt-3 text-[13px] text-slate-600">By and between:</p>
          <p className="mt-2 text-[14px] font-semibold text-slate-800">
            Zenith Analytics Inc.
          </p>
          <p className="text-[13px] text-slate-600">
            4th Floor, Lattice Tower, MG Road, Bengaluru, KA 560001, India
          </p>
          <p className="mt-1 text-[12px] text-slate-500">
            (hereinafter referred to as "Client")
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-[13px] font-medium text-slate-500">AND</p>
        <p className="text-[14px] font-semibold text-slate-700">Apex Corporation</p>
        <p className="text-[13px] text-slate-600">
          123 Business Street, Suite 100, San Francisco, CA 94104, USA
        </p>
        <p className="mt-1 text-[12px] text-slate-500">
          (hereinafter referred to as "Provider")
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">2. RECITALS</h2>
        <p className="text-[13px] leading-relaxed text-slate-600">
          WHEREAS, Client desires to engage Provider to provide certain software
          services and related support as described herein; and
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
          WHEREAS, Provider desires to provide such services to Client upon the
          terms and conditions set forth in this Agreement;
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
          NOW, THEREFORE, in consideration of the mutual covenants and agreements
          contained herein, the parties agree as follows:
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">3. DEFINITIONS</h2>
        <p className="text-[13px] leading-relaxed text-slate-600">
          <span className="font-medium">3.1 "Confidential Information"</span> means
          any non-public information disclosed by one party to the other that is
          designated as confidential.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
          <span className="font-medium">3.2 "Deliverables"</span> means any work
          product, materials, or documentation created by Provider.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
          <span className="font-medium">3.3 "Services"</span> means the professional
          services to be provided by Provider as described in Schedule A.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-[11px] text-gray-400">
        <span>MSA-2026-ZA-001</span>
        <span>Page 1 of 2</span>
        <span>Confidential</span>
      </div>
    </div>
  );
}

function PDFPage2() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">4. PAYMENT TERMS</h2>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Contract Term</p>
              <p className="text-[13px] font-semibold text-slate-800">12 months</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Billing Cycle</p>
              <p className="text-[13px] font-semibold text-slate-800">Annual, upfront</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Start Date</p>
              <p className="text-[13px] font-semibold text-slate-800">July 15, 2026</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Payment Terms</p>
              <p className="text-[13px] font-semibold text-slate-800">Net 30</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">5. NOTICE PROVISIONS</h2>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase text-slate-500">
                To Client (Billing):
              </p>
              <p className="text-[13px] font-medium text-slate-800">Zenith Analytics Inc.</p>
              <p className="text-[12px] text-slate-600">4th Floor, Lattice Tower</p>
              <p className="text-[12px] text-slate-600">MG Road</p>
              <p className="text-[12px] text-slate-600">Bengaluru, KA 560001, India</p>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase text-slate-500">
                To Provider:
              </p>
              <p className="text-[13px] font-medium text-slate-800">Apex Corporation</p>
              <p className="text-[12px] text-slate-600">123 Business Street, Suite 100</p>
              <p className="text-[12px] text-slate-600">San Francisco, CA 94104</p>
              <p className="text-[12px] text-slate-600">United States</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">IN WITNESS WHEREOF</h2>
        <p className="mb-4 text-[13px] text-slate-600">
          The parties have executed this Agreement as of the Effective Date.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded border border-gray-200 p-4">
            <p className="text-[10px] font-medium uppercase text-gray-400">CLIENT</p>
            <p className="mt-1 text-[13px] font-medium text-slate-700">Zenith Analytics Inc.</p>
            <div className="mt-4 border-t border-dashed border-gray-300 pt-2">
              <p className="text-[10px] text-gray-400">Authorized Signature / Date</p>
            </div>
          </div>
          <div className="rounded border border-gray-200 p-4">
            <p className="text-[10px] font-medium uppercase text-gray-400">PROVIDER</p>
            <p className="mt-1 text-[13px] font-medium text-slate-700">Apex Corporation</p>
            <div className="mt-4 border-t border-dashed border-gray-300 pt-2">
              <p className="text-[10px] text-gray-400">Authorized Signature / Date</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-[11px] text-gray-400">
        <span>MSA-2026-ZA-001</span>
        <span>Page 2 of 2</span>
        <span>Confidential</span>
      </div>
    </div>
  );
}

function ScheduleAPage() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 border-b border-slate-800 pb-3">
        <h1 className="text-[16px] font-bold text-slate-800">
          SCHEDULE A: SERVICES AND PRICING
        </h1>
      </div>

      <p className="mb-4 text-[13px] text-slate-600">
        The following services shall be provided by Provider to Client pursuant to
        the terms of the Master Services Agreement:
      </p>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-amber-200">
              <th className="pb-2 text-left font-semibold text-slate-600">Description</th>
              <th className="pb-2 text-left font-semibold text-slate-600">Frequency</th>
              <th className="pb-2 text-right font-semibold text-slate-600">Qty</th>
              <th className="pb-2 text-right font-semibold text-slate-600">Unit Price</th>
              <th className="pb-2 text-right font-semibold text-slate-600">Total</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-amber-100">
              <td className="py-2 font-medium">Growth CRM Platform License</td>
              <td className="py-2">Yearly</td>
              <td className="py-2 text-right">25</td>
              <td className="py-2 text-right">$1,200.00</td>
              <td className="py-2 text-right font-medium">$30,000.00</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 font-medium">Onboarding & Training Services</td>
              <td className="py-2">One-time</td>
              <td className="py-2 text-right">1</td>
              <td className="py-2 text-right">$2,500.00</td>
              <td className="py-2 text-right font-medium">$2,500.00</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Premium Support Add-on</td>
              <td className="py-2">Monthly</td>
              <td className="py-2 text-right">1</td>
              <td className="py-2 text-right">$4,200.00</td>
              <td className="py-2 text-right font-medium">$4,200.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-amber-300 bg-amber-100/50">
              <td colSpan={4} className="py-2 text-right font-semibold text-slate-700">
                Total Annual Value:
              </td>
              <td className="py-2 text-right text-[14px] font-bold text-slate-800">
                $36,700.00
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-[13px] font-semibold text-slate-700">
          A.1 Service Level Commitments
        </h3>
        <ul className="list-inside list-disc space-y-1 text-[12px] text-slate-600">
          <li>System Availability: 99.9% uptime measured monthly</li>
          <li>Support Response Time: 4 hours for critical issues</li>
          <li>Data Backup: Daily automated backups with 30-day retention</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-[13px] font-semibold text-slate-700">
          A.2 Implementation Timeline
        </h3>
        <p className="text-[12px] text-slate-600">
          Implementation shall be completed within 30 days of the Effective Date.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-[11px] text-gray-400">
        <span>MSA-2026-ZA-001 — Schedule A</span>
        <span>Page 1 of 1</span>
        <span>Confidential</span>
      </div>
    </div>
  );
}

function AddendumPage() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 border-b border-slate-800 pb-3">
        <h1 className="text-[16px] font-bold text-slate-800">
          ADDENDUM - ADDITIONAL TERMS
        </h1>
        <p className="mt-1 text-[12px] text-slate-500">
          Effective Date: July 15, 2026
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">
          1. DATA PROCESSING AGREEMENT
        </h2>
        <p className="text-[13px] leading-relaxed text-slate-600">
          Provider agrees to process Client's data in accordance with applicable data
          protection laws including GDPR and CCPA. All data shall be stored in
          SOC 2 Type II certified data centers.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">
          2. INSURANCE REQUIREMENTS
        </h2>
        <p className="text-[13px] leading-relaxed text-slate-600">
          Provider maintains the following insurance coverage:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-[12px] text-slate-600">
          <li>Professional Liability: $2,000,000 per occurrence</li>
          <li>Cyber Liability: $5,000,000 aggregate</li>
          <li>General Liability: $1,000,000 per occurrence</li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">
          3. SECURITY COMMITMENTS
        </h2>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <ul className="space-y-2 text-[12px] text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-purple-200 text-center text-[10px] font-bold text-purple-700">✓</span>
              End-to-end encryption for data in transit and at rest
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-purple-200 text-center text-[10px] font-bold text-purple-700">✓</span>
              Annual penetration testing by third-party auditors
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-purple-200 text-center text-[10px] font-bold text-purple-700">✓</span>
              24/7 security monitoring and incident response
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold text-slate-800">
          4. GOVERNING LAW
        </h2>
        <p className="text-[13px] leading-relaxed text-slate-600">
          This Agreement shall be governed by and construed in accordance with the
          laws of the State of California, without regard to its conflict of law
          principles.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-[11px] text-gray-400">
        <span>MSA-2026-ZA-001 — Addendum</span>
        <span>Page 1 of 1</span>
        <span>Confidential</span>
      </div>
    </div>
  );
}

export function ContractPDFViewer({
  pdf,
  activePage,
}: {
  pdf: SourcePDF;
  /** When set, only this page (1-based) is shown — used by the popup viewer. */
  activePage?: number;
}) {
  const content = pdfContent[pdf.id];

  if (!content) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">PDF not found</p>
      </div>
    );
  }

  const pages =
    activePage != null
      ? content.pages.slice(activePage - 1, activePage)
      : content.pages;

  return (
    <div className="h-full overflow-auto bg-gray-200 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {pages.map((page, idx) => (
          <div key={idx}>{page}</div>
        ))}
      </div>
    </div>
  );
}

import { type ReactNode, useEffect, useState } from "react";
import { Check, ExternalLink, Pin, Plus, Sparkles, TriangleAlert, X } from "lucide-react";
import type { Address, BillingInfo, CustomerDetails, LineItem } from "@/data/mock-contracts";
import { cn } from "@/lib/utils";
import { ReadyBadge, NeedsMappingBadge } from "./StatusBadges";
import { CustomerDetailsTable } from "./CustomerDetailsTable";
import { LineItemsTable } from "./LineItemsTable";
import { BillingInfoTable } from "./BillingInfoTable";
import { AddressesTable } from "./AddressesTable";

// Jagged torn-paper clip mask — zigzag along the top and bottom edges.
const TORN_PAPER_CLIP =
  "polygon(0% 5%, 5% 0%, 10% 5%, 15% 1%, 20% 5%, 25% 0%, 30% 5%, 35% 1%, 40% 5%, 45% 0%, 50% 5%, 55% 1%, 60% 5%, 65% 0%, 70% 5%, 75% 1%, 80% 5%, 85% 0%, 90% 5%, 95% 1%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 99%, 80% 95%, 75% 100%, 70% 95%, 65% 99%, 60% 95%, 55% 100%, 50% 95%, 45% 99%, 40% 95%, 35% 100%, 30% 95%, 25% 99%, 20% 95%, 15% 100%, 10% 95%, 5% 99%, 0% 95%)";

function PDFThumbnail({
  type,
  onClick,
}: {
  type: "customer" | "lineItems" | "billing" | "addresses";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-[88px] w-[88px] shrink-0 cursor-pointer overflow-hidden bg-white transition-opacity hover:opacity-95"
      style={{ clipPath: TORN_PAPER_CLIP, WebkitClipPath: TORN_PAPER_CLIP }}
    >
      {/* Realistic document content */}
      <div className="absolute inset-x-0 top-[7px] bottom-[7px] overflow-hidden bg-white px-2 py-1">
        {type === "customer" && (
          <div className="scale-[0.32] origin-top-left w-[275px]">
            <div className="text-[11px] font-bold text-slate-800 mb-1">1. PARTIES</div>
            <div className="rounded border border-amber-200 bg-amber-50 p-2 text-[9px]">
              <p className="text-slate-600 leading-tight">
                This Master Services Agreement ("Agreement") is entered into as of{" "}
                <span className="font-semibold text-slate-800">July 15, 2026</span> ("Effective Date")
              </p>
              <p className="mt-1 text-slate-500">By and between:</p>
              <p className="mt-1 font-semibold text-slate-800">Zenith Analytics Inc.</p>
              <p className="text-slate-600">4th Floor, Lattice Tower, MG Road,</p>
              <p className="text-slate-600">Bengaluru, KA 560001, India</p>
              <p className="text-slate-400 text-[8px] mt-0.5">(hereinafter referred to as "Client")</p>
            </div>
          </div>
        )}

        {type === "lineItems" && (
          <div className="scale-[0.32] origin-top-left w-[275px]">
            <div className="text-[10px] font-bold text-slate-800 mb-1">SCHEDULE A: PRICING</div>
            <div className="rounded border border-amber-200 bg-amber-50 p-1.5">
              <table className="w-full text-[8px]">
                <thead>
                  <tr className="border-b border-amber-200 text-slate-600">
                    <th className="text-left py-0.5 font-medium">Item</th>
                    <th className="text-right py-0.5 font-medium">Qty</th>
                    <th className="text-right py-0.5 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-amber-100">
                    <td className="py-0.5">Growth CRM License</td>
                    <td className="text-right">25</td>
                    <td className="text-right font-medium">$30,000</td>
                  </tr>
                  <tr className="border-b border-amber-100">
                    <td className="py-0.5">Onboarding Services</td>
                    <td className="text-right">1</td>
                    <td className="text-right font-medium">$2,500</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Premium Support</td>
                    <td className="text-right">1</td>
                    <td className="text-right font-medium">$4,200</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-amber-300 bg-amber-100/50">
                    <td colSpan={2} className="py-0.5 text-right font-semibold">Total:</td>
                    <td className="text-right font-bold text-slate-800">$36,700</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {type === "billing" && (
          <div className="scale-[0.32] origin-top-left w-[275px]">
            <div className="text-[10px] font-bold text-slate-800 mb-1">4. PAYMENT TERMS</div>
            <div className="rounded border border-blue-200 bg-blue-50 p-2 text-[9px]">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <p className="text-slate-500 text-[8px]">Contract Term</p>
                  <p className="font-semibold text-slate-800">12 months</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[8px]">Billing Cycle</p>
                  <p className="font-semibold text-slate-800">Annual</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[8px]">Start Date</p>
                  <p className="font-semibold text-slate-800">July 15, 2026</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[8px]">Payment Terms</p>
                  <p className="font-semibold text-slate-800">Net 30</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === "addresses" && (
          <div className="scale-[0.32] origin-top-left w-[275px]">
            <div className="text-[10px] font-bold text-slate-800 mb-1">8. NOTICE PROVISIONS</div>
            <div className="rounded border border-green-200 bg-green-50 p-2 text-[9px]">
              <p className="text-slate-500 text-[8px] font-medium mb-0.5">To Client (Billing):</p>
              <p className="font-semibold text-slate-800">Zenith Analytics Inc.</p>
              <p className="text-slate-600">4th Floor, Lattice Tower</p>
              <p className="text-slate-600">MG Road</p>
              <p className="text-slate-600">Bengaluru, KA 560001</p>
              <p className="text-slate-600">India</p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function PDFPreviewCustomerInfo() {
  return (
    <svg viewBox="0 0 510 660" className="h-full w-full">
      <rect x="0" y="0" width="510" height="660" fill="white" />
      {/* Header */}
      <rect x="40" y="35" width="120" height="20" rx="2" fill="#1e3a5f" />
      <text x="100" y="50" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">APEX CORP</text>
      <text x="40" y="70" fontSize="9" fill="#64748b">Master Services Agreement</text>
      <text x="40" y="82" fontSize="8" fill="#94a3b8">Agreement No: MSA-2026-ZA-001</text>
      
      {/* Horizontal line */}
      <line x1="40" y1="95" x2="470" y2="95" stroke="#e2e8f0" strokeWidth="1" />
      
      {/* Section 1: PARTIES */}
      <text x="40" y="120" fontSize="11" fontWeight="bold" fill="#1e3a5f">1. PARTIES</text>
      
      {/* Highlighted customer section */}
      <rect x="40" y="130" width="430" height="100" rx="4" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
      <text x="50" y="150" fontSize="9" fill="#78716c">This Master Services Agreement ("Agreement") is entered into as of</text>
      <text x="50" y="165" fontSize="9" fontWeight="600" fill="#0f172a">July 15, 2026 ("Effective Date")</text>
      <text x="50" y="182" fontSize="9" fill="#78716c">By and between:</text>
      <text x="50" y="199" fontSize="10" fontWeight="600" fill="#0f172a">Zenith Analytics Inc.</text>
      <text x="50" y="214" fontSize="9" fill="#0f172a">4th Floor, Lattice Tower, MG Road, Bengaluru, KA 560001, India</text>
      <text x="300" y="150" fontSize="8" fill="#d97706">← Extracted</text>
      
      {/* Provider section */}
      <text x="40" y="250" fontSize="9" fill="#64748b">AND</text>
      <text x="40" y="268" fontSize="10" fontWeight="600" fill="#334155">Apex Corporation</text>
      <text x="40" y="283" fontSize="9" fill="#64748b">123 Business Street, Suite 100, San Francisco, CA 94104, USA</text>
      <text x="40" y="298" fontSize="9" fill="#64748b">(hereinafter referred to as "Provider")</text>
      
      {/* Section 2 */}
      <text x="40" y="330" fontSize="11" fontWeight="bold" fill="#1e3a5f">2. RECITALS</text>
      <text x="40" y="348" fontSize="9" fill="#64748b">WHEREAS, Client desires to engage Provider to provide certain software</text>
      <text x="40" y="362" fontSize="9" fill="#64748b">services and related support as described herein; and</text>
      <text x="40" y="380" fontSize="9" fill="#64748b">WHEREAS, Provider desires to provide such services to Client upon the</text>
      <text x="40" y="394" fontSize="9" fill="#64748b">terms and conditions set forth in this Agreement;</text>
      <text x="40" y="412" fontSize="9" fill="#64748b">NOW, THEREFORE, in consideration of the mutual covenants and agreements</text>
      <text x="40" y="426" fontSize="9" fill="#64748b">contained herein, the parties agree as follows:</text>
      
      {/* Section 3 */}
      <text x="40" y="460" fontSize="11" fontWeight="bold" fill="#1e3a5f">3. DEFINITIONS</text>
      <text x="40" y="478" fontSize="9" fill="#64748b">3.1 "Confidential Information" means any non-public information disclosed</text>
      <text x="40" y="492" fontSize="9" fill="#64748b">by one party to the other that is designated as confidential or that</text>
      <text x="40" y="506" fontSize="9" fill="#64748b">reasonably should be understood to be confidential.</text>
      <text x="40" y="524" fontSize="9" fill="#64748b">3.2 "Deliverables" means any work product, materials, or documentation</text>
      <text x="40" y="538" fontSize="9" fill="#64748b">created by Provider in connection with the Services.</text>
      <text x="40" y="556" fontSize="9" fill="#64748b">3.3 "Services" means the professional services to be provided by Provider</text>
      <text x="40" y="570" fontSize="9" fill="#64748b">as described in Schedule A attached hereto.</text>
      
      {/* Page footer */}
      <line x1="40" y1="620" x2="470" y2="620" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="255" y="640" textAnchor="middle" fontSize="8" fill="#94a3b8">Page 1 of 4</text>
      <text x="40" y="640" fontSize="7" fill="#cbd5e1">MSA-2026-ZA-001</text>
      <text x="470" y="640" textAnchor="end" fontSize="7" fill="#cbd5e1">Confidential</text>
    </svg>
  );
}

function PDFPreviewLineItems() {
  return (
    <svg viewBox="0 0 510 660" className="h-full w-full">
      <rect x="0" y="0" width="510" height="660" fill="white" />
      {/* Header */}
      <text x="40" y="40" fontSize="11" fontWeight="bold" fill="#1e3a5f">SCHEDULE A: SERVICES AND PRICING</text>
      <line x1="40" y1="50" x2="470" y2="50" stroke="#1e3a5f" strokeWidth="1" />
      
      <text x="40" y="75" fontSize="9" fill="#64748b">The following services shall be provided by Provider to Client pursuant to</text>
      <text x="40" y="89" fontSize="9" fill="#64748b">the terms and conditions of the Master Services Agreement:</text>
      
      {/* Highlighted pricing table */}
      <rect x="40" y="105" width="430" height="200" rx="4" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
      
      {/* Table header */}
      <rect x="45" y="110" width="420" height="25" fill="#f8fafc" rx="2" />
      <text x="55" y="127" fontSize="9" fontWeight="600" fill="#475569">Description</text>
      <text x="210" y="127" fontSize="9" fontWeight="600" fill="#475569">Frequency</text>
      <text x="290" y="127" fontSize="9" fontWeight="600" fill="#475569">Qty</text>
      <text x="340" y="127" fontSize="9" fontWeight="600" fill="#475569">Unit Price</text>
      <text x="420" y="127" fontSize="9" fontWeight="600" fill="#475569">Total</text>
      
      {/* Table rows */}
      <line x1="45" y1="140" x2="465" y2="140" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="55" y="158" fontSize="9" fontWeight="500" fill="#0f172a">Growth CRM Platform License</text>
      <text x="210" y="158" fontSize="9" fill="#64748b">Yearly</text>
      <text x="295" y="158" fontSize="9" fill="#64748b">25</text>
      <text x="340" y="158" fontSize="9" fill="#64748b">$1,200.00</text>
      <text x="420" y="158" fontSize="9" fontWeight="500" fill="#0f172a">$30,000.00</text>
      
      <line x1="45" y1="170" x2="465" y2="170" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="55" y="188" fontSize="9" fontWeight="500" fill="#0f172a">Onboarding & Training Services</text>
      <text x="210" y="188" fontSize="9" fill="#64748b">One-time</text>
      <text x="295" y="188" fontSize="9" fill="#64748b">1</text>
      <text x="340" y="188" fontSize="9" fill="#64748b">$2,500.00</text>
      <text x="420" y="188" fontSize="9" fontWeight="500" fill="#0f172a">$2,500.00</text>
      
      <line x1="45" y1="200" x2="465" y2="200" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="55" y="218" fontSize="9" fontWeight="500" fill="#0f172a">Premium Support Add-on</text>
      <text x="210" y="218" fontSize="9" fill="#64748b">Monthly</text>
      <text x="295" y="218" fontSize="9" fill="#64748b">1</text>
      <text x="340" y="218" fontSize="9" fill="#64748b">$4,200.00</text>
      <text x="420" y="218" fontSize="9" fontWeight="500" fill="#0f172a">$4,200.00</text>
      
      {/* Total row */}
      <rect x="45" y="235" width="420" height="25" fill="#f1f5f9" rx="2" />
      <text x="320" y="252" fontSize="10" fontWeight="600" fill="#334155">Total Annual Value:</text>
      <text x="420" y="252" fontSize="10" fontWeight="700" fill="#0f172a">$36,700.00</text>
      
      {/* Extracted indicator */}
      <text x="380" y="280" fontSize="8" fill="#d97706">← Pricing Extracted</text>
      
      {/* Additional terms */}
      <text x="40" y="330" fontSize="10" fontWeight="600" fill="#334155">A.1 Service Level Commitments</text>
      <text x="40" y="350" fontSize="9" fill="#64748b">Provider commits to the following service levels during the term of this Agreement:</text>
      <text x="50" y="370" fontSize="9" fill="#64748b">• System Availability: 99.9% uptime measured monthly</text>
      <text x="50" y="386" fontSize="9" fill="#64748b">• Support Response Time: 4 hours for critical issues, 24 hours for standard</text>
      <text x="50" y="402" fontSize="9" fill="#64748b">• Data Backup: Daily automated backups with 30-day retention</text>
      
      <text x="40" y="432" fontSize="10" fontWeight="600" fill="#334155">A.2 Implementation Timeline</text>
      <text x="40" y="452" fontSize="9" fill="#64748b">The implementation shall be completed within 30 days of the Effective Date</text>
      <text x="40" y="466" fontSize="9" fill="#64748b">following the standard deployment methodology as outlined in Exhibit B.</text>
      
      <text x="40" y="496" fontSize="10" fontWeight="600" fill="#334155">A.3 User Licenses</text>
      <text x="40" y="516" fontSize="9" fill="#64748b">The subscription includes twenty-five (25) named user licenses. Additional</text>
      <text x="40" y="530" fontSize="9" fill="#64748b">licenses may be purchased at the then-current list price with prorated billing.</text>
      
      {/* Page footer */}
      <line x1="40" y1="620" x2="470" y2="620" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="255" y="640" textAnchor="middle" fontSize="8" fill="#94a3b8">Page 2 of 4</text>
      <text x="40" y="640" fontSize="7" fill="#cbd5e1">MSA-2026-ZA-001 — Schedule A</text>
      <text x="470" y="640" textAnchor="end" fontSize="7" fill="#cbd5e1">Confidential</text>
    </svg>
  );
}

function PDFPreviewBillingTerms() {
  return (
    <svg viewBox="0 0 510 660" className="h-full w-full">
      <rect x="0" y="0" width="510" height="660" fill="white" />
      {/* Header */}
      <text x="40" y="40" fontSize="11" fontWeight="bold" fill="#1e3a5f">4. PAYMENT TERMS</text>
      <line x1="40" y1="50" x2="470" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
      
      <text x="40" y="75" fontSize="9" fill="#64748b">Client shall pay Provider for the Services in accordance with the following terms:</text>
      
      {/* Highlighted billing terms */}
      <rect x="40" y="90" width="430" height="145" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
      
      <text x="55" y="115" fontSize="9" fontWeight="600" fill="#475569">Contract Term:</text>
      <text x="160" y="115" fontSize="9" fontWeight="500" fill="#0f172a">12 months from Effective Date</text>
      
      <text x="55" y="137" fontSize="9" fontWeight="600" fill="#475569">Billing Cycle:</text>
      <text x="160" y="137" fontSize="9" fontWeight="500" fill="#0f172a">Annual, billed upfront</text>
      
      <text x="55" y="159" fontSize="9" fontWeight="600" fill="#475569">Start Date:</text>
      <text x="160" y="159" fontSize="9" fontWeight="500" fill="#0f172a">July 15, 2026</text>
      
      <text x="55" y="181" fontSize="9" fontWeight="600" fill="#475569">Payment Terms:</text>
      <text x="160" y="181" fontSize="9" fontWeight="500" fill="#0f172a">Net 30 days from invoice date</text>
      
      <text x="55" y="203" fontSize="9" fontWeight="600" fill="#475569">Currency:</text>
      <text x="160" y="203" fontSize="9" fontWeight="500" fill="#0f172a">USD (United States Dollars)</text>
      
      <text x="380" y="220" fontSize="8" fill="#2563eb">← Terms Extracted</text>
      
      {/* Section 4.2 */}
      <text x="40" y="260" fontSize="10" fontWeight="600" fill="#334155">4.2 Invoicing</text>
      <text x="40" y="280" fontSize="9" fill="#64748b">Provider shall submit invoices to Client at the address specified in Section 8</text>
      <text x="40" y="294" fontSize="9" fill="#64748b">(Notice Provisions) or via electronic mail to the designated billing contact.</text>
      <text x="40" y="312" fontSize="9" fill="#64748b">All invoices shall include:</text>
      <text x="50" y="330" fontSize="9" fill="#64748b">• Invoice number and date</text>
      <text x="50" y="346" fontSize="9" fill="#64748b">• Description of services rendered</text>
      <text x="50" y="362" fontSize="9" fill="#64748b">• Applicable taxes (if any)</text>
      <text x="50" y="378" fontSize="9" fill="#64748b">• Purchase Order number (if required by Client)</text>
      
      {/* Section 4.3 */}
      <text x="40" y="408" fontSize="10" fontWeight="600" fill="#334155">4.3 Late Payment</text>
      <text x="40" y="428" fontSize="9" fill="#64748b">Any amounts not paid when due shall bear interest at the rate of one and</text>
      <text x="40" y="442" fontSize="9" fill="#64748b">one-half percent (1.5%) per month, or the maximum rate permitted by</text>
      <text x="40" y="456" fontSize="9" fill="#64748b">applicable law, whichever is less.</text>
      
      {/* Section 4.4 */}
      <text x="40" y="486" fontSize="10" fontWeight="600" fill="#334155">4.4 Taxes</text>
      <text x="40" y="506" fontSize="9" fill="#64748b">All fees are exclusive of applicable taxes. Client shall be responsible for all</text>
      <text x="40" y="520" fontSize="9" fill="#64748b">applicable sales, use, value-added, and similar taxes arising from the</text>
      <text x="40" y="534" fontSize="9" fill="#64748b">performance of this Agreement, excluding taxes based on Provider's income.</text>
      
      {/* Section 5 header */}
      <text x="40" y="570" fontSize="11" fontWeight="bold" fill="#1e3a5f">5. TERM AND TERMINATION</text>
      <text x="40" y="590" fontSize="9" fill="#64748b">5.1 This Agreement shall commence on the Effective Date and continue for</text>
      
      {/* Page footer */}
      <line x1="40" y1="620" x2="470" y2="620" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="255" y="640" textAnchor="middle" fontSize="8" fill="#94a3b8">Page 3 of 4</text>
      <text x="40" y="640" fontSize="7" fill="#cbd5e1">MSA-2026-ZA-001</text>
      <text x="470" y="640" textAnchor="end" fontSize="7" fill="#cbd5e1">Confidential</text>
    </svg>
  );
}

function PDFPreviewAddresses() {
  return (
    <svg viewBox="0 0 510 660" className="h-full w-full">
      <rect x="0" y="0" width="510" height="660" fill="white" />
      {/* Continuing from previous page */}
      <text x="40" y="40" fontSize="9" fill="#64748b">terminated earlier in accordance with the provisions herein.</text>
      
      {/* Section 7 */}
      <text x="40" y="70" fontSize="11" fontWeight="bold" fill="#1e3a5f">7. CONFIDENTIALITY</text>
      <text x="40" y="92" fontSize="9" fill="#64748b">Each party agrees to hold in confidence all Confidential Information of the</text>
      <text x="40" y="106" fontSize="9" fill="#64748b">other party and to use such information only for purposes of this Agreement.</text>
      
      {/* Section 8 */}
      <text x="40" y="140" fontSize="11" fontWeight="bold" fill="#1e3a5f">8. NOTICE PROVISIONS</text>
      <text x="40" y="162" fontSize="9" fill="#64748b">All notices required or permitted under this Agreement shall be in writing and</text>
      <text x="40" y="176" fontSize="9" fill="#64748b">delivered to the following addresses:</text>
      
      {/* Highlighted address section */}
      <rect x="40" y="190" width="430" height="150" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
      
      <text x="55" y="215" fontSize="9" fontWeight="600" fill="#475569">To Client (Billing Address):</text>
      <text x="55" y="232" fontSize="9" fontWeight="500" fill="#0f172a">Zenith Analytics Inc.</text>
      <text x="55" y="247" fontSize="9" fill="#0f172a">4th Floor, Lattice Tower</text>
      <text x="55" y="262" fontSize="9" fill="#0f172a">MG Road</text>
      <text x="55" y="277" fontSize="9" fill="#0f172a">Bengaluru, KA 560001</text>
      <text x="55" y="292" fontSize="9" fill="#0f172a">India</text>
      
      <text x="280" y="215" fontSize="9" fontWeight="600" fill="#475569">To Provider:</text>
      <text x="280" y="232" fontSize="9" fontWeight="500" fill="#0f172a">Apex Corporation</text>
      <text x="280" y="247" fontSize="9" fill="#0f172a">123 Business Street, Suite 100</text>
      <text x="280" y="262" fontSize="9" fill="#0f172a">San Francisco, CA 94104</text>
      <text x="280" y="277" fontSize="9" fill="#0f172a">United States</text>
      
      <text x="380" y="325" fontSize="8" fill="#16a34a">← Address Extracted</text>
      
      {/* Section 9 */}
      <text x="40" y="365" fontSize="11" fontWeight="bold" fill="#1e3a5f">9. GENERAL PROVISIONS</text>
      <text x="40" y="387" fontSize="9" fill="#64748b">9.1 Entire Agreement. This Agreement constitutes the entire agreement between</text>
      <text x="40" y="401" fontSize="9" fill="#64748b">the parties with respect to the subject matter hereof.</text>
      <text x="40" y="419" fontSize="9" fill="#64748b">9.2 Amendment. This Agreement may not be modified except in writing signed</text>
      <text x="40" y="433" fontSize="9" fill="#64748b">by both parties.</text>
      
      {/* Signature section */}
      <text x="40" y="470" fontSize="11" fontWeight="bold" fill="#1e3a5f">IN WITNESS WHEREOF</text>
      <text x="40" y="492" fontSize="9" fill="#64748b">The parties have executed this Agreement as of the Effective Date.</text>
      
      {/* Signature boxes */}
      <rect x="40" y="510" width="200" height="80" fill="none" stroke="#cbd5e1" strokeWidth="1" rx="2" />
      <text x="50" y="530" fontSize="8" fill="#94a3b8">CLIENT:</text>
      <text x="50" y="548" fontSize="9" fontWeight="500" fill="#334155">Zenith Analytics Inc.</text>
      <line x1="50" y1="575" x2="220" y2="575" stroke="#cbd5e1" strokeWidth="0.5" />
      <text x="50" y="585" fontSize="7" fill="#94a3b8">Authorized Signature / Date</text>
      
      <rect x="270" y="510" width="200" height="80" fill="none" stroke="#cbd5e1" strokeWidth="1" rx="2" />
      <text x="280" y="530" fontSize="8" fill="#94a3b8">PROVIDER:</text>
      <text x="280" y="548" fontSize="9" fontWeight="500" fill="#334155">Apex Corporation</text>
      <line x1="280" y1="575" x2="450" y2="575" stroke="#cbd5e1" strokeWidth="0.5" />
      <text x="280" y="585" fontSize="7" fill="#94a3b8">Authorized Signature / Date</text>
      
      {/* Page footer */}
      <line x1="40" y1="620" x2="470" y2="620" stroke="#e2e8f0" strokeWidth="0.5" />
      <text x="255" y="640" textAnchor="middle" fontSize="8" fill="#94a3b8">Page 4 of 4</text>
      <text x="40" y="640" fontSize="7" fill="#cbd5e1">MSA-2026-ZA-001</text>
      <text x="470" y="640" textAnchor="end" fontSize="7" fill="#cbd5e1">Confidential</text>
    </svg>
  );
}

function PDFPreviewModal({
  open,
  onClose,
  label,
  pageNum,
  type,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  pageNum: number;
  type: "customer" | "lineItems" | "billing" | "addresses";
}) {
  if (!open) return null;

  const renderPreview = () => {
    switch (type) {
      case "customer":
        return <PDFPreviewCustomerInfo />;
      case "lineItems":
        return <PDFPreviewLineItems />;
      case "billing":
        return <PDFPreviewBillingTerms />;
      case "addresses":
        return <PDFPreviewAddresses />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
        >
          <X size={16} />
        </button>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-[16px] font-semibold text-gray-900">{label}</h3>
            <p className="text-[13px] text-gray-500">Contract PDF — Page {pageNum}</p>
          </div>
          <div className="w-[510px] rounded-lg border border-gray-200 bg-white shadow-sm">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Note {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  isPinned: boolean;
  isResolved: boolean;
}

function NoteItem({
  note,
  onPin,
  onResolve,
}: {
  note: Note;
  onPin: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex min-w-0 items-start gap-2 py-0.5 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Author avatar */}
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold",
          note.isResolved
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-100 text-blue-700"
        )}
      >
        {note.authorInitials}
      </div>

      {/* Note content */}
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate text-[11px] font-medium",
              note.isResolved ? "text-gray-400" : "text-gray-700"
            )}
          >
            {note.author}
          </span>
          <span className="shrink-0 text-[10px] text-gray-400">·</span>
          <span className="shrink-0 text-[10px] text-gray-400">{note.timestamp}</span>
          {note.isPinned && !note.isResolved && (
            <Pin size={10} className="shrink-0 fill-blue-500 text-blue-500" />
          )}
        </div>
        <p
          className={cn(
            "mt-0.5 text-[12px] leading-relaxed transition-all",
            note.isResolved ? "text-gray-400 line-through" : "text-gray-600",
            isHovered ? "whitespace-normal break-words" : "truncate"
          )}
        >
          {note.content}
        </p>
      </div>

      {/* Action buttons - show on hover */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-0.5 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          type="button"
          onClick={() => onPin(note.id)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded transition-colors",
            note.isPinned
              ? "text-blue-500 hover:bg-blue-100"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          )}
          title={note.isPinned ? "Unpin note" : "Pin note"}
        >
          <Pin size={12} className={note.isPinned ? "fill-current" : ""} />
        </button>
        <button
          type="button"
          onClick={() => onResolve(note.id)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded transition-colors",
            note.isResolved
              ? "text-emerald-500 hover:bg-emerald-100"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          )}
          title={note.isResolved ? "Unresolve note" : "Resolve note"}
        >
          <Check size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1;
    return 0;
  });
}

function NotesList({
  notes,
  onNotesChange,
  pinnedOnly = false,
}: {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  pinnedOnly?: boolean;
}) {
  const handlePin = (id: string) => {
    onNotesChange(
      notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleResolve = (id: string) => {
    onNotesChange(
      notes.map((n) => (n.id === id ? { ...n, isResolved: !n.isResolved } : n))
    );
  };

  const filtered = pinnedOnly
    ? notes.filter((n) => n.isPinned)
    : notes.filter((n) => !n.isPinned);
  const sortedNotes = sortNotes(filtered);

  if (sortedNotes.length === 0) return null;

  return (
    <div className="mt-3 flex min-w-0 flex-col gap-1.5">
      {sortedNotes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onPin={handlePin}
          onResolve={handleResolve}
        />
      ))}
    </div>
  );
}

function AddNotesButton() {
  return (
    <button
      type="button"
      className="mt-2 flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 text-[12px] font-medium text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
    >
      <Plus size={13} strokeWidth={2.5} />
      Add Note
    </button>
  );
}

export interface SourcePDF {
  id: string;
  name: string;
}

interface SectionNavItem {
  id: string;
  label: string;
  status: "ready" | "warning";
  errorCount?: number;
}

function StickySectionNav({ sections }: { sections: SectionNavItem[] }) {
  return (
    <nav
      className="sticky top-4 z-10 flex w-auto flex-col items-start gap-1 py-1"
      aria-label="Section navigation"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-transparent bg-gray-200/70 px-2.5 py-1 text-left transition-colors hover:border-gray-200/80 hover:bg-white"
        >
          {section.status === "ready" ? (
            <Check size={11} strokeWidth={2.5} className="shrink-0 text-emerald-500" aria-hidden />
          ) : (
            <TriangleAlert size={11} className="shrink-0 text-red-500" aria-hidden />
          )}
          <span className="whitespace-nowrap text-[11px] font-medium text-gray-700 group-hover:text-gray-900">
            {section.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

function OverviewPDFLinks({ onOpenPDF }: { onOpenPDF?: (pdf: SourcePDF) => void }) {
  return (
    <div className="flex flex-col py-1">
      {contractPDFs.map((file) => (
        <button
          key={file.id}
          type="button"
          onClick={() => onOpenPDF?.(file)}
          className="inline-flex items-center gap-1.5 py-2.5 text-left text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          <span>{file.name}</span>
          <ExternalLink size={12} className="shrink-0 opacity-70" aria-hidden />
        </button>
      ))}
    </div>
  );
}

export const contractPDFs: SourcePDF[] = [
  { id: "msa-main", name: "MSA-2026-ZA-001.pdf" },
  { id: "schedule-a", name: "Schedule-A-Pricing.pdf" },
  { id: "addendum", name: "Addendum-Terms.pdf" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildLineItemsErrorNote(
  lineItems: LineItem[],
  context: "overview" | "section" = "section",
): string | null {
  const unmappedItems = lineItems.filter((i) => i.mappingStatus === "needs_mapping");
  if (unmappedItems.length === 0) return null;
  const count = unmappedItems.length;
  const prefix =
    context === "overview"
      ? `Found ${count} unresolved mapping${count === 1 ? "" : "s"} in Line Items. `
      : `Found ${count} unresolved mapping${count === 1 ? "" : "s"}. `;
  return `${prefix}"${unmappedItems.map((i) => i.name).join('", "')}" could not be matched to the product catalog. Review and map before approval.`;
}

const LINE_ITEMS_ERROR_COMMENT_IDS = new Set(["overview-error", "line-items-error"]);

function isLineItemsErrorComment(id: string) {
  return LINE_ITEMS_ERROR_COMMENT_IDS.has(id);
}

const CONTENT_COL = "65fr";
const SIDEBAR_COL = "35fr";


function AINoteItem({
  content,
  targetSectionId,
  variant = "error",
  isResolved = false,
  onResolve,
}: {
  content: string;
  targetSectionId?: string;
  variant?: "error" | "comment";
  isResolved?: boolean;
  onResolve?: () => void;
}) {
  const [isRead, setIsRead] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isError = variant === "error" && !isResolved;
  const showPurpleUnread = variant === "comment" && !isRead && !isResolved;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (variant === "comment" && !isResolved) setIsRead(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleContentClick = () => {
    if (isError && targetSectionId) {
      scrollToSection(targetSectionId);
    }
  };

  const avatarClass = cn(
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
    isResolved
      ? "bg-gray-200 text-gray-500"
      : isError
        ? "bg-red-100 text-red-600"
        : showPurpleUnread
          ? "bg-purple-100 text-purple-600"
          : "bg-gray-100 text-gray-500",
  );

  const authorClass = cn(
    "truncate text-[11px] font-medium",
    isResolved ? "text-gray-400" : isError ? "text-red-700" : showPurpleUnread ? "text-purple-700" : "text-gray-700",
  );

  const contentClass = cn(
    "mt-0.5 text-[12px] leading-relaxed transition-all",
    isResolved ? "text-gray-400 line-through" : isError ? "text-red-700" : "text-gray-600",
    isHovered ? "whitespace-normal break-words" : "truncate",
  );

  return (
    <div
      className="group relative flex min-w-0 w-full items-start gap-2 py-0.5 transition-all"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={avatarClass}>
        <Sparkles size={11} />
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 overflow-hidden text-left",
          isError && targetSectionId && "cursor-pointer",
        )}
        onClick={handleContentClick}
        onKeyDown={(e) => {
          if (isError && targetSectionId && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            scrollToSection(targetSectionId);
          }
        }}
        role={isError && targetSectionId ? "button" : undefined}
        tabIndex={isError && targetSectionId ? 0 : undefined}
      >
        <div className="flex items-center gap-1.5">
          <span className={authorClass}>Apex AI</span>
          {isError && <TriangleAlert size={10} className="shrink-0 text-red-500" />}
        </div>
        <p className={contentClass}>{content}</p>
      </div>

      {onResolve && (
        <div
          className={cn(
            "flex shrink-0 items-center gap-0.5 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResolve();
            }}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded transition-colors",
              isResolved
                ? "text-emerald-500 hover:bg-emerald-100"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
            )}
            title={isResolved ? "Unresolve comment" : "Resolve comment"}
          >
            <Check size={12} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}

type ThumbnailType = "customer" | "lineItems" | "billing" | "addresses";

interface ThumbnailConfig {
  type: ThumbnailType;
  label: string;
  page: number;
}

function SectionContent({
  id,
  heading,
  ready,
  hasError,
  children,
}: {
  id: string;
  heading: string;
  ready?: boolean;
  hasError?: boolean;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-sans text-[14px] font-bold leading-tight text-gray-900">{heading}</h2>
        {ready && <ReadyBadge />}
        {hasError && <NeedsMappingBadge count={1} />}
      </div>
      {children}
    </div>
  );
}

function OverviewSidebar({
  thumbnails,
  onToggleAiCommentResolved,
  getAiCommentResolved,
  displayOverviewErrorNote,
  errorSectionId,
}: {
  thumbnails: ThumbnailConfig[];
  onToggleAiCommentResolved: (id: string) => void;
  getAiCommentResolved: (id: string) => boolean;
  displayOverviewErrorNote: string | null;
  errorSectionId: string;
}) {
  const [activePreview, setActivePreview] = useState<ThumbnailConfig | null>(null);

  return (
    <>
      <div className="flex min-w-0 max-w-full flex-col overflow-hidden">
        <div className="flex flex-wrap gap-2">
          {thumbnails.map((thumb, idx) => (
            <PDFThumbnail key={idx} type={thumb.type} onClick={() => setActivePreview(thumb)} />
          ))}
        </div>

        <div className="mt-3 min-w-0 max-w-full overflow-hidden">
          <AINoteItem
            variant="comment"
            content="Apex AI reviewed all extracted sections from the contract PDFs. Most fields match the source document and are ready for approval. Click a section on the left to jump directly to its review area."
            isResolved={getAiCommentResolved("overview-comment")}
            onResolve={() => onToggleAiCommentResolved("overview-comment")}
          />
        </div>

        {displayOverviewErrorNote && (
          <div className="mt-3 min-w-0 max-w-full overflow-hidden">
            <AINoteItem
              variant="error"
              content={displayOverviewErrorNote}
              targetSectionId={errorSectionId}
              isResolved={getAiCommentResolved("overview-error")}
              onResolve={() => onToggleAiCommentResolved("overview-error")}
            />
          </div>
        )}
      </div>

      <PDFPreviewModal
        open={activePreview !== null}
        onClose={() => setActivePreview(null)}
        label={activePreview?.label ?? ""}
        pageNum={activePreview?.page ?? 1}
        type={activePreview?.type ?? "customer"}
      />
    </>
  );
}

function SectionSidebar({
  id,
  description,
  thumbnails,
  notes,
  onNotesChange,
  errorNote,
  errorTargetSectionId,
  onToggleAiCommentResolved,
  getAiCommentResolved,
}: {
  id: string;
  description: string;
  thumbnails: ThumbnailConfig[];
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  errorNote?: string | null;
  errorTargetSectionId?: string;
  onToggleAiCommentResolved: (id: string) => void;
  getAiCommentResolved: (id: string) => boolean;
}) {
  const [activePreview, setActivePreview] = useState<ThumbnailConfig | null>(null);

  return (
    <>
      <div className="flex min-w-0 max-w-full flex-col overflow-hidden">
        <div className="flex flex-wrap gap-2">
          {thumbnails.map((thumb, idx) => (
            <PDFThumbnail key={idx} type={thumb.type} onClick={() => setActivePreview(thumb)} />
          ))}
        </div>

        <NotesList notes={notes} onNotesChange={onNotesChange} pinnedOnly />

        <div className="mt-3 min-w-0 max-w-full overflow-hidden">
          <AINoteItem
            variant="comment"
            content={description}
            isResolved={getAiCommentResolved(`${id}-comment`)}
            onResolve={() => onToggleAiCommentResolved(`${id}-comment`)}
          />
        </div>

        {errorNote && (
          <div className="mt-3 min-w-0 max-w-full overflow-hidden">
            <AINoteItem
              variant="error"
              content={errorNote}
              targetSectionId={errorTargetSectionId ?? id}
              isResolved={getAiCommentResolved(`${id}-error`)}
              onResolve={() => onToggleAiCommentResolved(`${id}-error`)}
            />
          </div>
        )}

        <NotesList notes={notes} onNotesChange={onNotesChange} />
        <AddNotesButton />
      </div>

      <PDFPreviewModal
        open={activePreview !== null}
        onClose={() => setActivePreview(null)}
        label={activePreview?.label ?? ""}
        pageNum={activePreview?.page ?? 1}
        type={activePreview?.type ?? "customer"}
      />
    </>
  );
}

// Initial dummy notes for each section
const initialCustomerNotes: Note[] = [
  {
    id: "cn-1",
    author: "Sarah Chen",
    authorInitials: "SC",
    content: "Verified legal entity name with their finance team. The registered name is correct as shown.",
    timestamp: "2h ago",
    isPinned: false,
    isResolved: true,
  },
];

const initialLineItemNotes: Note[] = [
  {
    id: "ln-1",
    author: "Mike Rodriguez",
    authorInitials: "MR",
    content: "Onboarding item needs mapping — waiting for product team to confirm if this should map to 'Professional Services' or 'Implementation Fee' in our catalog.",
    timestamp: "45m ago",
    isPinned: true,
    isResolved: false,
  },
  {
    id: "ln-2",
    author: "Sarah Chen",
    authorInitials: "SC",
    content: "Checked with sales — the 25 seat count matches the verbal agreement from the call on June 2nd.",
    timestamp: "1h ago",
    isPinned: false,
    isResolved: false,
  },
];

const initialBillingNotes: Note[] = [
  {
    id: "bn-1",
    author: "Alex Kim",
    authorInitials: "AK",
    content: "Customer requested Net 30 instead of Net 15. Approved by finance — please update payment terms before sending for approval.",
    timestamp: "3h ago",
    isPinned: true,
    isResolved: false,
  },
];

const initialAddressNotes: Note[] = [];

export function SummaryTab({
  customerDetails,
  lineItems,
  billingInfo,
  billingAddress,
  shippingAddress,
  shippingSameAsBilling,
  onCustomerDetailsChange,
  onLineItemsChange,
  onBillingInfoChange,
  onBillingAddressChange,
  onShippingAddressChange,
  onSameAsBillingChange,
  onOpenPDF,
  customerName,
}: {
  customerDetails: CustomerDetails;
  lineItems: LineItem[];
  billingInfo: BillingInfo;
  billingAddress: Address;
  shippingAddress: Address;
  shippingSameAsBilling: boolean;
  onCustomerDetailsChange: (data: CustomerDetails) => void;
  onLineItemsChange: (items: LineItem[]) => void;
  onBillingInfoChange: (data: BillingInfo) => void;
  onBillingAddressChange: (addr: Address) => void;
  onShippingAddressChange: (addr: Address) => void;
  onSameAsBillingChange: (same: boolean) => void;
  onOpenPDF?: (pdf: SourcePDF) => void;
  customerName?: string;
}) {
  const unmappedCount = lineItems.filter((i) => i.mappingStatus === "needs_mapping").length;
  const lineItemsReady = unmappedCount === 0;
  const lineItemsErrorNote = buildLineItemsErrorNote(lineItems);
  const overviewErrorNote = buildLineItemsErrorNote(lineItems, "overview");

  const [resolvedAiComments, setResolvedAiComments] = useState<Record<string, boolean>>({});
  const [lastErrorNotes, setLastErrorNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setLastErrorNotes((prev) => {
      const next = { ...prev };
      if (overviewErrorNote) next["overview-error"] = overviewErrorNote;
      if (lineItemsErrorNote) next["line-items-error"] = lineItemsErrorNote;
      return next;
    });
  }, [overviewErrorNote, lineItemsErrorNote]);

  const getAiCommentResolved = (commentId: string) => {
    if (isLineItemsErrorComment(commentId) && !lineItemsErrorNote && lastErrorNotes[commentId]) {
      return true;
    }
    return !!resolvedAiComments[commentId];
  };

  const toggleAiCommentResolved = (commentId: string) => {
    setResolvedAiComments((prev) => ({
      ...prev,
      [commentId]: !getAiCommentResolved(commentId),
    }));
  };

  // Notes state for each section
  const [customerNotes, setCustomerNotes] = useState<Note[]>(initialCustomerNotes);
  const [lineItemNotes, setLineItemNotes] = useState<Note[]>(initialLineItemNotes);
  const [billingNotes, setBillingNotes] = useState<Note[]>(initialBillingNotes);
  const [addressNotes, setAddressNotes] = useState<Note[]>(initialAddressNotes);

  const sectionNavItems: SectionNavItem[] = [
    { id: "customer-details", label: "Account", status: "ready" },
    { id: "addresses", label: "Ship & bill to", status: "ready" },
    { id: "billing-info", label: "Terms & billing", status: "ready" },
    {
      id: "line-items",
      label: "Products & pricing",
      status: lineItemsReady ? "ready" : "warning",
      errorCount: unmappedCount,
    },
  ];

  const sectionConfigs = [
    {
      id: "customer-details",
      heading: "Account",
      description: "Review and verify the customer account information extracted from the contract.",
      ready: true,
      hasError: false,
      thumbnails: [
        { type: "customer" as const, label: "Customer Information", page: 1 },
        { type: "addresses" as const, label: "Notice Provisions", page: 4 },
      ],
      notes: customerNotes,
      onNotesChange: setCustomerNotes,
      content: <CustomerDetailsTable data={customerDetails} onChange={onCustomerDetailsChange} />,
    },
    {
      id: "addresses",
      heading: "Ship & bill to",
      description: "Verify or update the billing and shipping addresses for this contract.",
      ready: true,
      hasError: false,
      thumbnails: [
        { type: "addresses" as const, label: "Address Details", page: 4 },
        { type: "customer" as const, label: "Customer Information", page: 1 },
      ],
      notes: addressNotes,
      onNotesChange: setAddressNotes,
      content: (
        <AddressesTable
          billing={billingAddress}
          shipping={shippingAddress}
          sameAsBilling={shippingSameAsBilling}
          onBillingChange={onBillingAddressChange}
          onShippingChange={onShippingAddressChange}
          onSameAsBillingChange={onSameAsBillingChange}
        />
      ),
    },
    {
      id: "billing-info",
      heading: "Terms & billing",
      description: "Configure billing settings including term, cycle, and payment terms.",
      ready: true,
      hasError: false,
      thumbnails: [{ type: "billing" as const, label: "Payment Terms", page: 3 }],
      notes: billingNotes,
      onNotesChange: setBillingNotes,
      content: <BillingInfoTable data={billingInfo} onChange={onBillingInfoChange} />,
    },
    {
      id: "line-items",
      heading: "Products & pricing",
      description: "Review the extracted line items from the contract. Items marked for mapping need to be resolved before proceeding.",
      ready: lineItemsReady,
      hasError: !lineItemsReady,
      errorNote: lineItemsErrorNote,
      thumbnails: [
        { type: "lineItems" as const, label: "Pricing Schedule", page: 2 },
        { type: "billing" as const, label: "Payment Terms", page: 3 },
        { type: "customer" as const, label: "Customer Information", page: 1 },
      ],
      notes: lineItemNotes,
      onNotesChange: setLineItemNotes,
      content: <LineItemsTable items={lineItems} onChange={onLineItemsChange} />,
    },
  ];

  const totalValue = lineItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const readyCount = 3 + (lineItemsReady ? 1 : 0);
  const aiErrorNote = buildLineItemsErrorNote(lineItems, "overview");
  const displayOverviewErrorNote = aiErrorNote ?? lastErrorNotes["overview-error"] ?? null;
  const errorSectionId = sectionNavItems.find((s) => s.status === "warning")?.id ?? "line-items";

  const overviewThumbnails: ThumbnailConfig[] = [
    { type: "customer", label: "Customer Information", page: 1 },
    { type: "lineItems", label: "Pricing Schedule", page: 2 },
    { type: "billing", label: "Payment Terms", page: 3 },
  ];

  return (
    <div className="flex gap-6 py-1">
      <div className="shrink-0">
        <StickySectionNav sections={sectionNavItems} />
      </div>

      <div className="min-w-0 flex-1">
        {/* Overview row */}
        <div
          className="grid gap-x-6"
          style={{ gridTemplateColumns: `${CONTENT_COL} ${SIDEBAR_COL}` }}
        >
          <div className="rounded-t-xl border-x border-t border-gray-200/70 bg-white p-5 shadow-sm">
            <div id="overview" className="scroll-mt-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="font-sans text-[14px] font-bold leading-tight text-gray-900">Contract summary</h2>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-semibold leading-4 text-violet-700">
                  <Sparkles size={11} className="shrink-0 text-violet-500" />
                  AI
                </span>
              </div>
              <p className="mb-1 text-[13px] leading-relaxed text-gray-700">
                12-month MSA with <span className="font-semibold text-gray-900">{customerName ?? customerDetails.accountName}</span>{" "}
                covering {lineItems.length} line items — Growth CRM ({lineItems.find((i) => i.name.includes("CRM"))?.quantity ?? 25} seats), onboarding services, and premium support.
                Total contract value:{" "}
                <span className="font-semibold text-gray-900">
                  ${totalValue.toLocaleString("en-US")}/yr
                </span>
                . {readyCount} of 4 sections are ready for approval.
              </p>
              <OverviewPDFLinks onOpenPDF={onOpenPDF} />
            </div>
          </div>
          <div className="min-w-0 overflow-hidden p-5">
            <OverviewSidebar
              thumbnails={overviewThumbnails}
              onToggleAiCommentResolved={toggleAiCommentResolved}
              getAiCommentResolved={getAiCommentResolved}
              displayOverviewErrorNote={displayOverviewErrorNote}
              errorSectionId={errorSectionId}
            />
          </div>
        </div>

        {/* Section rows - each row has content on left, sidebar on right */}
        {sectionConfigs.map((sec, idx) => (
          <div
            key={sec.id}
            className="grid gap-x-6"
            style={{ gridTemplateColumns: `${CONTENT_COL} ${SIDEBAR_COL}` }}
          >
            <div className={cn(
              "border-x border-t border-gray-100 bg-white p-5",
              idx === sectionConfigs.length - 1 && "rounded-b-xl border-b border-gray-200/70 shadow-sm"
            )}>
              <SectionContent
                id={sec.id}
                heading={sec.heading}
                ready={sec.ready}
                hasError={sec.hasError}
              >
                {sec.content}
              </SectionContent>
            </div>
            <div className="min-w-0 overflow-hidden p-5">
              <SectionSidebar
                id={sec.id}
                description={sec.description}
                thumbnails={sec.thumbnails}
                notes={sec.notes}
                onNotesChange={sec.onNotesChange}
                errorNote={sec.errorNote}
                errorTargetSectionId={sec.hasError ? sec.id : undefined}
                onToggleAiCommentResolved={toggleAiCommentResolved}
                getAiCommentResolved={getAiCommentResolved}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

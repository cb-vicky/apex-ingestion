import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { AICollapsedSidebar } from "@/components/assistant/AICollapsedSidebar";

/**
 * Outer shell: teal top nav, collapsible grey product nav (left), rounded grey
 * content canvas, and the collapsed AI rail (right). Mirrors the APEX layout.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-[#012A38]">
      <TopNav />
      <div className="relative z-[1] flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden bg-grey-100 pb-3">
          <main className="relative z-[2] flex min-h-0 min-w-0 flex-1 flex-col">
            <div
              data-main-scroll-container=""
              className="min-h-0 min-w-0 flex-1 overflow-auto rounded-tl-[24px] rounded-tr-[24px] bg-gray-100"
            >
              {children}
            </div>
          </main>
          <div className="flex min-h-0 w-auto shrink-0 overflow-hidden">
            <AICollapsedSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { AICollapsedSidebar } from "@/components/assistant/AICollapsedSidebar";

/**
 * Outer shell: grey top nav, collapsed AI rail (left), and flush content canvas.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-screen flex-col bg-grey-100">
      <TopNav />
      <div className="relative z-[1] flex min-h-0 flex-1 overflow-hidden">
        <AICollapsedSidebar />
        <main className="relative z-[2] flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
          <div
            data-main-scroll-container=""
            className="min-h-0 min-w-0 flex-1 overflow-auto bg-gray-100"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

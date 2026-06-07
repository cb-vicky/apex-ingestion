import { useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { AssistantProfileIcon } from "./AssistantProfileIcon";
import { cn } from "@/lib/utils";

const COLLAPSED_W = 32;
const COLLAPSED_HOVER_W = 36;
const EXPANDED_W = 320;

/**
 * Right-hand AI assistant rail. Defaults to a 32px collapsed strip with the
 * animated Chargebee "c" swirl logo. Clicking expands to a 320px chat panel
 * (placeholder content — wire your own chat in here).
 */
export function AICollapsedSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);

  const width = expanded ? EXPANDED_W : hover ? COLLAPSED_HOVER_W : COLLAPSED_W;

  return (
    <aside
      aria-label="AI assistant"
      style={{ width, transition: "width 180ms cubic-bezier(0.22,1,0.36,1)" }}
      className="squircle relative flex h-full shrink-0 flex-col overflow-hidden border-l border-gray-300 bg-slate-50"
    >
      {expanded ? (
        <div className="relative flex h-full min-h-0 flex-col">
          {/* Header */}
          <header className="flex h-[3.125rem] shrink-0 items-center gap-2 border-b border-slate-200/70 px-3">
            <AssistantProfileIcon className="h-4 w-4" />
            <span className="font-sora min-w-0 flex-1 truncate text-[13px] text-slate-900">
              <span className="font-bold">Chargebee</span> <span className="font-normal">Assistant</span>
            </span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="squircle inline-flex h-8 w-8 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-800"
              aria-label="Minimize assistant"
              title="Minimize assistant"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </header>

          {/* Placeholder chat body */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4">
            <p className="text-xs font-medium text-slate-500">Try one of these</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {["Summarize this contract", "What changed vs the quote?", "Draft the first invoice"].map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="squircle w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-800 transition hover:border-slate-300 hover:bg-slate-50/90"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Composer */}
          <footer className="shrink-0 px-3 pb-3 pt-2">
            <div className="squircle relative rounded-3xl border border-slate-200 bg-white p-1 shadow-sm">
              <textarea
                rows={1}
                placeholder="Ask Assistant..."
                className="min-h-9 w-full resize-none bg-transparent px-2 pt-1 pb-9 text-sm leading-snug text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button className="squircle absolute bottom-1.5 left-1.5 flex h-9 w-9 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100/80 hover:text-slate-600" aria-label="Add attachment">
                <Paperclip className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button className="squircle absolute bottom-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white transition hover:bg-primary-600" aria-label="Send message">
                <Send className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </footer>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="Expand AI assistant"
          title="Expand AI assistant"
          className="group flex h-full w-full items-center justify-center bg-transparent transition-colors duration-150 ease-out hover:bg-white"
        >
          <AssistantProfileIcon
            className={cn(
              "pointer-events-none h-4 w-4 transition-transform duration-200 ease-out",
              hover ? "scale-[1.125]" : "scale-100",
            )}
          />
        </button>
      )}
    </aside>
  );
}

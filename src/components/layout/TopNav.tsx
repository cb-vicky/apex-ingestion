import {
  Bell,
  ChevronDown,
  Code2,
  HelpCircle,
  Lightbulb,
  Settings,
  Star,
  UserCircle,
} from "lucide-react";

const APEX_BAR_BG = "#012A38";

function NavIconButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-7 w-7 items-center justify-center rounded text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
    >
      {children}
    </button>
  );
}

/** Small white Chargebee-style mark for the orange app tile. */
function CbMark() {
  return (
    <svg width={13} height={13} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M12 7.88164V12H7.84264L3.97746 5.99453L12 7.88164Z" fill="#fff" />
      <path d="M5.15726 11.9336C3.66295 11.7338 2.3484 10.9788 1.41583 9.89102L3.97746 5.99453L5.15726 11.9336Z" fill="#fff" />
      <path d="M3.97746 5.99453L0.179895 7.34883C0.0563017 6.89369 0 6.41617 0 5.92773C0 5.48384 0.0560453 5.05101 0.145893 4.6293L3.97746 5.99453Z" fill="#fff" />
      <path d="M12 4.10742L3.97746 5.99453L7.84264 0H12V4.10742Z" fill="#fff" />
      <path d="M3.97746 5.99453L1.41583 2.09805C2.3484 1.01018 3.66292 0.266382 5.15726 0.0554688L3.97746 5.99453Z" fill="#fff" />
    </svg>
  );
}

function SiteEntitySelectors() {
  return (
    <div className="flex h-full items-center gap-[8px]">
      <button
        type="button"
        className="flex items-center gap-1.5 rounded px-2 py-1 text-[12px] text-gray-300 hover:bg-white/10"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="font-medium text-white">Echo-corp</span>
        <span className="text-gray-400">echocorp.test.charge...</span>
        <ChevronDown size={12} className="text-gray-400" aria-hidden />
      </button>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded px-2 py-1 text-[12px] text-gray-300 hover:bg-white/10"
      >
        <span className="font-medium text-white">Germany</span>
        <span className="text-gray-400">Europe/Berlin (CET)</span>
        <ChevronDown size={12} className="text-gray-400" aria-hidden />
      </button>
    </div>
  );
}

/** Compact 36px teal top nav — orange app tile + site selectors + utility icons. */
export function TopNav() {
  return (
    <header
      className="relative z-0 flex h-9 shrink-0 items-center justify-between overflow-visible px-[12px] font-sora"
      style={{ backgroundColor: APEX_BAR_BG }}
      aria-label="Application header"
    >
      {/* Left cluster */}
      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-[8px] text-gray-300">
        <div className="squircle flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-cb-orange">
          <CbMark />
        </div>
        <SiteEntitySelectors />
      </div>

      {/* Right cluster */}
      <div className="relative z-10 flex shrink-0 items-center gap-1.5 text-gray-300">
        <button
          type="button"
          className="flex h-7 max-w-[9.5rem] items-center gap-1 rounded border border-white/15 bg-white/[0.06] px-2 text-left text-[11px] text-gray-200 transition-colors hover:border-white/25 hover:bg-white/10"
          title="Demo persona"
        >
          <UserCircle size={14} className="shrink-0 text-gray-300" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium">Operator</span>
          <ChevronDown size={12} className="shrink-0 text-gray-400" aria-hidden />
        </button>
        <NavIconButton>
          <Bell size={15} />
        </NavIconButton>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded px-2 py-1 text-[12px] text-gray-300 transition-colors hover:bg-white/10"
        >
          <Settings size={13} />
          <span>Configure Chargebee</span>
        </button>
        <NavIconButton>
          <Code2 size={15} />
        </NavIconButton>
        <NavIconButton>
          <Lightbulb size={15} />
        </NavIconButton>
        <NavIconButton>
          <Star size={15} />
        </NavIconButton>
        <NavIconButton>
          <HelpCircle size={15} />
        </NavIconButton>
        <div className="ml-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-cb-orange text-[10px] font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}

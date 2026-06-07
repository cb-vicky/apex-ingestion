# APEX Customer 360 — Starter (Contract Ingestion view)

A self-contained, faithful clone of the **Chargebee APEX Customer 360 page** as it
appears with the **Contract Ingestion** tab open. The shell chrome (top nav, tab
shapes, collapsible left nav, collapsed AI rail) is reproduced 1:1; everything
**under** the context bar is a placeholder for you to build on. Powered by a single
`src/data/mock-data.ts` file.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

Stack: Vite + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/vite`) + lucide-react.
Path alias `@` → `./src`.

## What's reproduced "as is"

| Area | File | Notes |
|---|---|---|
| Teal 36px top nav | `components/layout/TopNav.tsx` | orange CB tile, site/entity selectors, utility icons, persona pill |
| Collapsible left product nav | `components/layout/Sidebar.tsx` | defaults collapsed (48px) ↔ 210px, hover affordances, `localStorage` persisted, Chargebee-orange active row |
| Rounded grey content canvas | `components/layout/AppShell.tsx` | `rounded-tl/tr-[24px]`, `bg-grey-100` |
| Collapsed AI rail (right) | `components/assistant/AICollapsedSidebar.tsx` | 32px strip with the animated **Chargebee "c" swirl logo** (`AssistantProfileIcon.tsx`); click to expand a placeholder chat panel |
| **Trapezoidal workflow tabs** | `components/workspace/CustomerContextBar.tsx` | SVG file-folder tabs (narrower top), 62px/30px heights, `-ml-[22px]` overlap, blue active fill, white-on-collapse |
| Customer header | same | breadcrumb + team meta row, 28px customer name + priority chips, scroll-collapse |
| **Contract-ingestion sub-tab strip** | same | document switcher (left) · sequential flow tabs Summary→Invoice (center) · action area (right), hung below the tab line in a sticky pill |
| Context info pills | same | inverted-trapezoid SVG pills for non-ingestion stages |

### Key shape/color constants (in `CustomerContextBar.tsx`)
- `TOP_INSET = 18`, `TOP_R = 10` — trapezoid slant + corner radius
- `TAB_OVERLAP_CLASS = "-ml-[22px]"`, `TAB_HEIGHT = { expanded: 62, collapsed: 30 }`
- `TAB_BLUE = #2563eb`, `TAB_BLUE_DARK = #1d4ed8`, `PAGE_BG = #f3f4f6`, `BORDER_GREY = #d1d5db`
- Design tokens (`--color-grey-100`, `--color-cb-orange #ff3300`, primary/neutral scales, Inter + Sora fonts) live in `src/index.css` `@theme`.

## What's a placeholder (build here)

`components/workspace/Customer360Page.tsx` → `PlaceholderContent`. This is the working
canvas under the context bar. The active stage and ingestion sub-tab are passed in so you
can branch on them. The content column widths mirror the prototype (920px for ingestion,
860px otherwise).

## Driving everything from mock data

`src/data/mock-data.ts` is the single source of truth:
- `customer` — name, AE/CSM/Billing, ARR, renewal date
- `workflowTabs` + `initialStage` — the trapezoid tabs and which is active on load (`ingestion`)
- `priorityChips` — the red/amber chips top-right
- `ingestionDocuments` — the left document switcher
- `ingestionSubTabs` + `initialIngestionSubTab` — the Summary→Invoice flow steps (status drives ✓/!/number)
- `navItems` — the left product-nav rows

Add fields and the chrome picks them up; wire your real content into `PlaceholderContent`.

---

## Reuse prompt

> Paste this into an agent in your new repo if you want it regenerated/extended from scratch.

```text
Build a Vite + React 19 + TypeScript + Tailwind v4 app that reproduces the
"Chargebee APEX Customer 360" page with the Contract Ingestion tab open. It is a
chrome-only shell with placeholder content; a single src/data/mock-data.ts file
drives everything.

LAYOUT (top → bottom, outer → inner):
1. Full-height dark teal frame (#012A38).
2. Top nav: 36px tall, bg #012A38, font Sora. Left: 28px squircle orange
   (#ff3300) tile with a small white Chargebee mark, then two "site/entity"
   selector buttons (green dot + "Echo-corp" + faint domain; "Germany" +
   timezone). Right: a "Operator" persona pill (bordered, white/6% bg), Bell,
   "Configure Chargebee" (gear), Code, Lightbulb, Star, Help icons, then a 24px
   orange avatar circle with "A". Icons are lucide-react, ~15px, gray-400.
3. Body row: left product nav, center content canvas, right AI rail.
4. Left product nav: grey (#f3f4f6), border-r gray-300, font Sora. DEFAULTS
   COLLAPSED at 48px, expands to 210px (persist in localStorage). Collapsed shows
   a centered search tile + an expand chevron that fades in on hover. Expanded
   shows a "Go to / ⌘K" search field, a collapse button (hover-reveal), then nav
   rows (icon + label, 13px). Active row = bold Chargebee-orange text with a
   left-to-right orange/10 gradient bg. Some rows disabled (greyed). Items come
   from mock data.
5. Content canvas: bg #f3f4f6, rounded top-left/right 24px, scrollable. Contains
   the Customer 360 page.
6. Right AI rail: DEFAULTS COLLAPSED to a 32px strip (border-l gray-300, bg
   slate-50) showing ONLY an animated "Chargebee c" swirl logo centered; widens
   to 36px on hover. Click expands to ~320px placeholder chat panel (header with
   the c logo + "Chargebee Assistant", suggestion chips, a rounded composer with
   paperclip + send). The swirl logo = an SVG of the Chargebee "c" mark used as a
   clipPath over ~7 blurred animated radial-gradient blobs (red/orange/magenta/
   cyan/blue) — see AssistantProfileIcon.

CUSTOMER 360 PAGE (sticky context bar + placeholder content):
A) Header block (pl-7 pr-8): row 1 = breadcrumb (Customers › <Customer>, 13px,
   text-muted) on the left + team meta "AE: … · CSM: … · Billing: …" (12px) on
   the right. Row 2 = customer name as h1 (28px, bold, Sora) on the left + a
   right-aligned wrap of priority chips (rounded-full, 11px; red = red-50/red-200/
   red-800, amber = amber-50/amber-200/amber-900).
B) Workflow tabs: a centered, end-aligned row of TRAPEZOIDAL file-folder tabs
   (narrower at top, wider at bottom). Implement with an SVG path per tab:
   constants TOP_INSET=18, TOP_R=10; OPEN path (no Z) so the bottom edge isn't
   stroked; quadratic-curve top corners. Each tab self-measures its width via a
   ref + ResizeObserver and renders the SVG sized to it. Tab height 62px expanded
   / 30px collapsed. Adjacent tabs overlap with -ml-[22px]; z-index decreases left
   to right, active tab z-100. Fills: active = solid blue #2563eb with #1d4ed8
   stroke and white 14px Sora semibold label; inactive = page-bg #f3f4f6 with
   #d1d5db stroke and slate-600 label; hover = #e9eaed. When the header is
   collapsed, the active tab becomes white fill with blue label. Tabs:
   Overview, Tasks, Threads, Quotes, Contracts, Ingestion (ACTIVE on load),
   Invoicing, Collections, RevRec, plus a trailing "More" (⋯) button.
C) A full-width 1px separator line (#d1d5db) directly under the tabs.
D) Hung BELOW the line:
   - For the INGESTION tab: a sticky rounded-3xl bar (bg gray-100/75, backdrop
     blur) containing three sections separated by thin connector lines:
       • LEFT: a rounded-full "document switcher" pill with one button per
         document (FileText icon + filename); active = dark slate fill.
       • CENTER: a rounded-full white pill holding sequential "flow tabs"
         (Summary, Items, Billing, Addresses, Subscription, Invoice) as
         rounded-full chips, each with a 16px status badge (✓ complete / ! error /
         step number) + label. Active chip = blue-600 fill, white text, white
         badge with blue number. Complete = emerald-50/emerald-200. Pending =
         gray-50. Disabled chips (e.g. Subscription, Invoice) are 40% opacity and
         non-clickable. Thin connector line between chips turns blue once passed.
       • RIGHT: a rounded-full white pill with "Save" + "Send for approval"
         (blue) buttons.
   - For OTHER tabs: a left INVERTED-trapezoid SVG pill (wider top, narrower
     bottom; PILL_INSET=10, PILL_R=8; white-85% fill, #d1d5db stroke, soft
     drop-shadow) showing contextual data (e.g. Overview = ARR + Renewal date),
     and a right "actions" pill (bordered white, rounded-lg).
   - A spacer div reserves the hung pill's height + the line + a gap.
E) Scroll-collapse: listen to the canvas scroll container; collapse the header
   (shrink name to 16px, hide team meta + chips via opacity, shrink paddings,
   add a translucent blurred bg) when scrollTop > 50, expand when < 20
   (hysteresis).
F) Content below the bar = PLACEHOLDER. Grid centers a content column:
   920px max-width for ingestion, 860px otherwise. Render dashed-border cards
   that name the active stage / sub-tab so the page scrolls.

DATA: put customer, workflowTabs (+ initialStage="ingestion"), priorityChips,
ingestionDocuments, ingestionSubTabs (+ status per step), navItems all in
src/data/mock-data.ts and read from there.

DESIGN TOKENS (Tailwind v4 @theme in index.css): fonts Inter (sans) + Sora;
--color-cb-orange #ff3300, --color-grey-100 #f3f4f6, text-primary #111827,
text-secondary #4b5563, text-muted #6b7280, primary-500 #0472e1 /
primary-600 #0359af, border-default #e5e7eb. Add a `.squircle { corner-shape:
squircle }` utility.

Keep it chrome-faithful; do NOT redesign the shell. Leave content as placeholders.
```

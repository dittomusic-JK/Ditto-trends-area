# Pattern library adoption: tickets

Epic plus 16 tickets, in dependency order. Each ticket names the brand library page it changes, the prototype source for values, and acceptance criteria that can be checked by measuring. Source of truth for values is this repo (`src/tailwind.css` for tokens, `src/components/` and the Pattern Library page at `?section=patterns` for components) and `ditto_royalty_splits` for the Splits components. Mapping rationale is in `docs/pattern-library-mapping.md`.

Conventions used in acceptance criteria: sizes are CSS pixels at desktop unless stated; "matches prototype" means within 1px and the same colour token.

---

## EPIC: Adopt the dashboard prototype as the pattern library

**Summary.** The brand pattern library (`brand.qa.dittomusic.com/pattern-library`) keeps its structure and class names. Its values are replaced from the dashboard prototype, components the prototype uses that have no page are added, and components the prototype never uses are frozen for legacy pages. Splits is rebuilt against the result as the first worked example.

**Why.** New dashboard work is designed and signed off in the prototype. When built against the current library it comes out at the library's legacy sizes (Splits shipped at roughly twice its signed-off scale). Fixing the library once removes that gap for every feature after it.

**Done when.** Tickets PL-1 to PL-16 are closed, the Splits page on QA measures the same as the prototype, and the library site shows both themes for every changed page.

---

## PL-1: Tokens: colour values and aliases

**Page.** Core / Colour Palette.
**Source.** `src/tailwind.css` lines 58 to 126 (light) and the `.dark` block.

**Change.**
- `--brand-primary` becomes `#5f1fff` (Light Indigo). Add `--ditto-purple` as an alias.
- `--error` becomes `#ee404c`. `--soft-red` becomes `#d92121`.
- Add selection tints: `--tint-primary: #efe9ff` (light), dark value `#2a2340`.
- Add status tint set used by pills: success `#e6fbf1` / text `#0f8a4f`, warning `#fdf1cc` / text `#92400e`, danger `rgba(238,64,76,.1)` / text `#d92121`, info `rgba(40,126,247,.1)` / text `#1e63c4`. Dark text lifts: `#3fe0a0`, `#f0b429`, `#ff7070`, `#7ab3ff`.
- Dark surfaces unchanged (`#16161d`, `#1e1e27`, `#2c2c3a`). Add dark border `#2e2e3a` and dark hairline `#26262f`.

**Acceptance.**
- Colour Palette page shows the new values with class, CSS and Sass names, light and dark.
- No component page changes colour unexpectedly (visual diff of the library site before and after, differences limited to the values above).

---

## PL-2: Tokens: type scale, radius scale, spacing

**Page.** Core / Typography (plus a new "Scale" section on Core).
**Source.** Pattern Library page, "Typography" and "Cards & surfaces".

**Change.**
- Type: page title 42/900/-0.03em (30 tablet, 20 phone); section 24/900/-0.03em; card heading 16 to 18/900/-0.02em; body 14/400; body strong 14/500; meta 12; micro 11; stat value 24 to 28/900 tabular.
- Retire `.light-text` heading style for dashboard pages (keep the class, mark deprecated).
- Radius scale: 8 (`rounded-lg`), 12 (`rounded-xl`), 16 (`rounded-2xl`), 9999 (pill). 24px and 32px radii removed from component defaults.
- Spacing: card padding 20 desktop / 24 large; page gutter 16 phone, 24 tablet, 64 desktop.

**Acceptance.**
- Typography page lists the scale with weights and tracking, and a live specimen of each.
- `grep` of the Sass for `border-radius: 32px` and `24px` on component defaults returns nothing.

---

## PL-3: Buttons

**Page.** Atoms / Buttons.
**Source.** Pattern Library "Buttons"; `btn-pop-purple` in `tailwind.css`.

**Change.** All buttons are pills.
- Default (`.button`, `.primary`): 40px tall, 14/500, padding 0 20px, `--brand-primary` fill, white text, hover lift (`btn-pop-purple`).
- Secondary (`.secondary`): 1px border and text in the action colour, transparent fill.
- Tertiary: text only, 14/500.
- Black and white modifiers keep working at the new sizes.
- `.button-small`: 32px, 12/500, padding 0 12px. `.button-large`: 48px, 16/500.
- `.button-round`: 32px (small) or 36px icon circle, 16px glyph.
- New: `.lime` (`#E6FF3A` fill, `#0a0a0a` text, 700 weight) for conversion moments only.
- Retire `.button-square`.
- Disabled: `#f3f4f6` fill, `#9ca3af` text, no border.

**Acceptance.**
- Measured heights 32 / 40 / 48 on the library page.
- Splits "Add Split" pill measures 32px tall with 12px text when rebuilt (PL-16).

---

## PL-4: Form elements

**Page.** Atoms / Form Elements.
**Source.** `PerformanceForm.vue` (boxed), `DatePickerDropdown.vue` and builder steps (underline).

**Change.**
- Boxed input (dashboard default): 1px `--brand-border`, radius 8, padding 10px 14px, 14px text, placeholder `--brand-body-light`, focus border `--brand-primary`, no ring.
- Underline input (builders): border-bottom 1px `--faded-grey`, padding 10px 0, hover and focus border `--brand-primary`. Document as `.field-container.underline`.
- Label: 12/500 `--brand-body-light`, 6px below. Helper: 11px. Required mark: `*` after label. `.is-optional` keeps working.
- `.small`: boxed at padding 8px 14px.
- Select and textarea follow the boxed rules.
- Error state: border `--error`, 12px message below in `--error`.

**Acceptance.**
- Name, Email and a number field in one row share the same height and underline position (this is the Splits defect).
- Both input styles shown in light and dark.

---

## PL-5: Date picker component

**Page.** Atoms / Form Elements (`.datepicker`) becomes its own molecule page "Date picker".
**Source.** `src/views/videos/steps/DatePickerDropdown.vue`.

**Change.** Replace the native `.datepicker` behaviour with the prototype component: trigger (underline or box variant) showing "d MMM yyyy", floating 288px panel with month header, Monday-first grid, 32px day cells, selected day filled `--brand-primary`, today ringed, disabled days `--darkening-grey`. Props: `min`, `max` (inclusive), `mode` future/past, `variant`.

**Acceptance.**
- Opens on the latest pickable month when the value is empty.
- Only days inside `min`..`max` are enabled.
- Keyboard: Escape closes, outside click closes.

---

## PL-6: Tables and rank rows

**Page.** Atoms / Tables.
**Source.** Pattern Library "Tables & rank rows"; `TracklistTable.vue`; Splits `TrackRow.vue`.

**Change.**
- Set `--table-header-color` to `--brand-body-light`, header 12/400 sentence case.
- Body 14/500, row 56px, `.table-compact` 44px.
- No stripes by default; hairline `divide-y` in `--brand-border` light / `#26262f` dark. `.no-stripes` becomes the default and is deprecated.
- `.bordered-rows` kept.
- Add "rank row" variant: 32px index column, 40px artwork, title 14/500 with 12px subline, trailing value right-aligned tabular.
- Add inline-action column pattern: 32px icon buttons, 8px gap, tooltip on hover.

**Acceptance.**
- Splits table header text measures 12px and track names 14px when rebuilt.

---

## PL-7: Status pill and subscription tag

**Page.** New Atoms page "Status pill"; Atoms / Subscription Tag updated.
**Source.** `src/components/common/StatusPill.vue`, `PlanBadge.vue`.

**Change.**
- Status pill: `inline-flex`, 6px dot, 12/500 label, padding 4px 10px, pill radius, tint fill with same-hue text (tokens from PL-1). Variants `success`, `warning`, `danger`, `info`, `neutral`. This is the single status pattern for the product.
- Subscription tag: 10/600 uppercase, padding 2px 8px, radius 6, tint fill. Variants `starter`, `pro`, `label`, plus `rls`.

**Acceptance.**
- Both pages show every variant in both themes.
- Grep for ad hoc status badges in the dashboard codebase produces a migration list attached to the ticket.

---

## PL-8: Cards and panels

**Page.** Molecules / Panel.
**Source.** Pattern Library "Cards & surfaces"; `LivePerformancesView.vue` header band.

**Change.**
- `.panel`: white, radius 16, 1px `--brand-border`, padding 20 / 24.
- `.bordered` becomes the default. `.elevate` is `shadow-sm`. `.stand-out` is `shadow-xl`, floating surfaces only.
- `.small`: radius 12, padding 16.
- Add `.panel-header`: 16px vertical padding, hairline bottom border, gradient wash from `#f6f3ff` to transparent (dark `#211b33`), optional 36px icon tile.
- Add dashed variant for empty states and nudges: 2px dashed `--brand-border`, radius 16.

**Acceptance.**
- No panel on the library site measures a radius above 16px.
- Dark mode wash renders (currently ends in white).

---

## PL-9: Dropdowns, tabs and pills

**Page.** Molecules / Dropdowns, Nav Pills, Nav Tabs.
**Source.** `TopNavbar.vue` dropdowns, `LiquidTabs.vue`, `LeftSidebar.vue`.

**Change.**
- Dropdown menu: radius 16, `shadow-xl`, 1px border, padding 8px 0; items 14px, padding 10px 16px, hover `--light-grey`; trigger 14/500 with 12px chevron that rotates when open.
- Nav pills become sliding pill tabs: 32px tall, 12/500, active ink fill with white text, inactive `--light-grey` with ink text, animated active indicator. Sentence case, not uppercase.
- Nav tabs: 14/500, 2px `--brand-primary` underline on active, sentence case. `.compact` and `.nav-group` kept.

**Acceptance.**
- Library pages show the sliding indicator and sentence-case labels.
- Royalties sub-nav (Sales, Collaborations, Reports, Payouts) renders from `.nav-pills` with no page-level overrides.

---

## PL-10: Notifications and toast

**Page.** Molecules / Notification.
**Source.** `src/components/ui/Toast.vue`; inline notices across builders.

**Change.**
- Inline notice: radius 12, tint fill from PL-1 tokens, 1px tint border, 16px glyph, 14px copy, title 14/600 when present. Variants `success`, `warning`, `error`, `info`.
- Solid-colour-fill versions retired.
- `.outline` kept as the low-emphasis variant.
- Toast: ink fill (`#111` light, `#2c2c3a` dark), white 14/500, radius 12, `shadow-lg`, bottom centre 24px, auto dismiss 3.2s, optional leading glyph.

**Acceptance.**
- No notification on the library page uses a saturated background with white text.

---

## PL-11: Toggle, tooltip and counter dot

**Page.** Molecules / Toggle, Tooltip, Counter Dot.
**Source.** `IosToggle.vue`, `ToggleSwitch.vue`, `BasketItemGroup.vue` tooltip, `TopNavbar.vue` basket count.

**Change.**
- Toggle: 44x24 track, 20px knob, 2px inset, on `--brand-primary`, off `--faded-grey`, disabled at 50% opacity. Markup unchanged.
- Tooltip: ink fill, 10 to 11px white, radius 4, 6px offset, no arrow, `z-index` above cards.
- Add tooltip `.portal` variant: rendered to `body` with fixed positioning for use inside `overflow:hidden` containers. Document the positioning (anchor bottom + 6px, clamped to viewport).
- Counter dot: 16px min, 10/700, `--brand-primary` fill (amber `#f59e0b` for pending), offset -2px top and right.

**Acceptance.**
- A tooltip inside a scrolling table cell is fully visible on the library page.

---

## PL-12: File uploader and search input

**Page.** Molecules / File Uploader, Input Group.
**Source.** `MotionArtworkUpload.vue`, `MotionArtworkSlot.vue`, `SearchInput.vue`.

**Change.**
- Uploader: 2px dashed `--brand-border`, radius 16, centred 40px glyph, 14/600 title, 12px copy, spec row beneath (format, ratio, size). States: idle, dragging (border `--brand-primary`, tint fill), file present (preview filling the slot, filename, Remove link), error (border `--error`, message).
- Search input: pill, 40px tall, leading 16px glyph at 14px inset, 14px text, clear button when populated.

**Acceptance.**
- All four uploader states on the library page, both themes.

---

## PL-13: Page header and product marks

**Page.** Organisms / Header (dashboard page header section); Core / Icons (new "Product marks" section).
**Source.** `PageHeader.vue`, `public/img/products/*.svg`.

**Change.**
- Page header: product mark 48px (40 tablet, 32 phone) left of a 42/900 title, 12px gap, optional 14px subline in `--brand-body-light`, controls right-aligned on desktop and wrapped below on phone.
- Product marks: publish the sticker set (artists, catalogue, royalties, analytics-trends, publishing, live-performances, sync, neighbouring-rights, reports, payouts, basket, refer-a-friend, account, music-video-distro and its `-new` variant, distro). Rules: page headers at 48px, search rows at 20px, never inline in copy, never recoloured.
- Section headers inside Publishing switch mark and title by tab (Live Performances example).

**Acceptance.**
- Every dashboard header on QA uses a mark from the set, no emoji.
- Marks served as SVG, under 30KB each.

---

## PL-14: Dialog and slide-over

**Page.** Organisms / Dialog, Overlay Panel.
**Source.** Pattern Library "Overlays"; `MiniBasket.vue`; Splits modals.

**Change.**
- Dialog: backdrop `rgba(0,0,0,.5)`, radius 16, `shadow-2xl`, `max-width` 448 small / 576 medium / 768 large, padding 24, header title 18/900 with 32px close button top right, body 14px, actions right-aligned pill buttons with 8px gap. Keep `.dialog-container`, `.dialog`, `.medium`, `.large`, `.dialog-title`, `.dialog-body`, `.dialog-actions`.
- Slide-over: right-anchored, 448 max width, full height, ink header, body scrolls, footer pinned.

**Acceptance.**
- Splits "Copy Splits" and "First split" dialogs rebuild from `.dialog.medium` with no overrides.

---

## PL-15: New pages: stat cards, empty states, wizard bar, filter chip, charts

**Page.** New Molecules pages.
**Source.** `StatsCard.vue`, `RoyaltiesStatsCard.vue`, `EmptyState.vue`, `NewUserEmptyState.vue`, `StepIndicator.vue`, `FilterChip.vue`, `ShareBarEnhanced.vue`, `DonutChart.vue`, calendar tile in `LivePerformancesView.vue`.

**Change.** One page each, documenting anatomy, sizes, states and both themes:
- Stat card and the three-figure strip variant.
- Empty state (dashed box, 48px tint circle glyph, 14/600 title, 12px copy, optional CTA) and new-user variant with product mark.
- Wizard step bar for the builders (numbered steps, current, complete, error).
- Filter chip with leading remove glyph.
- Share bar (segmented, legend colours from `--split-*` tokens) and donut.
- Calendar tile (month band in `--brand-primary`, day 18/700).
- Inline expanding row editor pattern (edit opens under the row behind a dashed rule).

**Acceptance.**
- Each page has light and dark specimens and a props table.

---

## PL-16: Rebuild Splits against the new library

**Page.** n/a (product). Release view, Royalty Splits tab on QA.
**Source.** `ditto_royalty_splits` repo, live at ditto-services.vercel.app/royalty-splits.

**Change.** Rebuild the page using PL-3 to PL-14 outputs, no page-level overrides. Includes the missing states: first-split dialog, pending count badge on the share bar, your-share before/after persisting after save, edit pencil on saved collaborators, "Not registered yet" hint, intro line as a plain subtitle.

**Acceptance.** Measured against the prototype at 1440px:
- Content max width 820px.
- Title 20/700, release title 18/700, table header 12px, track name 14/500, share percentage 12/600.
- Add Split pill 32px tall, 12px text, blue outline.
- Card and empty-state radius 16px.
- Name, Email and Split fields share one baseline and underline.
- All five missing states present.

---

## Suggested sequencing

- Sprint 1: PL-1, PL-2, PL-3, PL-4, PL-7 (tokens and the atoms that caused the Splits drift).
- Sprint 2: PL-5, PL-6, PL-8, PL-9, PL-10, PL-11.
- Sprint 3: PL-12, PL-13, PL-14, PL-15.
- Sprint 4: PL-16, then migrate legacy pages as they're touched.

Design review checkpoint on each ticket: 15 minutes against the prototype before the ticket closes.

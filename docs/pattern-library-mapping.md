# Pattern library: mapping the dashboard prototype onto the brand library

Purpose: agree, section by section, what in `brand.qa.dittomusic.com/pattern-library` stays, what gets its values replaced from the prototype, and what has no equivalent and needs adding. The prototype (this repo, plus `ditto_royalty_splits`) is the source of truth for values. The brand library keeps its structure and class names so front end can update like for like.

Status key: **Replace values** (same component, new numbers), **Add** (no equivalent in their library), **Keep** (theirs is fine), **Retire** (prototype never uses it, freeze for legacy).

Reference pages: their library at `/pattern-library/{core,atoms,molecules,organisms}/`, the prototype's at `?section=patterns` on https://ditto-trends-area.vercel.app.

---

## 1. Core

| Theirs | Prototype equivalent | Status | Notes |
|---|---|---|---|
| Colour Palette (`--brand-*`, `--light-grey` etc.) | Same variable names in `src/tailwind.css` | **Keep names, replace a few values** | Names already match one for one. Value changes: `--brand-primary` is `#5f1fff` (Light Indigo) not `#6c5ce7`; `--error` is `#ee404c` not `#ec0515`; `--success`/`--warning`/`--info` unchanged. Add `--ditto-purple` as an alias of `--brand-primary`. Add the lavender tints used for selection states: `#efe9ff` (light) and `#2a2340` (dark). |
| Dark theme (`--dark-brand-bg*`) | `.dark` block in `tailwind.css` | **Keep, extend** | Their three dark surfaces map to ours exactly (`#16161d`, `#1e1e27`, `#2c2c3a`). Add the retarget list for arbitrary light hexes (status pill tints, lavender tints) so components don't need per-variant dark rules. |
| Typography | Satoshi, same weights | **Replace scale** | Page title: 42px/900/-0.03em desktop, 30px tablet, 20px phone. Section heading: 24px/900. Card heading: 16 to 18px/900/-0.02em. Body 14px, meta 12px, micro 11px. Their `.light-text` heading style (light with bold span) is retired for dashboard pages. Keep `.h1` to `.h6` utility classes. |
| Grid | Tailwind grid utilities | **Keep** | No conflict. Note the content max widths we use: 820px for focused tasks (Splits), full container for dashboards. |
| Icons (`#icon-*` sprite) | `src/components/icons/*.vue` plus product marks in `public/img/products/` | **Add** | Two additions: the product mark set (sticker icons for page headers and search) and the inline 24px stroke set at 1.8 to 2px. Their sprite stays for legacy. |
| Helper Classes | Tailwind | **Keep** | No action. |

## 2. Atoms

| Theirs | Prototype equivalent | Status | Notes |
|---|---|---|---|
| Buttons (default, `.primary`, `.secondary`, `.tertiary`, `.black`, `.white`, `.button-small`, `.button-large`, `.button-round`, `.button-square`, `.full-width`) | Pill buttons in Pattern Library "Buttons" | **Replace values** | All buttons are pills (`rounded-full`). Default: 40px tall, 14px/500, `px-5`. Small: 32px tall, 12px/500, `px-3`. Large: 48px, 16px. Primary: `--brand-primary` fill, white text, `btn-pop-purple` hover lift. Secondary: 1px border, transparent, border and text in the action colour. Tertiary: text only. Lime (`#E6FF3A` fill, ink text, bold) is a new variant reserved for conversion moments (Upgrade) and sits alongside black. Map: their `.button` to our primary, `.secondary` to our outline, `.tertiary` to our text button, `.button-small` to our small, `.button-round` to our icon button (32 or 36px circle). Retire `.button-square`. |
| Form Elements (`.field-container`, `.small`, `.inline`, `.datepicker`, `.is-optional`, tooltip label) | Inputs in "Forms & inputs" | **Replace values, add one** | Two input styles exist in the prototype and both need to be in the library: **boxed** (1px `--brand-border`, `rounded-lg`, `px-3.5 py-2.5`, 14px, focus border `--brand-primary`) used in dashboards, and **underline** (border-bottom only) used inside the builders. Label: 12px/500 `--brand-body-light`, 6px below. Helper text 11px. Their `.small` maps to our boxed input at `py-2`. **Add**: the custom date picker (`DatePickerDropdown`: trigger plus floating month grid, with `min`/`max` bounds and `box`/`underline` trigger variants). Their `.datepicker` class becomes this component. |
| Tables (`.table`, `.table-small`, `.table-compact`, `.no-stripes`, `.bordered-rows`, `.sort-by`, `--table-*` vars) | "Tables & rank rows" | **Replace values** | Header: 12px/400 `--brand-body-light`, no uppercase. Body: 14px/500. Row height 56px default, 44px compact. No stripes by default, `divide-y` hairline rows. Keep their `--table-padding`, `--table-indent`, `--table-header-color` variables and set them to these. Keep `.sort-by`. **Add**: rank row (number, avatar or artwork, title and subline, trailing value) as a documented table variant. |
| Lists | "List rows" | **Replace values** | Same anatomy. 14px/500 title, 12px subline, 48px min row height, optional leading 40px thumb. |
| Loader | `SkeletonLoader` | **Replace** | Skeleton blocks replace the spinner for content loads. Keep spinner for button-level waits. |
| Navbar Toggle | Mobile header burger in `TopNavbar` | **Keep** | No change. |
| Push Buttons | none | **Retire** | Nothing in the prototype uses them. |
| Subscription Tag (`.subscription-tag`, `.artist`, `.pro`, `.label`) | `PlanBadge` | **Replace values** | Same semantics. 10px/600 uppercase, `px-2 py-0.5 rounded-md`, tint fill with same-hue text. Add `starter` to match current plan names. |

## 3. Molecules

| Theirs | Prototype equivalent | Status | Notes |
|---|---|---|---|
| Basket Item | `BasketItemGroup` | **Replace** | Grouped by release with service lines, info chip tooltip via portal. Document the Teleport pattern for tooltips inside `overflow:hidden` cards. |
| Counter Dot | Count badges (basket count, pending invites) | **Replace values** | 16px min, 10px/700, `--brand-primary` fill for counts; amber for pending; `-top-0.5 -right-0.5` offset. |
| Dropdowns (`.dropdown`, `.dropdown-toggle`, `.dropdown-menu`, `.divider`) | `CustomDropdown`, nav dropdowns in `TopNavbar` | **Replace values** | Menu: `rounded-2xl`, `shadow-xl`, 1px border, `py-2`, items `px-4 py-2.5` 14px, hover `--light-grey`. Trigger text 14px/500 with 12px chevron. Keep their class names, drop the Bootstrap 3 compatibility note. |
| Input Group | Search inputs (`SearchInput`) | **Replace values** | Pill search: `rounded-full`, leading 16px glyph, `pl-10`, 14px. |
| File Uploader | Builder drop zones (`MotionArtworkUpload`, artwork upload) | **Replace** | Dashed 2px border, `rounded-2xl`, centred glyph, two-line copy, spec row beneath. Add the three states: idle, dragging, file present with preview and Remove. |
| Nav Bar | `TopNavbar` | **Replace** | 80px desktop header, links 14px/500 with 2px active underline, right cluster compacts below 1280px, burger below 768px. Dropdown groups for Videos, Rights Management, Promotion. |
| Nav Pills | `LiquidTabs` | **Replace** | Pill tabs with sliding active state. Active: ink fill, white text. Inactive: `--light-grey` fill, ink text. 32px tall, 12px/500. This replaces their uppercase pills. |
| Nav Tabs (`.nav-tabs`, `.compact`, `.nav-group`) | Sidebar section nav (`LeftSidebar`) and in-page tab rows | **Replace values** | Underline tabs: 14px/500, 2px `--brand-primary` underline on active, no uppercase. Keep `.nav-group`. |
| Notification (`.notification`, `.success`, `.warning`, `.error`, `.info`, `.outline`) | Inline notices and `Toast` | **Replace values** | Inline notice: `rounded-xl`, tint fill (`--*-lighter`), 1px tint border, 16px glyph, 14px copy, no white-on-colour fills. Toast: ink fill, white 14px/500 text, `rounded-xl`, bottom centre, 3.2s. Keep their variant class names. Retire the solid colour fill versions. |
| Pagination | none in prototype (lists use load more or scroll) | **Keep** | Leave as is until a page needs it. |
| Panel (`.panel`, `.bordered`, `.elevate`, `.stand-out`, `.small`, `.title`) | Cards in "Cards & surfaces" | **Replace values** | Card: `bg-white`, `rounded-2xl` (16px), 1px `--brand-border`, `p-5 lg:p-6`. Their `.elevate` becomes `shadow-sm`, `.stand-out` becomes `shadow-xl` for floating surfaces only. Their `.small` becomes `rounded-xl p-4`. **Add**: the tinted card header band (`from-[#f6f3ff] to-transparent` gradient with 36px icon tile) used on Live Performances and the Lyric nudge. Retire 32px radii. |
| Toggle (`.toggle`, `.full-width`, disabled states) | `IosToggle`, `ToggleSwitch` | **Replace values** | 44x24 track, 20px knob, `--brand-primary` on, `--faded-grey` off, `disabled` prop. Same markup. |
| Tooltip (`.tooltip`, `.tooltip-content`) | Hover tooltips (ink fill, 10px text) and info chip tooltips | **Replace values, add one** | Default: ink fill, white 10 to 11px, `rounded`, 6px offset, no arrow. **Add**: the portal variant (Teleport to body, fixed position) for tooltips inside clipped containers. |

## 4. Organisms

| Theirs | Prototype equivalent | Status | Notes |
|---|---|---|---|
| Header | `TopNavbar` plus page header (`PageHeader`) | **Replace** | Page header anatomy: 48px product mark left of a 42px/900 title, optional controls right, subline 14px `--brand-body-light`. Mobile: 32px mark, 20px title. |
| Dialog (`.dialog-container`, `.dialog`, `.medium`, `.large`, `.dialog-title`, `.dialog-body`, `.dialog-actions`) | Modals in "Overlays" | **Replace values** | Backdrop `bg-black/50`. Dialog `rounded-2xl`, `max-w-xl` default (medium), `max-w-md` small, `max-w-3xl` large. Header with 18px/900 title and 32px close button. Actions right-aligned, pill buttons. Keep their class names and sizes. |
| Footer | none | **Keep** | Legacy only. |
| Overlay Panel | `MiniBasket` slide-over, mobile nav drawer | **Replace values** | Right slide-over, `max-w-md`, full height, ink header. |

## 5. Not in their library, needed

These exist in the prototype and have no page in the brand library. Each needs a new page.

- Stat cards (`StatsCard`, `RoyaltiesStatsCard`): label 11px uppercase, value 24 to 28px/900 tabular, delta pill, optional glyph tile. Including the three-figure strip variant.
- Status pill (`StatusPill`): dot plus label, tint fill with same-hue text. Variants success, warning, danger, info, neutral. This is the one pill pattern for every status in the product.
- Filter chip (`FilterChip`) with leading remove glyph.
- Empty states (`EmptyState`, `NewUserEmptyState`): dashed `rounded-2xl` box, 48px tint circle glyph, 14px/600 title, 12px copy, optional CTA.
- Wizard step bar (`StepIndicator`) for the builders.
- Share bar (`ShareBarEnhanced`) and donut (`DonutChart`) for Splits.
- Calendar tile (month band over day) for date lists.
- Inline expanding row editor (Live Performances pattern): edit opens under the row behind a dashed rule rather than reusing the top form.
- Product marks: the sticker icon set and the rule for where they appear (page headers at 48px, search rows at 20px, never inline in copy).
- Gradient recipes (Create button, card header wash) and motion (hover lift, liquid tab slide, gradient shift).

## 6. Order of work

1. **Tokens first** (one PR): colour values, type scale, radius scale (8, 12, 16, 24 and full), spacing. Everything downstream inherits.
2. **Atoms**: buttons, inputs, tables, status pill, subscription tag. These are what warped Splits.
3. **Molecules**: cards and panels, dropdowns, tabs and pills, notifications, toggles, tooltips, date picker.
4. **Organisms and additions**: page header, dialog, slide-over, stat cards, empty states, wizard bar.
5. **Splits rebuilt against the new library** as the first worked example, then each legacy page migrates when it is next touched.

## 7. Working rules

- Values come from the prototype repo, not from screenshots. The Pattern Library page in the prototype is the quick reference; the components are the detail.
- Their class names stay so existing markup keeps working. Where we add a variant, we add a class, we don't rename.
- Anything the library can't express gets raised, not substituted.
- Dark mode is a token concern. No component ships without both modes checked.

# Tailwind → Ditto (SCSS) translation cheat-sheet

For handing the **video builder prototype** (`src/views/videos/`) off to the production
dashboard, which uses scoped SCSS + framework CSS variables (see
`src/components/neighbouring-rights/` for the house pattern).

**Why this is mostly mechanical:** the prototype's Tailwind utilities resolve to the *same
tokens* the SCSS framework uses (`tailwind.config.cjs` maps `ditto-*` colours to the same
`--ditto-*` / framework CSS vars). So translation is a class-string swap, not a redesign.
Logic, markup structure, flows and validation carry over untouched.

---

## ⚠️ One decision to make first: which purple?

| Token | Hex | Used by |
|---|---|---|
| `ditto-purple` (Tailwind, what the prototype uses) | `#5f1fff` | `--ditto-purple` / `--light-indigo` |
| `--brand-primary` (SCSS accent, what NR components use) | `#6c5ce7` | `var(--brand-primary)` |

These are **different purples**. Decide once whether the video builder's accent should become
`var(--brand-primary)` (#6c5ce7, matches existing SCSS components) or stay `var(--ditto-purple)`
(#5f1fff, what the prototype shows). Everything below assumes you keep `--ditto-purple`; if not,
swap `--ditto-purple` → `--brand-primary` throughout.

---

## Colours

| Tailwind class | SCSS / CSS var | Value |
|---|---|---|
| `text-ditto-purple` / `bg-ditto-purple` / `border-ditto-purple` | `var(--ditto-purple)` | `#5f1fff` |
| `text-ditto-text` | `var(--ditto-colors-light-dark-ditto-text-fill)` / `var(--blue)` | `#101f3c` |
| `text-ditto-subtext` | `var(--ditto-colors-light-dark-ditto-subtext-grey)` / `var(--ditto-grey)` | `#626984` |
| `bg-ditto-light-grey` | `var(--light-grey)` / `var(--lighter-grey)` | `#efeffc` / `#f9f9ff` |
| `border-gray-200` | `var(--faded-grey)` | `#d2d2e3` |
| `border-gray-300` | `var(--darkening-grey)` | `#c7c4d6` |
| `text-error` / `border-error` | `var(--error)` | `#ee404c` |
| `text-success` | `var(--success)` | `#00e785` |
| `text-warning` / `bg-warning` | `var(--warning)` | `#ffb100` |
| `bg-ditto-purple/10` (alpha) | `rgba($color-brand-primary, 0.1)` | — |
| `bg-ditto-purple/5` | `rgba($color-brand-primary, 0.05)` | — |
| toggle on `bg-[#34c759]` | keep literal or `var(--success)`-ish | `#34c759` |

> SCSS has hex helpers for `rgba()` maths: `$color-brand-primary`, `$color-error`,
> `$color-success`, `$color-text-fill`, `$color-border-grey` (see `_variables.scss`).

## Typography

| Tailwind | SCSS |
|---|---|
| `font-satoshi` | `font-family: $font-satoshi;` |
| `font-black` | `font-weight: 900;` |
| `font-semibold` / `font-medium` | `font-weight: 600;` / `500;` |
| `tracking-[-0.03em]` | `letter-spacing: -0.03em;` |
| `text-2xl` (headers) | `font-size: $text-h3;` (1.5rem) |
| `text-xl` | `font-size: $text-h4;` (≈1.125–1.25rem) |
| `text-sm` | `font-size: $text-sm;` (0.875rem) |
| `text-xs` / `text-[11px]` / `text-[10px]` | `font-size: $text-xs;` (0.75rem) / literal |

## Radius / shadow

| Tailwind | SCSS |
|---|---|
| `rounded-2xl` | `border-radius: $radius-card;` (1rem) |
| `rounded-xl` | `border-radius: $radius-lg;` (0.75rem) |
| `rounded-lg` | `border-radius: 0.5rem;` (literal) |
| `rounded-full` | `border-radius: 9999px;` (pills/avatars) |
| `rounded-full` on buttons | `border-radius: $radius-button;` (2rem) |
| `shadow-sm` / `shadow-lg` | `box-shadow: $shadow-card;` / framework shadow |

## Spacing & layout (1 Tailwind step = 0.25rem)

| Tailwind | CSS |
|---|---|
| `p-4` / `px-4` / `py-2.5` | `padding: 1rem` / `… 1rem` / `0.625rem …` |
| `gap-2` / `gap-3` / `gap-4` | `gap: 0.5rem / 0.75rem / 1rem` |
| `mb-1` `mb-2` `mb-6` | `margin-bottom: 0.25 / 0.5 / 1.5rem` |
| `space-y-5` | `> * + * { margin-top: 1.25rem; }` |
| `grid grid-cols-1 sm:grid-cols-2 gap-4` | `display:grid; gap:1rem;` + `@include sm { grid-template-columns: 1fr 1fr; }` |
| `flex items-center justify-between` | `display:flex; align-items:center; justify-content:space-between;` |
| responsive `sm:` / `lg:` | `@include sm { … }` / `@include lg { … }` (mixins in `_mixins.scss`) |

---

## Composite patterns (the bits worth pre-baking as ditto classes)

These recur across the builder — convert each once into a BEM block, then reuse.

**Underline text input** (`VideoMetadataStep`):
`w-full px-0 py-2.5 border-0 border-b border-gray-300 bg-transparent text-sm focus:border-ditto-purple`
→
```scss
.field-input {
  width: 100%; padding: 0.625rem 0; font-size: $text-sm;
  border: 0; border-bottom: 1px solid $color-border-grey; background: transparent;
  &:focus { outline: none; border-color: var(--ditto-purple); }
  &--error { border-color: var(--error); }
}
```

**Boxed input / dropdown trigger** (`VideoCreditsStep`, `SearchableSelect`):
`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-ditto-purple`
→ same as above but `border: 1px solid …; border-radius: $radius-lg;`

**Primary pill button:**
`px-4 py-2 rounded-full bg-ditto-purple text-white font-medium`
→ `padding:0.5rem 1rem; border-radius:$radius-button; background:var(--ditto-purple); color:#fff; font-weight:500;`

**Radio (filled circle + check):**
selected `w-6 h-6 rounded-full bg-ditto-purple` + white check svg; unselected `border-2 border-gray-300`.
→ `.radio__dot { width:1.5rem;height:1.5rem;border-radius:9999px; &--on{background:var(--ditto-purple);} &--off{border:2px solid $color-border-grey;} }`

**iOS toggle:** the `w-[51px] h-[31px]` switch is already literal px — copies straight over.

---

## Components to reuse instead of translating

- **`SearchableSelect.vue`** (new, Tailwind) ↔ there's already a house
  **`components/neighbouring-rights/CustomDropdown.vue`** with a `searchable` prop in SCSS.
  At handoff, prefer wiring the credit role dropdowns to `CustomDropdown` rather than porting
  `SearchableSelect` — same behaviour, already in the design-system style.

## Files in scope (all pure Tailwind, no `<style>` blocks)

`src/views/videos/` — `VideoBuilder.vue` + `steps/*` (Upload, Details/metadata/artists/credits,
LinkReleasePicker, SearchableSelect, SelectStores, PlanRelease, CheckContent, Review).

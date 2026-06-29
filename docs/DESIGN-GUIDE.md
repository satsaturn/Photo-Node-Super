# Photo-Node-Super — Design Guide

> Visual language, layout rules, and component patterns extracted from the v1 spec
> (`spec-v1.html`) and the canonical Edit-module mockup (`mockups/final-mockup.html`).
> Use this as the single source of truth when implementing UI — the spec defines
> *what*; this guide defines *how it looks*.

---

## 1. Colour Palette

All values below are CSS custom properties. The app uses a **light canvas** with **dark floating UI surfaces**.

### Canvas & background

| Token | Value | Usage |
| --- | --- | --- |
| `--bg` | `#e8e8ea` | Main canvas / page background (light grey) |

### Header & pill surfaces

| Token | Value | Usage |
| --- | --- | --- |
| `--hdr` | `#1f1f24` | Header bar background (near-black) |
| `--hdr-pill` | `#2a2a30` | Pill containers (module switcher, toolbar) |
| `--hdr-pill-hi` | `#34343c` | Pill hover highlight |
| `--hdr-text` | `#e8e8ec` | Header text (off-white) |
| `--hdr-muted` | `#6c6c76` | Disabled/muted header text |
| `--hdr-divider` | `#3a3a44` | Vertical dividers in header/toolbar |

### Panel surfaces (edit panel, histogram, filmstrip)

| Token | Value | Usage |
| --- | --- | --- |
| `--panel` | `#2a2a30` | Panel card backgrounds |
| `--panel-border` | `#4a4a52` | Borders on panels, sections, cards |
| `--panel-text` | `#e8e8ec` | Primary text in panels |
| `--panel-text-2` | `#a8a8b0` | Secondary text (labels, muted) |
| `--panel-text-3` | `#7a7a82` | Tertiary text (values, timestamps) |
| `--panel-hover` | `#3a3a42` | Hover state on interactive panel rows |
| `--panel-section` | `#34343c` | Section headers, histogram header |

### Accent & controls

| Token | Value | Usage |
| --- | --- | ---|
| `--accent` | `#6ea8ff` | Active tab fill, slider thumb, links |
| `--track-bg` | `#4a4a52` | Slider track background |

### Panel transparency

Panels float over the canvas. They use **semi-transparent backgrounds** with `backdrop-filter: blur()`:

```css
background: rgba(42, 42, 48, 0.75);
```

This applies to: right-column cards, histogram, edit panel, filmstrip.

---

## 2. Typography

| Property | Value |
| --- | --- |
| Font family | `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| Base size | 15px (body), 14px (header tabs, panels) |
| Section headers | 12px, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.08em` |
| Slider labels | 11px, `--panel-text-2` |
| Slider values | 10px, `--panel-text-3`, `font-variant-numeric: tabular-nums` |
| Histogram header | 10px, `text-transform: uppercase`, `letter-spacing: 0.10em`, `font-weight: 600` |
| Tab text (header) | 14px, `font-weight: 500` |
| Tab text (panel) | 11px, `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-weight: 500` |

---

## 3. Layout Rules

### 3.1 The 12px Gap Rule

The image **never touches** any floating element. Every floating element (right column, toolbar, filmstrip) is separated from the image by a **minimum 12px gap**. Fit-to-canvas and every resize gesture honour this gap.

### 3.2 Edit Module Layout (Floating Cards)

The Edit module has **no left panel**. The full centre is the photo canvas. UI elements float over it:

```
┌─────────────────────────────────────────────────────────┐
│  [module pill: Library | Edit | Nodes | Lens] [settings] │  <- z-3
│                                                          │
│  [Fit ▾] [⊕] [⛶]                                       │  <- z-3, toolbar pill
│                                                          │
│           ┌─────────────────────┐                        │
│           │      IMAGE          │   ← z-1               │
│           │   (pannable,        │                        │
│           │    zoomable)        │                        │
│           └─────────────────────┘                        │
│                                      ┌────────────┐     │
│                                      │ HISTOGRAM  │ ← z-2│
│                                      └────────────┘     │
│                                      ┌────────────┐     │
│                                      │ EDIT PANEL │ ← z-2│
│                                      │ global|mask|crop  │
│                                      │ edit list...      │
│                                      └────────────┘     │
│  ┌─────────────────────────────────────────────────────┐│
│  │ FILMSTRIP (shared, bottom)                 ← z-2   ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 3.3 Z-Stack

| Layer | z-index | Contents |
| --- | --- | --- |
| Grain overlay | 0 | Fixed, `pointer-events: none` |
| Canvas / image | 1 | Pannable, zoomable photo |
| Right column + filmstrip | 2 | Floating cards |
| Header + toolbar + resize handles | 3 | Always on top |

### 3.4 Right Column

- **Position:** absolute, top: 12px, right: 12px, bottom: 12px
- **Width:** 320px default, resizable 240–640px via left-edge drag handle
- Contains two stacked cards: histogram (top) + edit panel (bottom)
- The two cards are separated by a gap; each has independent resize handles

### 3.5 Filmstrip

- **Position:** absolute, bottom: 12px, left: 12px
- **Right offset:** `columnWidth + 24px` (maintains 12px gap from right column)
- **Height:** 74px default, resizable 74–200px via top handle
- **Frame sizing:** `frameH = max(48, stripH - 26)`, `frameW = frameH * 1.5` (3:2 aspect)
- Semi-transparent background, rounded corners (12px)

---

## 4. Component Patterns

### 4.1 Pill Containers

Used for: module switcher, toolbar, tab groups.

```css
.pill {
    display: flex;
    align-items: center;
    background: var(--hdr-pill);
    border-radius: 999px;
    padding: 4px;
}
```

### 4.2 Module Switcher Tabs

Four tabs: **Library | Edit | Nodes | Lens**. Active tab gets the accent fill. Disabled tabs (e.g. Lens in v1) are muted with `cursor: not-allowed`.

```css
.tab.active {
    background: var(--accent);
    color: #fff;
}
.tab.disabled {
    color: var(--hdr-muted);
    cursor: not-allowed;
}
```

### 4.3 Toolbar

Sits below the header (top: 58px), left-aligned. Contains:
- Zoom dropdown (`Fit ▾`)
- Divider (`1px × 20px`, `--hdr-divider`)
- Icon buttons (recenter crosshair, fullscreen)
- All inside a pill container

### 4.4 Floating Cards (Histogram + Edit Panel)

Both cards share the same visual treatment:

```css
background: rgba(42, 42, 48, 0.75);
border: 1px solid var(--panel-border);
border-radius: 12px;
```

### 4.5 Histogram Card

- **Structure:** header pill (`HISTOGRAM` label) + dark canvas area
- **Height:** 150px default, resizable 130–360px
- **Resize handle:** bottom edge (`resize-h`), and top edge from edit panel (`resize-h-top`)
- **Canvas:** SVG with stacked area paths (white @ 0.45, red @ 0.5, green @ 0.5, blue @ 0.5)

### 4.6 Edit Panel Card

- **Structure:** tab bar + scrollable edit list
- **Tabs:** `global | mask | crop` in a pill container with 3 equal-width tabs
  - Active: `--accent` fill
  - Disabled: `--panel-text-3`, greyed, tooltip
- **Edit list:** scrollable, padded 8px

### 4.7 Section (Built-in Edit)

Each built-in edit (Basic, Colour, HSL/Mix, Tone Curve, Detail) is a collapsible section:

```css
.section {
    background: var(--panel);
    border: 1px solid var(--panel-border);
    border-radius: 12px;
    margin-bottom: 8px;
}
.section-header {
    display: flex;
    align-items: center;
    padding: 8px;
    gap: 8px;
    background: var(--panel-section);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}
```

Header contains: chevron (▸/▾), label, reset icon (↺), power icon (⏻).

When expanded: `.section-controls` appears below header with 8px padding.

### 4.8 Slider

The primary control type for numeric values:

```css
.slider {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}
.slider .track {
    grid-column: 1 / -1;       /* spans full width */
    height: 3px;
    background: var(--track-bg);
    border-radius: 2px;
    position: relative;
}
.slider .track::before {
    /* thumb: 9px circle, accent colour, positioned via --pos custom property */
    content: "";
    position: absolute;
    left: var(--pos);
    top: -3px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--accent);
    transform: translateX(-50%);
}
```

- **Track height:** 3px
- **Thumb:** 9px circle, accent blue, with subtle box-shadow ring
- **Position:** controlled via `--pos` CSS custom property (e.g. `style="--pos:60%"`)
- **Value display:** right-aligned, tabular-nums, 10px

### 4.9 Toggle (Enable/Bypass)

```css
.toggle {
    width: 28px;
    height: 16px;
    background: var(--accent);
    border-radius: 999px;
    position: relative;
}
.toggle::after {
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    right: 2px;
    top: 2px;
}
.toggle.off {
    background: #5a5a62;
}
.toggle.off::after {
    right: auto;
    left: 2px;
}
```

- **On:** accent fill, white dot right
- **Off:** grey fill, white dot left
- **Size:** 28×16px, 12px dot

### 4.10 Custom Layer

A custom edit layer has a header with controls:

```
[toggle] [⋮⋮ handle] [name] [✎ edit button]
```

- **Handle:** `⋮⋮` (grab cursor, reorders within Custom Edits section)
- **Edit button:** pencil icon, opens node editor for that sheet
- **Controls area:** UI node controls appear below header when expanded

### 4.11 Section Icon Buttons

Small icon buttons in section headers (reset ↺, enable ⏻, add +):

```css
.section-icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--panel-text-3);
    border-radius: 999px;
    cursor: pointer;
}
.section-icon:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--panel-text);
}
```

---

## 5. Interaction Patterns

### 5.1 Image Pan & Zoom

- **Pan:** click-drag on image. Cursor: `grab` → `grabbing`. Uses `transform-origin: 0 0` with `translate(x,y) scale(s)`.
- **Zoom:** mouse wheel, 1.1× per tick, clamped 0.05–20×. Zoom centres on cursor position (point under cursor stays stationary).
- **Fit:** never scales up (fit scale ≤ 1). Computed from live `getBoundingClientRect()` of toolbar, right column, filmstrip, minus 12px gaps.
- **Recenter:** button in toolbar calls fit-to-canvas.

### 5.2 Resize Handles

All resize handles follow the same pattern:
- Invisible hit area (10px wide/tall)
- Visual indicator (2px line, 28px long) appears on hover at 60% opacity
- Cursor changes to `ns-resize` (vertical) or `ew-resize` (horizontal)
- Clamped ranges enforced during drag

### 5.3 Section Collapse/Expand

Click section header to toggle. Chevron changes: ▸ (collapsed) → ▾ (expanded). The `section-controls` div is hidden with `display: none` when collapsed.

### 5.4 Tab Switching

Panel tabs (global/mask/crop) and header tabs (Library/Edit/Nodes/Lens) use the same pattern: click to activate, active gets accent fill, disabled shows muted text and blocks interaction.

---

## 6. Grain Texture

The canvas background is a **single PNG of blue-noise** generated in
JavaScript on page load, with the two colours (`--bg` + a slightly
darker grain) baked directly into the pixels. There is no overlay layer,
no blend mode, no `::after` pseudo-element.

```css
body {
    background-color: var(--bg);   /* fallback, set by JS below */
}
```

```js
// Generated once, assigned to body.style.backgroundImage
document.body.style.backgroundImage  = 'url(' + dataUrl + ')';
document.body.style.backgroundSize   = '512px 512px';
document.body.style.backgroundRepeat = 'repeat';
```

Defaults: 512×512 px, 20% density, main `#e8e8ea`, grain `#d4d4d6`,
16 candidates per point, 0.5 px Gaussian blur.

Full implementation details (algorithm, tuning, app-integration plan) in
[`docs/GRAIN-TEXTURE.md`](GRAIN-TEXTURE.md).

---

## 7. Resizable Element Ranges

| Element | Default | Min | Max | Handle |
| --- | --- | --- | --- | --- |
| Right column width | 320px | 240px | 640px | Left edge or filmstrip right |
| Histogram height | 150px | 130px | 360px | Bottom edge or edit-panel top |
| Filmstrip height | 74px | 74px | 200px | Top edge |
| Filmstrip frame height | auto | 48px | — | Scales with strip height |

---

## 8. Edit List Visual Order

The global edit list displays in this fixed order (top to bottom):

1. **Lens Correction** — reserved/empty in v1 (greyed, disabled)
2. **Basic** — Exposure, Contrast, Highlights, Shadows, Whites, Blacks
3. **Colour** — Temperature, Tint, Vibrance, Saturation
4. **HSL / Mix** — per-channel hue/saturation/luminance
5. **Tone Curve** — RGB + per-channel curves
6. **Detail** — Sharpening, Noise Reduction
7. **Custom Edits** — pinned at bottom, `+` button to add

**Visual order ≠ execution order.** Customs execute by phase bucket (§6 of spec), not by panel position.

---

## 9. Disabled / Placeholder States

v1 disables several features with consistent visual treatment:

- **Disabled tabs:** `color: var(--panel-text-3)`, `cursor: not-allowed`, tooltip "Coming in a future version"
- **Disabled sections:** `.section.disabled` — header text muted, hover effect removed, no expand
- **Reserved slots:** Lens Correction shows empty with muted label, no controls

---

## 10. SVG Icons Used in Mockup

The mockup uses inline SVGs for all icons. Key icons:

| Icon | Usage | Stroke |
| --- | --- | --- |
| Gear/cog | Settings (header) | `stroke-width: 1.8` |
| Crosshair | Recenter image (toolbar) | `stroke-width: 2` |
| Expand corners | Fullscreen (toolbar) | `stroke-width: 2` |
| ↺ | Reset (section header) | Unicode |
| ⏻ | Enable/power (section header) | Unicode |
| ✎ | Edit in node editor (layer) | Unicode |
| ⋮⋮ | Drag handle (layer) | Unicode |
| + | Add custom edit | Unicode |
| ▸ / ▾ | Chevron (section collapse) | Unicode |
| caret | Dropdown caret (zoom) | CSS border trick |

---

## 11. File Locations

| File | Purpose |
| --- | --- |
| `docs/DESIGN-GUIDE.md` | This document |
| `docs/spec-v1.html` | Active v1 build spec |
| `docs/spec.html` | Historical combined spec |
| `docs/mockups/final-mockup.html` | Canonical Edit-module mockup (interactive HTML) |
| `images/edit-mockup.png` | Edit module screenshot |
| `images/Fixed-It.png` | Sample photo used in mockup |

---

## 12. Key Constraints for Implementation

1. **Light canvas, dark floating UI.** The page background is `#e8e8ea`; all panels are dark (`#2a2a30`) with rounded corners and semi-transparent backgrounds.
2. **12px gap minimum** between the image and every floating element.
3. **Rounded corners everywhere.** Pills: `999px`. Cards/panels: `12px`. Sections: `12px`. Frames: `8px`. Buttons: `999px` (pill) or `22px` (icon).
4. **Three-tier text hierarchy.** Primary (`--panel-text`), secondary (`--panel-text-2`), tertiary (`--panel-text-3`).
5. **Accent blue for active states only.** Active tab fill, slider thumbs, links. Nothing else uses the accent colour at full opacity.
6. **Semi-transparent panel backgrounds** with `rgba(42, 42, 48, 0.75)`. No `backdrop-filter` required — the mockup does not use it.
7. **Filmstrip is shared** across all four modules (Library, Edit, Nodes, Lens).
8. **No left panel** in Edit. Centre is 100% canvas.
9. **v1 disables:** mask tab, crop tab, Lens tab, before/after, copy/link prompt, batch operations.
10. **Custom sheets are linked-only** in v1 — no copy snapshot.

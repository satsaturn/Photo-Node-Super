# Library Module — Layout Description

Based on `docs/mockups/library-mockup.html`. References spec `docs/spec-v1.html` §13.

---

## 1. Canvas background

Light grey `--bg` (#e8e8ea) with a fixed SVG grain overlay (`feTurbulence`, 512×512 tile, opacity via `mix-blend-mode: overlay`, `z-index: 0`). All UI surfaces float above this.

## 2. Header (`z-index: 3`, pinned top:12px, left:12px, right:12px)

Two pills inside a flex row with 12px gap:

- **Module switcher** — one pill containing: `Library` (active, accent fill), `Edit`, `Nodes`, `Lens` (disabled, muted colour, `cursor: not-allowed`, tooltip "Coming in a future version"). 999px radius, 14px/500 font, 6px/18px tab padding.
- **Settings gear** — separate pill containing a 20px gear SVG (`stroke-width: 1.8`). Opens empty dialog stub (§15).

`.header-left` holds both pills; `.header-right` is empty (reserved).

## 3. Toolbar (`z-index: 3`, pinned top:62px, left:12px)

Single pill containing:

- **Import button** — SVG download icon + "Import" label. Tooltip: "Import photos from a folder". Triggers the import dialog (§13.4).
- **Divider** — 1px vertical line (`--hdr-divider`).
- **Thumbnail size slider** — two box icons (14px, 18px) bracketing a 100px slider track. Knob is `--accent` (#6ea8ff) 9px circle. Currently set to 140px. Label shows pixel value with tabular-nums.

## 4. Main panel (edit-panel, `z-index: 2`, floating card)

A semi-transparent floating card (`rgba(42,42,48,0.75)`, 1px `--panel-border`, 12px border-radius). Positioned with 12px gap below toolbar and 12px gap above filmstrip. Flex column, overflow hidden.

### 4a. Panel header (`--panel-section` background)

"20 PHYSICAL IMAGES" — 11px/600 uppercase, 0.08em letter-spacing, `--panel-text-2` colour. Fixed to top, not scrollable.

### 4b. Thumbnail grid (scrollable body)

CSS grid with `auto-fill` columns at `minmax(var(--thumb, 140px), 1fr)`. 8px gap between thumbnails. Each thumbnail:

- **Background** — `#1a1a1f` card with 1px `--panel-border`, 8px radius.
- **Image** — 3:2 aspect ratio, `object-fit: cover`.
- **Badge** — absolute positioned top-right pill (10px, uppercase, 999px). `New` = green (#4ec9b0) for most-recently-imported; `Active` = accent (#6ea8ff) for selected.
- **Filename** — 11px `--panel-text-2`, single-line ellipsis, separated from image by 1px `--panel-border`.

**Behaviour:**
- Click → selects (accent border, "Active" badge), syncs filmstrip
- Double-click → Edit (outline flash animation)
- Thumb size slider → adjusts `--thumb` variable, reflows grid 80–280px

## 5. Filmstrip (`z-index: 2`, pinned bottom:12px, left:12px, right:12px, height:74px)

Semi-transparent floating card (`rgba(42,42,48,0.75)`). Overflow visible (resize handles). Inner frame list has `overflow-x: auto`, matching 12px radius for corner rounding.

- **Resize handle** — top edge 10px strip, shows 28×2 centre line on hover (`ns-resize` cursor). Clamped 74–200px.
- **Frames** — 72×48px, 8px radius, `#1a1a1f` background. Active frame gets `--accent` border. Hover shows `--panel-text-3` border.
- **Synced selection** — clicking a grid thumb highlights matching filmstrip frame and vice‑versa.

## 6. Keyboard hint

Small floating card inside the main panel (top:48px, right:24px). Semi-transparent `rgba(26,26,31,0.85)` with 8px radius. Shows §13.5 shortcuts:

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` | Navigate grid |
| `Enter` | Open in Edit |
| `Esc` | Clear selection |

## 7. Not in v1

### Visible but non-functional (v1 placeholders)

| Element | Reason |
|---------|--------|
| Lens tab | Disabled placeholder — tooltip "Coming in a future version" |
| Settings gear | Visible from day one (§15), but dialog is an empty stub |

### Library-extension features (spec-library.html — deferred beyond v1)

These are **not part of the v1 spec** and are not represented in the mockup at all:

- Left source tree (folder list)
- Right metadata panel (EXIF display)
- Sort dropdown (by date, name, etc.)
- Filename search
- Multi-select (Ctrl/Cmd-click, Shift-click)
- Star ratings, flags, colour labels
- Albums / collections / smart collections
- Keywords / tags
- Face detection / people
- GPS / map view
- Batch & multi-photo operations
- Folder-watch / auto-import
- Tethered capture
- Editable metadata / IPTC
- Multi-catalog & backup/restore UI
- Missing-file / folder relink
- Duplicate detection by content hash
- XMP sidecar read/write

## 8. Z-stack summary

| Layer | Contents |
|-------|----------|
| z-0 | Grain overlay (pointer-events: none) |
| z-1 | Canvas background |
| z-2 | Main panel (edit-panel), filmstrip |
| z-3 | Header, toolbar, resize handles, annotations |

## 9. 12px gap rule

Every floating element honours 12px from its neighbours and from the viewport edges:

- Header → edge: 12px top, left, right
- Toolbar → header: 12px gap
- Main panel → toolbar: 12px gap
- Main panel → filmstrip: 12px gap
- Filmstrip → edge: 12px bottom, left, right

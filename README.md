# Photo-Node-Super

Working name for a Lightroom-style non-destructive photo editor with a node-graph
backend. **v1 is a personal project that runs on Windows 10/11** (Electron +
React + TypeScript — see `docs/spec-v1.html` §14). **A Linux port is a long-term
personal goal; the stack is cross-platform, and app logic avoids Windows-only
APIs, but no Linux work is scheduled or committed.**

## v1 scope

The app is a single window with a 4-way header — **Library | Edit | Nodes |
Lens** — where **Lens is a disabled placeholder** in v1.

- **Library** (basic) — import, browse, and select photos. v1 ships import +
  thumbnail grid + shared filmstrip only (no metadata panel, source tree, sort,
  search, multi-select).
- **Edit** — the photo editor: a right panel with **global**, **mask**, and
  **crop** tabs, where **mask and crop are disabled placeholders** in v1. The
  global tab holds the edit list of built-in edits + custom node-sheet layers
  (linked-only; no copy snapshot). Centre = photo canvas. The Lens Correction
  built-in slot is reserved/empty (bucket 0 executes as identity).
- **Nodes** — the node editor: the authoring tool for node-sheet files,
  included in full in v1 (UI node + vertices, math/utility nodes, 4-phase
  pipeline, per-sheet undo). A layer's *Edit* button in Edit switches here
  with that sheet loaded.
- **Lens** — disabled placeholder. The lens-corrector tool (authoring /
  calibration / library) is deferred; see `docs/spec-lens.html`.
- **Settings gear** (in the header, next to the module switcher) — visible
  from day one; opens an empty dialog in v1 pointing at
  `docs/spec-settings.html` for planned categories. v1 ships baked-in
  defaults only.

**v1 ships custom sheets as linked-only** — no copy/link prompt on add, no
sheet-file picker, no Pin. Those features are deferred to
`docs/spec-copy-link.html`.

## Specs

The spec is split into a v1 build target and per-feature extension specs. Open
the `.html` files directly in a browser — they are self-contained.

| File | Status | What it covers |
| --- | --- | --- |
| [`docs/spec-v1.html`](docs/spec-v1.html) | **Active build target** | v1: concept, terminology, Edit layout (global tab only; mask/crop tabs disabled), UI node & controls, layer header (trimmed), 4-phase pipeline (Lens Correction bucket 0 = identity), node editor, per-sheet undo, node-graph layout, colour-coding, node editor layout, app shell + basic Library (import + grid + filmstrip), software stack (Electron + React + TypeScript + React Flow + Tailwind + better-sqlite3 + Sharp + LibRaw, CPU-only). §15 lists all extension specs. |
| [`docs/spec-crop.html`](docs/spec-crop.html) | Extension | Crop tab — aspect ratio, straighten, flip, reset. |
| [`docs/spec-masks.html`](docs/spec-masks.html) | Extension | Mask tab — mask list + per-mask edit list, all shapes (radial, linear, brush, luminance, depth, subject). |
| [`docs/spec-lens.html`](docs/spec-lens.html) | Extension | Lens module + Lens Correction built-in — profile files, calibration, library, EXIF interpolation, JSON packs. |
| [`docs/spec-copy-link.html`](docs/spec-copy-link.html) | Extension | Copy snapshots, sheet-file picker, Pin, linked-sheet broken-link / versioning, per-sheet Copy/Link default. |
| [`docs/spec-library.html`](docs/spec-library.html) | Extension | Library extras — metadata panel, source tree, sort, search, multi-select, relink, duplicate detection, XMP, batch ops, albums/keywords/ratings. |
| [`docs/spec-gpu.html`](docs/spec-gpu.html) | Extension | GPU renderer abstraction — WebGPU preferred, WebGL2 fallback, native-addon option. |
| [`docs/spec-windows.html`](docs/spec-windows.html) | Extension | Windows shell integration — "Open with" verb, Explorer drag-drop, lens-pack storage location. |
| [`docs/spec-settings.html`](docs/spec-settings.html) | Extension (placeholder) | Settings UI — themes, UI density & typography, storage & catalog management, performance & rendering, keyboard shortcuts editor, default phase / new-sheet preferences, EXIF / metadata display prefs, workspace & window prefs. No depth yet; to be revisited. |
| [`docs/spec.html`](docs/spec.html) | Historical reference | The original combined spec covering all versions. Unchanged except for a callout pointing at `spec-v1.html` as the active build target. Kept for traceability. |
| [`docs/mockups/`](docs/mockups/) | Style reference | 25 self-contained HTML style mockups (theme/typography variations) + `index.html` gallery. **Not authoritative** — exploratory only; refer to `spec-v1.html` for current v1 scope. |

## Mockups

The `docs/mockups/` directory holds 25 self-contained HTML style mockups
exploring different UI themes (fluent light/dark, high-contrast, acrylic,
minimalist, compact, lightroom-dark, IDE-style, photo-first, editorial,
brutalist, pastel, terminal, synthwave, glass, newspaper, Y2K, organic, RISO,
zen, linear, warm-earth, cool-slate, dusk) plus an `index.html` gallery.
**They are not authoritative** — they are style exploration, not design
decisions. Refer to `spec-v1.html` for current v1 scope.

## Repo state

No source code yet; the software stack is decided in `spec-v1.html` §14.
This repository currently contains the v1 spec set and style mockups only.

```
.git/
docs/
  spec-v1.html            ← start here (active build target)
  spec-crop.html
  spec-masks.html
  spec-lens.html
  spec-copy-link.html
  spec-library.html
  spec-gpu.html
  spec-windows.html
  spec-settings.html         ← placeholder
  spec.html                ← historical combined spec (reference)
  mockups/                 ← 25 style mockups + index.html gallery
    index.html
    01-fluent-light.html … 25-fd-dusk.html
```

## Editing these specs

Each spec follows the same dark-theme HTML style with a fixed left nav. To keep
them consistent when adding new sections, copy the `<style>` block and the
section-numbering convention (`s1`, `s2`, …) from any existing spec file.
Section numbers restart at `s1` in each extension spec — they are
self-contained. Cross-references between specs are by filename + section, not
by a global numbering scheme.
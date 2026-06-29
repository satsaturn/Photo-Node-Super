# Background Grain Texture

How the canvas background gets its subtle noise. The current implementation
generates a **blue-noise** texture in JavaScript on page load and bakes the
two colours (main grey + slightly darker grain) into a single PNG. That
single image is the body's `background-image` — no overlays, no blend modes,
no `::after` pseudo-element.

Reference implementation: [`docs/mockups/final-mockup.html`](mockups/final-mockup.html)
lines 874–975.

---

## 1. Why blue noise

White noise (random per-pixel) and fractal noise (SVG `feTurbulence`) both
have visible low-frequency patterns at certain scales — clumps, stripes, or
"speckle" that the eye picks up. **Blue noise** has energy concentrated at
high frequencies only, so it reads as a uniform speckle with no detectable
structure at any zoom level. It's what renderers use for dithering and film
grain because the eye and brain both average it into a clean texture.

For a flat-colour background that needs a fine, unobtrusive texture, blue
noise is the right tool.

---

## 2. The algorithm — Mitchell's best-candidate with grid optimisation

We use Mitchell's best-candidate sampling. It's a greedy algorithm that
places points one at a time, each one chosen to be as far as possible from
all previously placed points. The result is a Poisson-disk-like
distribution that is visually equivalent to true blue noise.

### 2.1 Procedure

1. Place an initial random point.
2. For each new point:
   - Generate `CANDIDATES` (16) candidate positions uniformly at random.
   - For each candidate, compute the squared distance to the nearest
     already-placed point.
   - Keep the candidate with the largest such minimum distance.
3. Place that candidate and repeat until `width * height * DENSITY` points
   exist.

### 2.2 Grid optimisation

The naive approach is O(n²): every new candidate checks every existing
point. For ~50,000 points that's 2.5 billion distance checks — too slow
for runtime generation.

The grid optimisation reduces this to O(n) per insertion:

- The texture is divided into a grid of square cells, side length
  `cellSize = floor(1 / sqrt(DENSITY))`. This size makes each cell contain
  on average ~1 point, which is the optimum for the spatial query.
- Each cell stores a list of its points (a flat `[x, y, x, y, …]` array
  to avoid per-point object allocation).
- When evaluating a candidate, only the 3×3 cell neighbourhood needs to be
  checked. That's at most ~9 cells × ~1 point = 9 candidates compared to
  n for the naive approach.

At our default settings (512×512 @ 20% density → ~52,000 points), this
runs in roughly 0.5–1.5 seconds in a modern browser.

### 2.3 Why Mitchell's and not void-and-cluster

Void-and-cluster is the "proper" blue noise algorithm and produces
slightly better spectral characteristics. It's also considerably more
complex and slower. For a UI grain texture where the eye won't distinguish
between the two, Mitchell's is the right tradeoff: simple, fast, good
enough.

---

## 3. Rendering

The point set is rendered to a 2D canvas, then blurred, then encoded as a
PNG data URL.

### 3.1 Pixel write

`ImageData` is allocated for the full texture, initialised to the main
colour in a single tight loop (4 bytes per pixel: R, G, B, A). The point
set is then iterated and each point's pixel is overwritten with the grain
colour. This is much faster than calling `fillRect` for every point.

### 3.2 Blur

A 0.5px Gaussian blur is applied to the rendered image via
`ctx.filter = 'blur(0.5px)'`. This softens the 1px hard edges of the grain
dots so the texture reads as a continuous surface rather than as a
collection of pixels. The blur is small enough that the underlying blue
noise structure is preserved.

The blur is opt-out: set `BLUR_PX = 0` to skip it.

### 3.3 Encoding

The blurred canvas is converted to a PNG data URL via
`canvas.toDataURL('image/png')` and assigned to
`document.body.style.backgroundImage`. The data URL is what the browser
caches and reuses on subsequent paints.

---

## 4. Tiling behaviour

The texture is a single 512×512 PNG that is tiled across the viewport
(`background-repeat: repeat`). On a 1920×1080 display the image tiles
roughly 3.75× horizontally and 2.1× vertically.

Blue noise tiles invisibly because it has no low-frequency structure to
align across tile boundaries. With `stitchTiles` being a non-issue (the
image is a single generated PNG, not a procedural pattern that needs
stitching), the only way to detect tiling is to deliberately compare
tile edges at high zoom — which a user will never do.

For 4K displays (3840×2160) the tile repeats about 7.5×4.2 = 32 times.
Same result: imperceptible.

---

## 5. Configuration

All tunables live in a single `// === CONFIG ===` block at the top of
the script in `final-mockup.html`:

| Constant | Default | What it controls |
| --- | --- | --- |
| `SIZE` | `512` | Texture dimensions in pixels (square) |
| `DENSITY` | `0.20` | Fraction of pixels that are grain. Higher = denser texture, slower generation |
| `MAIN_COLOR` | `#e8e8ea` | The flat background colour (matches `--bg`) |
| `GRAIN_COLOR` | `#d4d4d6` | The grain colour. Keep contrast low — subtle is the goal |
| `CANDIDATES` | `16` | Candidates per point. Higher = better blue noise, slower |
| `BLUR_PX` | `0.5` | Gaussian blur radius. `0` disables. Softens the 1px dots |

### 5.1 Tuning guidelines

- **"Grain too coarse"** → raise `DENSITY` (e.g. `0.30`). The cost is
  linear in density: `0.20` takes ~1s, `0.30` ~1.5s, `0.40` ~2s.
- **"Grain too subtle / too obvious"** → nudge `GRAIN_COLOR`. The
  current `#d4d4d6` is 20 RGB units darker than the main `#e8e8ea`. Try
  `#d8d8da` for subtler, `#cccccc` for more visible.
- **"Grain looks pixelated, not smooth"** → raise `BLUR_PX` (e.g. `0.8`).
  Above 1px the blue noise structure starts to wash out.
- **"Generation is too slow"** → lower `DENSITY` or `SIZE`, or raise
  `CANDIDATES` (counter-intuitively, more candidates = more uniform
  distribution = fewer retries needed at high density, sometimes faster
  overall).

### 5.2 Performance

| Settings | Points | Approx. time (modern laptop) |
| --- | --- | --- |
| 512² @ 5% | 13,107 | ~150 ms |
| 512² @ 20% (default) | 52,428 | ~800 ms |
| 1024² @ 20% | 209,715 | ~3 s |
| 1024² @ 5% (old default) | 52,428 | ~800 ms |

The new default (512² @ 20%) is roughly the same cost as the old default
(1024² @ 5%) but produces a finer, smoother, subtler texture.

---

## 6. Body integration

The body has a single background — the generated texture:

```css
body {
    background-color: var(--bg);   /* fallback for the ~1s before JS runs */
    /* background-image set by JS */
}
```

```js
document.body.style.backgroundImage  = 'url(' + url + ')';
document.body.style.backgroundSize   = SIZE + 'px ' + SIZE + 'px';
document.body.style.backgroundRepeat = 'repeat';
```

`background-color: var(--bg)` stays in CSS as a fallback so the canvas
isn't blank during the ~1s of generation. Once the script runs, the
generated image replaces it.

There is no `::after` pseudo-element, no `mix-blend-mode`, no second
background layer. The grain is the background.

---

## 7. App integration (planned for v1)

The mockup generates the texture on every page load. The real app will
do it differently:

### 7.1 Cache by config key

The texture is a pure function of the config (`SIZE`, `DENSITY`,
`MAIN_COLOR`, `GRAIN_COLOR`, `CANDIDATES`, `BLUR_PX`, plus a random
seed). Hash the config to a key; if the key matches the cached
texture, skip generation entirely.

### 7.2 Persist to disk

Encode the generated PNG as a file (e.g. `grain-{hash}.png` in the
user's app data directory) and load it as a normal asset on subsequent
starts. Regeneration only happens when the user changes a grain setting
in Theme Settings.

### 7.3 Live update on theme change

When the user changes theme settings (colour, density), call
`window.regenerateGrain(newConfig)` — exposed for exactly this purpose.
The function regenerates the texture, encodes it, and assigns the new
data URL to `body.style.backgroundImage`. The browser will repaint
seamlessly.

### 7.4 Throttle

If theme settings expose live sliders for density or colour, debounce
the regeneration to ~200ms so we're not regenerating on every keystroke.
Or render to an `OffscreenCanvas` and only swap in once generation
completes.

---

## 8. Why we left SVG `feTurbulence` behind

The earlier mockup used an inline SVG `<feTurbulence>` filter as a CSS
background image. It was functional but had three issues:

1. **Tiling was visible at 240px and even at 512px** — fractal noise has
   enough low-frequency structure for the eye to detect the repeat.
2. **Octave count was a tradeoff** — 2 octaves gave flat-looking grain,
   4 octaves added depth but also added visible patterns.
3. **Blend-mode tricks (overlay, soft-light) added complexity** for
   marginal visual gain over a properly chosen colour pair.

The blue-noise + two-colour bake-in approach solves all three: the
texture has no detectable low-frequency structure, no per-octave
tradeoff, and no compositing tricks. The two colours (`--bg` + a
slightly darker shade) are baked directly into the pixels.

---

## 9. File locations

- **Reference implementation**: [`docs/mockups/final-mockup.html`](mockups/final-mockup.html)
  (script block at the end of `<body>`)
- **Design reference**: [`docs/DESIGN-GUIDE.md`](DESIGN-GUIDE.md) §6
- **Theme spec**: [`docs/spec-settings.html`](spec-settings.html) (placeholder —
  grain settings are a planned category, not yet specced)

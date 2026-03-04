# qlinks — Design Document

A personal, self-hosted quick-links homepage.  The purpose is to provide a
browser-agnostic replacement for the native "shortcuts" or "favorites" grid
found in mobile browsers — one that is consistent across every device and
browser, owned by the user, and independent of any browser's local
configuration.

---

## Concept

The page displays a grid of clickable tiles.  Each tile has a square icon and
a short text label beneath it.  Tapping or clicking a tile navigates directly
to the target URL.  There is no search bar, no widgets, no feeds — only the
grid of links.

The page is set as the browser's homepage or new-tab URL.  It is served as a
static site from a personal server.

---

## Layout

The grid fills the available viewport width using as many columns as fit, with
a defined minimum tile width.  Columns are equal-width and expand to fill
remaining space.  The grid is horizontally centered with a maximum total width
to prevent excessive spread on large displays.

Behavior across screen widths:

- **Narrow (phone portrait):** ~4 columns
- **Medium (landscape / small tablet):** ~6–8 columns
- **Wide (tablet or desktop):** ~10–13 columns, capped at max-width

The header (site title) spans the full grid width above the tiles.

---

## Tile Design

Each tile is a vertical stack: icon on top, label below.

- **Icon:** Square with rounded corners, fixed pixel size, `cover`-fit so any
  source image fills the frame cleanly regardless of its aspect ratio or
  internal padding.
- **Label:** Short text, centered, clamped to two lines maximum, slightly
  muted white on dark backgrounds.
- **Tap feedback:** Slight opacity reduction and scale-down on press — no
  hover state needed (touch-primary interface).
- No borders, no drop shadows, no cards.  Tiles are visually minimal.

---

## Visual Theme

Dark background by default.  White/near-white text.  The overall aesthetic
matches a native OS home screen grid rather than a web page.

---

## Background

The page background is configurable independently of the tile content:

- **Color:** A solid CSS color value applied to the page background.  Defaults
  to a near-black dark tone.
- **Image:** An optional full-bleed background image.  When set, the image is
  scaled to cover the entire viewport and fixed in place (does not scroll with
  content).  The color remains active underneath and shows through transparency
  or on image load failure.

When no image is configured, only the color applies.

---

## Configuration

All user-editable content lives in flat data files, separate from code:

### Site config
A single key/value config file controls site-wide appearance:

| Key | Type | Description |
|---|---|---|
| `header_text` | string | Text displayed in the page header above the grid |
| `background_color` | string | CSS color for the page background |
| `background_img` | string or null | Path to a background image, or null for none |

### Link definitions
An ordered list of link entries.  Each entry defines one tile:

| Field | Type | Description |
|---|---|---|
| `label` | string | Short display name shown below the icon |
| `url` | string | Full URL the tile navigates to |
| `icon` | string | Path to the tile's icon image |

Order in the list determines order in the grid, left-to-right, top-to-bottom.

---

## Icons

Icons are static image files stored with the project and served alongside the
page.  They are not fetched at runtime from external services.

Target source for icons (in order of preference):

1. **Apple Touch Icon** — Most major sites publish a high-resolution PNG
   (typically 180×180) intended for home screen use.  Common paths:
   `https://example.com/apple-touch-icon.png` or discoverable via a `<link>`
   tag in the site's HTML source.
2. **Google Favicon API** — Returns a site's favicon at a requested size.
   Useful fallback when no touch icon exists, though quality may be lower.

Save icons locally as PNG files.  128×128 or larger recommended.  The grid
renders them at a fixed smaller display size, so higher source resolution
provides better sharpness on high-DPI screens.

---

## Build & Deployment

The site is compiled from source into a set of static files (HTML, CSS, JS,
images).  No server-side logic is required at runtime — the output is served
directly from a web server as plain files.

- Editing links or appearance means editing the config/data files and
  rebuilding.
- Background images are placed in the project's public/static asset directory
  and referenced by path in the config file.
- The compiled output is deployed to a web server.  A reverse proxy handles
  HTTPS and can apply cache headers to static assets.

Recommended cache strategy:

- Hashed/fingerprinted JS and CSS assets: aggressive long-term caching
- Icon and image files: moderate cache (days to a week), since filenames may
  not change when content is replaced

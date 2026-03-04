# qlinks

A quick-links homepage designed for use as a new-tab/homepage in Firefox (or
other browsers) across phones, tablets, and desktop browsers.  Icons fill
columns dynamically based on viewport width.

Hosted as static files behind nginx at `https://qlinks.unit03.net`.

## Stack

- **Runtime / Package Manager:** [Bun](https://bun.sh)
- **Build Tool:** [Vite](https://vite.dev) (vanilla TypeScript)
- **Output:** Static HTML/CSS/JS

## Project Setup

Scaffolded with Bun + Vite vanilla-ts template:

```bash
bun create vite qlinks --template vanilla-ts
cd qlinks
bun install
```

Boilerplate files removed after scaffolding:
- `src/counter.ts`
- `src/typescript.svg`
- `public/vite.svg`

## File Overview

| File | Purpose |
|---|---|
| `index.html` | App shell with iOS-optimized meta tags |
| `src/main.ts` | Entry point — loads config and link data, renders the grid |
| `src/types.ts` | `QuickLink` and `SiteConfig` interface definitions |
| `src/config.json` | Site-wide settings (background color, background image) |
| `src/links.json` | Link definitions (label, url, icon path) |
| `src/style.css` | Dark theme, responsive CSS grid, touch feedback |
| `public/icons/*.png` | Site icons (sourced from apple-touch-icons / Google favicon API) |
| `public/favicon.ico` | Placeholder favicon |
| `vite.config.ts` | Vite config with `allowedHosts: true` for LAN dev access |

## Development

```bash
bun run dev
```

Starts the Vite dev server with hot reload.  Access from other devices on
the LAN via the network URL printed in the terminal.

## Build

```bash
bun run build
```

Produces optimized static files in `dist/`.

## Deployment

### Server-side setup (assuming `/var/www/qlinks`)

Clone the repository and build on the server:

```bash
cd /var/www
git clone <repo-url> qlinks
cd qlinks
bun install
bun run build
```

To update after pushing changes:

```bash
cd /var/www/qlinks
git pull
bun install
bun run build
```

### nginx configuration

Add a server block (or include file) for `qlinks.unit03.net`:

```nginx
server {
    listen 443 ssl;
    server_name qlinks.unit03.net;

    ssl_certificate     /etc/letsencrypt/live/qlinks.unit03.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/qlinks.unit03.net/privkey.pem;

    root /var/www/qlinks/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache icons and background images (update cache when files change)
    location ~* ^/(icons|bg)/ {
        expires 7d;
        add_header Cache-Control "public";
    }
}

# Optional: redirect HTTP to HTTPS
server {
    listen 80;
    server_name qlinks.unit03.net;
    return 301 https://$host$request_uri;
}
```

Key points:

- `root` points at the `dist/` subdirectory, not the repo root
- Vite hashes asset filenames (`index-BhTVWftJ.css`), so `assets/` can
  use aggressive caching with `immutable`
- `try_files` with `/index.html` fallback ensures the SPA loads correctly
- Icons use a shorter cache TTL since they may be replaced without a
  filename change

After adding the config:

```bash
nginx -t            # validate config
systemctl reload nginx
```

## Site Configuration

Site-wide settings live in `src/config.json`:

```json
{
  "header_text": "my qlinks> ",
  "background_color": "#1c1c1e",
  "background_img": null
}
```

| Field | Type | Description |
|---|---|---|
| `header_text` | string | Text displayed in the page header above the grid |
| `background_color` | string | CSS color applied to `body` — any valid CSS value (`#rrggbb`, `rgb()`, named color, etc.) |
| `background_img` | string \| null | Path to an image under `public/` (e.g. `"/bg/wallpaper.jpg"`), or `null` for no image |

When `background_img` is set, the image is rendered `cover`-sized and fixed
(no scroll parallax).  The color still shows through if the image has
transparency or fails to load.

To use a background image:

1. Place the image anywhere under `public/` (e.g. `public/bg/wallpaper.jpg`)
2. Set `"background_img": "/bg/wallpaper.jpg"` in `config.json`
3. Rebuild and deploy

To revert to a solid color, set `"background_img": null`.

## Editing Links

Links are defined in `src/links.json`. Each entry:

```json
{
  "label": "Display Name",
  "url": "https://example.com",
  "icon": "/icons/example.png"
}
```

To add or change a link:

1. Edit `src/links.json`
2. Place the icon PNG in `public/icons/`
3. Rebuild and deploy

## Sourcing Icons

Most websites ship high-quality icons that are designed to look good on home
screens and bookmark grids. There are two reliable ways to find them:

### 1. Apple Touch Icon (best quality)

When Apple introduced "Add to Home Screen" on iPhone, they created a
convention: sites place a high-res PNG (typically 180x180) at a well-known
path.  Most major sites support this, making it the best source for crisp
grid icons.

Try these URLs for any site (replace `example.com`):

```
https://example.com/apple-touch-icon.png
https://example.com/apple-touch-icon-precomposed.png
```

If neither works, view the page source and look for a `<link>` tag:

```html
<link rel="apple-touch-icon" href="/path/to/icon.png">
```

The `href` gives you the actual path. Some sites use a CDN URL instead of
a local path.

**Examples that worked for this project:**

| Site | URL |
|---|---|
| Ars Technica | `https://arstechnica.com/apple-touch-icon.png` |
| Amazon | `https://www.amazon.com/apple-touch-icon.png` |
| eBay | `https://www.ebay.com/apple-touch-icon.png` |

### 2. Google Favicon Service (fallback)

Google runs a public API that returns any site's favicon in various sizes.
It's useful when a site doesn't offer an apple-touch-icon, or when you want
a quick grab without digging through source:

```
https://www.google.com/s2/favicons?domain=example.com&sz=128
```

The `sz` parameter controls the size (common values: 32, 64, 128, 256).
Use the largest size available for the best result in the grid.

**Tradeoffs:**

| Method | Pros | Cons |
|---|---|---|
| Apple Touch Icon | Highest resolution, designed for grids | Not every site has one |
| Google Favicon API | Works for any site, easy one-liner | Smaller sizes, may look blurry |

### Tips

- **Save as PNG** — the grid renders `<img>` tags, so PNG works universally
- **Keep sizes consistent** — 128x128 or 180x180 work well in the 4-column
  grid; larger files are fine since Vite doesn't resize them
- **Check visually** — some apple-touch-icons have tight padding or odd
  backgrounds; the Google API result might actually look better in some cases

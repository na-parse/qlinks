# qlinks

A mobile-first quick-links homepage that replicates Safari's Favorites grid
view, designed for use as a new-tab/homepage in Firefox (or other browsers)
on iPhone 14 Pro.

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
| `src/main.ts` | Entry point — loads link data, renders the grid |
| `src/types.ts` | `QuickLink` interface definition |
| `src/links.json` | Link definitions (label, url, icon path) |
| `src/style.css` | Dark theme, 4-column CSS grid, touch feedback |
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

    # SSL certs (adjust paths to match your setup)
    ssl_certificate     /etc/letsencrypt/live/unit03.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/unit03.net/privkey.pem;

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

    # Cache icons (update cache when icons change)
    location /icons/ {
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

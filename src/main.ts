import './style.css'
import type { QuickLink, SiteConfig } from './types.ts'
import links from './links.json'
import config from './config.json'

// =============================================================================
// Background — apply config to body
// =============================================================================

const cfg = config as SiteConfig
const blur_backdrop = cfg.blur_backdrop === true

document.body.style.backgroundColor = cfg.background_color
if (cfg.background_img) {
  document.body.style.backgroundImage = `url('${cfg.background_img}')`
}
if (blur_backdrop) {
  document.getElementById('app')?.classList.add('blur-backdrop')
}

const app = document.querySelector<HTMLDivElement>('#app')!

// =============================================================================
// Header
// =============================================================================

const header = document.createElement('h1')
header.className = 'qlinks-header'
header.textContent = cfg.header_text
app.appendChild(header)

// =============================================================================
// Link tiles
// =============================================================================

;(links as QuickLink[]).forEach((link) => {
  const anchor = document.createElement('a')
  anchor.href = link.url
  anchor.className = 'qlink'

  const img = document.createElement('img')
  img.src = link.icon
  img.alt = link.label
  img.className = 'qlink__icon'
  img.loading = 'eager'

  const label = document.createElement('span')
  label.className = 'qlink__label'
  label.textContent = link.label

  anchor.appendChild(img)
  anchor.appendChild(label)
  app.appendChild(anchor)
})

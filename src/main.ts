import './style.css'
import type { QuickLink, SiteConfig } from './types.ts'
import links from './links.json'
import config from './config.json'

// =============================================================================
// Renderer — Build the grid from link data
// =============================================================================

// =============================================================================
// Background — apply config to body
// =============================================================================

const { header_text, background_color, background_img } = config as SiteConfig

document.body.style.backgroundColor = background_color
if (background_img) {
  document.body.style.backgroundImage = `url('${background_img}')`
}

const app = document.querySelector<HTMLDivElement>('#app')!

// =============================================================================
// Header
// =============================================================================

const header = document.createElement('h1')
header.className = 'qlinks-header'
header.textContent = header_text
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

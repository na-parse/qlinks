import './style.css'
import type { QuickLink } from './types.ts'
import links from './links.json'

// =============================================================================
// Renderer — Build the grid from link data
// =============================================================================

const app = document.querySelector<HTMLDivElement>('#app')!

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

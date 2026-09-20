import '@testing-library/jest-dom/vitest'
import {afterEach, vi} from 'vitest'
import {cleanup} from '@testing-library/react'

afterEach(cleanup)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  })),
})

class TestResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal('ResizeObserver', TestResizeObserver)
HTMLElement.prototype.scrollIntoView = vi.fn()

HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }

// jsdom recognizes :popover-open but cannot implement it without a top layer.
// Report it unsupported so Astryx uses the same fallback as older browsers.
const nativeMatches = Element.prototype.matches
Element.prototype.matches = function (selector: string): boolean {
  if (selector === ':popover-open') throw new DOMException('Popover API unavailable', 'SyntaxError')
  return nativeMatches.call(this, selector)
}
window.scrollTo = vi.fn()

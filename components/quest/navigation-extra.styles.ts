import * as stylex from '@stylexjs/stylex'

export const navigationStyles = stylex.create({
  tokens: {
    '--radius-element': '0px', '--radius-container': '0px', '--radius-full': '0px',
    '--focus-outline-color': 'var(--q-ring)', '--focus-outline-width': '3px',
    '--focus-outline-offset': '3px', '--color-text-primary': 'var(--q-foreground)',
    '--color-text-secondary': 'var(--q-muted-foreground)', '--color-neutral': 'var(--q-accent)',
    '--color-overlay-hover': 'var(--q-accent)', '--color-accent': 'var(--q-primary)',
    '--color-bg-primary': 'var(--q-card)', '--color-bg-secondary': 'var(--q-muted)',
    fontFamily: 'var(--q-font-body)', color: 'var(--q-foreground)',
  },
  trail: {fontFamily: 'var(--q-font-display)', fontSize: 18, paddingBlock: 8},
  item: {fontFamily: 'var(--q-font-display)', borderRadius: 0, transitionProperty: 'none'},
  bar: {padding: 12, gap: 12, minWidth: 0, flexWrap: 'wrap'},
  sidebar: {padding: 8, maxWidth: '100%', minHeight: 240},
  viewport: {
    boxSizing: 'border-box', borderRadius: 0,
    border: {default: '3px solid var(--q-border)', '@media (forced-colors: active)': '3px solid CanvasText'},
    backgroundColor: {default: 'var(--q-card)', '@media (forced-colors: active)': 'Canvas'},
    boxShadow: {default: '4px 4px 0 var(--q-shadow)', '@media (forced-colors: active)': 'none'},
    scrollbarColor: 'var(--q-primary) var(--q-muted)',
  },
})

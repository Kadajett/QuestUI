import * as stylex from '@stylexjs/stylex'

export const cardStyles = stylex.create({
  frame: {
    position: 'relative', isolation: 'isolate', minWidth: 0, padding: 0,
    border: {default: '0 solid transparent', '@media (forced-colors: active)': '2px solid CanvasText'},
    borderRadius: 0, overflow: 'visible', backgroundColor: {default: 'transparent', '@media (forced-colors: active)': 'Canvas'}, boxShadow: 'none',
    fontFamily: 'var(--q-font-body)', color: {default: 'var(--q-card-foreground)', '@media (forced-colors: active)': 'CanvasText'},
    filter: {default: 'drop-shadow(4px 4px 0 var(--q-shadow))', '@media (forced-colors: active)': 'none'},
    '::before': {content: '""', position: 'absolute', zIndex: -1, pointerEvents: 'none', clipPath: 'var(--q-step)', inset: 0, backgroundColor: 'var(--q-highlight)'},
    '::after': {content: '""', position: 'absolute', zIndex: -1, pointerEvents: 'none', clipPath: 'var(--q-step)', inset: 3, backgroundColor: 'var(--q-card)', boxShadow: 'inset 0 4px 0 var(--q-border)'},
  },
  header: {display: 'flex', flexDirection: 'column', gap: 8, padding: 24},
  title: {margin: 0, fontFamily: 'var(--q-font-display)', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.25, overflowWrap: 'anywhere'},
  description: {margin: 0, color: {default: 'var(--q-muted-foreground)', '@media (forced-colors: active)': 'CanvasText'}, fontSize: '1.125rem', lineHeight: 1.4, overflowWrap: 'anywhere'},
  content: {padding: 24, paddingTop: {default: 24, ':is([data-quest-card-header] + *)': 0}, lineHeight: 1.5},
  footer: {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: 24, paddingTop: {default: 24, ':is([data-quest-card-header] + *, [data-quest-card-content] + *)': 0}},
})

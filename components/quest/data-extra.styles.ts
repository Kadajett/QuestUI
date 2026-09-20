import * as stylex from '@stylexjs/stylex'

export const dataStyles = stylex.create({
  frame: {border: '2px solid var(--q-border)', borderRadius: 0, boxShadow: '4px 4px 0 var(--q-shadow)', color: {default: 'var(--q-foreground)', '@media (forced-colors: active)': 'CanvasText'}, backgroundColor: {default: 'var(--q-card)', '@media (forced-colors: active)': 'Canvas'}, fontFamily: 'var(--q-font-body)', minWidth: 0},
  table: {width: '100%', fontFamily: 'var(--q-font-body)'},
  head: {fontFamily: 'var(--q-font-display)', backgroundColor: 'var(--q-muted)', color: 'var(--q-foreground)'},
  caption: {captionSide: 'bottom', padding: 12, color: 'var(--q-muted-foreground)', textAlign: 'start'},
  row: {backgroundColor: {default: null, ':hover': 'var(--q-accent)', ':is([data-selected="true"])': 'var(--q-accent)'}},
  cell: {borderColor: 'var(--q-border)'},
  handle: {borderRadius: 0, backgroundColor: {default: 'var(--q-border)', ':hover': 'var(--q-primary)'}, outline: {default: 'none', ':focus-visible': '3px solid var(--q-ring)'}, outlineOffset: 2},
  panel: {overflow: 'auto', minWidth: 0, minHeight: 0},
  svg: {display: 'block', width: '100%', height: 'auto', overflow: 'visible', color: 'var(--q-muted-foreground)'},
  point: {outline: {default: 'none', ':focus-visible': '3px solid var(--q-ring)'}, cursor: 'crosshair'},
  tooltip: {padding: 8, border: '2px solid var(--q-border)', backgroundColor: 'var(--q-popover)', color: 'var(--q-popover-foreground)', boxShadow: '4px 4px 0 var(--q-shadow)'},
  swatch: (color: string) => ({display: 'inline-block', width: 12, height: 12, backgroundColor: {default: color, '@media (forced-colors: active)': 'CanvasText'}, border: '1px solid currentColor'}),
})

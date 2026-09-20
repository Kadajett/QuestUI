import * as stylex from '@stylexjs/stylex'

export const controlStyles = stylex.create({
  field: {
    position: 'relative', boxSizing: 'border-box', width: '100%', minWidth: 0,
    minHeight: 44, height: 'auto', paddingBlock: 8, paddingInline: 12,
    borderWidth: 3, borderStyle: 'solid', borderColor: {default: 'var(--q-input)', ':focus-within': 'var(--q-ring)'},
    borderRadius: 0, backgroundColor: 'var(--q-card)', color: 'var(--q-card-foreground)',
    fontFamily: 'var(--q-font-body)', fontSize: 22, lineHeight: 1.3,
    clipPath: 'var(--q-step)',
    boxShadow: {default: 'inset 0 3px 0 var(--q-muted)', ':focus-within': 'inset 0 0 0 2px var(--q-ring)'},
    outline: 'none', transitionProperty: 'none',
    '@media (forced-colors: active)': {borderColor: 'ButtonText', clipPath: 'none', backgroundColor: 'Canvas', color: 'CanvasText', boxShadow: 'none'},
  },
  textarea: {display: 'block', minHeight: 112, paddingBlock: 0, paddingInline: 0, '--_textarea-inline-padding': '12px'},
  readOnly: {
    paddingBottom: 38, backgroundColor: 'var(--q-muted)',
    '::after': {content: '"Read only"', position: 'absolute', insetInlineEnd: 10, bottom: 8,
      paddingBlock: 2, paddingInline: 8, clipPath: 'var(--q-step)',
      backgroundColor: 'var(--q-secondary)', color: 'var(--q-secondary-foreground)',
      fontFamily: 'var(--q-font-display)', fontSize: 12, lineHeight: 1.5, pointerEvents: 'none'},
  },
  invalid: {borderColor: 'var(--q-destructive)', boxShadow: 'inset 0 0 0 2px var(--q-destructive)',
    '@media (forced-colors: active)': {borderWidth: 3, borderStyle: 'dashed', borderColor: 'CanvasText'}},
  disabled: {opacity: 0.45, cursor: 'not-allowed', '@media (forced-colors: active)': {opacity: 1, color: 'GrayText', borderColor: 'GrayText'}},
  label: {display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--q-foreground)',
    fontFamily: 'var(--q-font-display)', fontSize: 20, fontVariant: 'small-caps', fontWeight: 700, lineHeight: 1.3, cursor: 'pointer'},
  choice: {gap: 8, minHeight: 44},
  radio: {columnGap: 12},
  select: {width: 'fit-content', minWidth: 140, maxWidth: '100%'},
})

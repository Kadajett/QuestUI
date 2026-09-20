import * as stylex from '@stylexjs/stylex'

export const formExtraStyles = stylex.create({
  field: {fontFamily: 'var(--q-font-body)', color: 'var(--q-foreground)', minWidth: 0},
  group: {padding: 0, height: 'auto', minHeight: 44},
  groupInput: {borderWidth: 0, boxShadow: 'none', clipPath: 'none', backgroundColor: 'transparent'},
  addon: {borderRadius: 0, backgroundColor: 'var(--q-muted)', color: 'var(--q-muted-foreground)', fontFamily: 'var(--q-font-body)', fontSize: 20},
  otp: {display: 'flex', gap: 8, flexWrap: 'wrap'},
  digit: {width: 44, minWidth: 44, paddingInline: 0, textAlign: 'center', caretColor: 'var(--q-ring)'},
  toggle: {
    width: 'auto', minWidth: 44, fontFamily: 'var(--q-font-display)', fontWeight: 700,
    cursor: 'pointer', transitionProperty: 'none',
    backgroundColor: {default: 'var(--q-card)', ':is([aria-pressed="true"])': 'var(--q-secondary)'},
    color: {default: 'var(--q-card-foreground)', ':is([aria-pressed="true"])': 'var(--q-secondary-foreground)'},
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none',
      backgroundColor: {default: 'ButtonFace', ':is([aria-pressed="true"])': 'Highlight'},
      color: {default: 'ButtonText', ':is([aria-pressed="true"])': 'HighlightText'},
    },
  },
})

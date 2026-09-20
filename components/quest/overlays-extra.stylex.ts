import * as stylex from '@stylexjs/stylex'

export const overlayStyles = stylex.create({
  modal: {position: 'fixed', padding: 0, maxWidth: 'calc(100dvw - 24px)'},
  drawer: {position: 'relative', maxWidth: '100%', padding: 0},
  sheet: {
    height: '100dvh', maxHeight: '100dvh', maxWidth: '100dvw',
    margin: 0, top: 0, bottom: 0,
    paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)',
  },
  start: {insetInlineStart: 0, insetInlineEnd: 'auto'},
  end: {insetInlineStart: 'auto', insetInlineEnd: 0},
  text: {fontFamily: 'var(--q-font-body)', fontSize: 20, color: 'var(--q-foreground)'},
  toolbar: {padding: 8, maxWidth: '100%', filter: 'none'},
})

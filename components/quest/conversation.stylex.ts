import * as stylex from '@stylexjs/stylex'

export const conversationStyles = stylex.create({
  frame: {
    borderWidth: 3, borderStyle: 'solid', borderRadius: 0, padding: 12,
    borderColor: {default: 'var(--q-edge)', '@media (forced-colors: active)': 'CanvasText'},
    backgroundColor: {default: 'var(--q-card)', '@media (forced-colors: active)': 'Canvas'},
    color: {default: 'var(--q-foreground)', '@media (forced-colors: active)': 'CanvasText'},
    boxShadow: {default: '3px 3px 0 var(--q-shadow)', '@media (forced-colors: active)': 'none'},
    fontFamily: 'var(--q-font-body)', minWidth: 0, overflowWrap: 'anywhere',
  },
  column: {display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0},
  row: {display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8},
  metadata: {fontFamily: 'var(--q-font-body)', fontSize: 16, color: {default: 'var(--q-muted-foreground)', '@media (forced-colors: active)': 'CanvasText'}},
  title: {fontFamily: 'var(--q-font-display)', fontWeight: 700, fontSize: 20},
  image: {width: 72, height: 72, objectFit: 'cover', imageRendering: 'pixelated'},
  link: {color: {default: 'var(--q-ring)', '@media (forced-colors: active)': 'LinkText'}, textDecoration: 'underline', outlineOffset: 4},
  error: {color: {default: 'var(--q-destructive)', '@media (forced-colors: active)': 'CanvasText'}},
})

'use client'

import {Dialog as AstryxDialog, type DialogProps} from '@astryxdesign/core/Dialog'
import * as stylex from '@stylexjs/stylex'

export type QuestDialogProps = DialogProps

const styles = stylex.create({
  dialog: {
    isolation: 'isolate', boxSizing: 'border-box',
    borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent',
    boxShadow: 'none', filter: 'drop-shadow(6px 6px 0 var(--q-shadow))',
    color: 'var(--q-popover-foreground)', fontFamily: 'var(--q-font-body)',
    fontSize: 20, lineHeight: 1.4,
    '--focus-outline-color': 'var(--q-ring)', '--focus-outline-width': '3px',
    '::before': {
      content: '""', position: 'absolute', inset: 0, zIndex: -1,
      pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-highlight)',
    },
    '::after': {
      content: '""', position: 'absolute', inset: 3, zIndex: -1,
      pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-popover)',
      boxShadow: 'inset 0 4px 0 var(--q-border)',
    },
    '::backdrop': {backgroundColor: 'transparent', backdropFilter: 'none'},
  },
})

/** Native modal with Astryx dismissal, focus management, and a clear backdrop. */
export function Dialog({xstyle, ...props}: QuestDialogProps) {
  return <AstryxDialog {...props} xstyle={[styles.dialog, xstyle]} />
}

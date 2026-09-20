"use client"

import type {ComponentProps} from 'react'
import * as stylex from '@stylexjs/stylex'

export type QuestKbdProps = ComponentProps<'kbd'> & {xstyle?: stylex.StyleXStyles}

const styles = stylex.create({
  key: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '1.5em', paddingBlock: 2, paddingInline: 6, boxSizing: 'border-box',
    borderWidth: 2, borderStyle: 'solid',
    borderColor: {default: 'var(--q-border)', '@media (forced-colors: active)': 'CanvasText'},
    boxShadow: '2px 2px 0 var(--q-shadow)', backgroundColor: 'var(--q-muted)',
    color: 'var(--q-foreground)', fontFamily: 'var(--q-font-body)',
    fontSize: '0.9em', lineHeight: 1, whiteSpace: 'nowrap', verticalAlign: 'middle',
  },
})

export function Kbd({xstyle, className, style, ...props}: QuestKbdProps) {
  const styled = stylex.props(styles.key, xstyle)
  return <kbd {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')}
    style={{...styled.style, ...style}} />
}

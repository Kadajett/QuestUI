"use client"

import type {ComponentProps, ReactNode} from 'react'
import {Badge as AstryxBadge} from '@astryxdesign/core/Badge'
import * as stylex from '@stylexjs/stylex'

export type QuestBadgeVariant = 'primary' | 'secondary' | 'outline' | 'danger'
export type QuestBadgeProps = Omit<ComponentProps<typeof AstryxBadge>, 'variant' | 'label'> & {
  variant?: QuestBadgeVariant
  children?: ReactNode
}

const styles = stylex.create({
  frame: {
    '--q-badge-fill': 'var(--q-primary)', '--q-badge-ink': 'var(--q-primary-foreground)', '--q-badge-edge': 'var(--q-edge)',
    '--q-badge-before-fill': {default: 'var(--q-badge-edge)', '@media (forced-colors: active)': 'transparent'},
    '--q-badge-after-fill': {default: 'var(--q-badge-fill)', '@media (forced-colors: active)': 'transparent'},
    position: 'relative', isolation: 'isolate', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    boxSizing: 'border-box', minHeight: 28, height: 'auto', width: 'fit-content', maxWidth: '100%', paddingBlock: 4, paddingInline: 12,
    borderRadius: 0, border: {default: '0 solid transparent', '@media (forced-colors: active)': '2px solid CanvasText'},
    backgroundColor: {default: 'transparent', '@media (forced-colors: active)': 'Canvas'},
    color: {default: 'var(--q-badge-ink)', '@media (forced-colors: active)': 'CanvasText'},
    fontFamily: 'var(--q-font-display)', fontSize: '.875rem', fontWeight: 700, lineHeight: 1.4,
    verticalAlign: 'middle', overflowWrap: 'anywhere', whiteSpace: 'normal',
    filter: {default: 'drop-shadow(0 2px 0 var(--q-shadow))', '@media (forced-colors: active)': 'none'},
    '::before': {content: '""', position: 'absolute', zIndex: -1, pointerEvents: 'none', clipPath: 'var(--q-step)', inset: 0, backgroundColor: 'var(--q-badge-before-fill)'},
    '::after': {content: '""', position: 'absolute', zIndex: -1, pointerEvents: 'none', clipPath: 'var(--q-step)', inset: 2, backgroundColor: 'var(--q-badge-after-fill)'},
  },
  secondary: {'--q-badge-fill': 'var(--q-secondary)', '--q-badge-ink': 'var(--q-secondary-foreground)', color: {default: 'var(--q-badge-ink)', '@media (forced-colors: active)': 'CanvasText'}},
  outline: {'--q-badge-fill': 'var(--q-card)', '--q-badge-ink': 'var(--q-card-foreground)', '--q-badge-edge': 'var(--q-input)', color: {default: 'var(--q-badge-ink)', '@media (forced-colors: active)': 'CanvasText'}},
  danger: {'--q-badge-fill': 'var(--q-destructive)', '--q-badge-ink': 'var(--q-destructive-foreground)', color: {default: 'var(--q-badge-ink)', '@media (forced-colors: active)': 'CanvasText'}},
})

export function Badge({variant = 'primary', children, xstyle, ...props}: QuestBadgeProps) {
  return <AstryxBadge {...props} label={children} xstyle={[styles.frame, variant !== 'primary' && styles[variant], xstyle]} data-quest-variant={variant} />
}

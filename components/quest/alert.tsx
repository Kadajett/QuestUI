"use client"
import type {ReactNode} from 'react'
import {Banner, type BannerStatus, type BannerProps} from '@astryxdesign/core/Banner'
import * as stylex from '@stylexjs/stylex'
import {PixelIcon} from './pixel-icon'

export type QuestAlertStatus = BannerStatus
export type QuestAlertProps = Omit<BannerProps, 'status'> & {status?: QuestAlertStatus}

const styles = stylex.create({
  frame: {
    '--q-alert-fill': 'var(--q-card)',
    '--q-alert-ink': 'var(--q-card-foreground)',
    '--q-alert-edge': 'var(--q-edge)',
    position: 'relative', isolation: 'isolate',
    display: 'flex', flexDirection: 'column',
    borderWidth: 0, borderRadius: 0, boxSizing: 'border-box',
    backgroundColor: 'transparent', color: 'var(--q-alert-ink)',
    fontFamily: 'var(--q-font-body, "VT323", ui-monospace, monospace)',
    fontSize: 20, lineHeight: 1.35,
    filter: 'drop-shadow(0 4px 0 var(--q-shadow, #a6bbd5))',
    '::before': {
      content: '""', position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none',
      clipPath: 'var(--q-step)', backgroundColor: 'var(--q-alert-edge)',
    },
    '::after': {
      content: '""', position: 'absolute', inset: 3, zIndex: -1, pointerEvents: 'none',
      clipPath: 'var(--q-step)', backgroundColor: 'var(--q-alert-fill)',
    },
    '@media (forced-colors: active)': {borderWidth: 2, borderStyle: 'solid', borderColor: 'CanvasText', backgroundColor: 'Canvas', color: 'CanvasText', filter: 'none', '::before': {display: 'none'}, '::after': {display: 'none'}},
  },
  info: {color: 'var(--q-secondary-foreground)', '--q-alert-fill': 'var(--q-secondary)', '--q-alert-ink': 'var(--q-secondary-foreground)'},
  success: {color: 'var(--q-foreground)', '--q-alert-fill': 'var(--q-muted)', '--q-alert-ink': 'var(--q-foreground)'},
  warning: {color: 'var(--q-accent-foreground)', '--q-alert-fill': 'var(--q-accent)', '--q-alert-ink': 'var(--q-accent-foreground)'},
  error: {color: 'var(--q-destructive-foreground)', '--q-alert-fill': 'var(--q-destructive)', '--q-alert-ink': 'var(--q-destructive-foreground)'},
  title: {color: 'var(--q-alert-ink)', fontFamily: 'var(--q-font-display, "Pixelify Sans", monospace)', fontWeight: 700, fontSize: 22},
})

/** Astryx Banner semantics with Quest's stepped pixel frame. */
export function Alert({status = 'info', title, icon, xstyle, ...props}: QuestAlertProps): ReactNode {
  return <Banner {...props} status={status}
    icon={icon ?? <PixelIcon name={status === 'success' ? 'check' : 'spark'} />}
    title={<span {...stylex.props(styles.title)}>{title}</span>}
    xstyle={[styles.frame, styles[status], xstyle]} />
}

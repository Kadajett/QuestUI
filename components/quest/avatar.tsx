"use client"

import type {ComponentProps} from 'react'
import {Avatar as AstryxAvatar} from '@astryxdesign/core/Avatar'
import * as stylex from '@stylexjs/stylex'

export type QuestAvatarSize = 'sm' | 'md' | 'lg'
export type QuestAvatarProps = Omit<ComponentProps<typeof AstryxAvatar>, 'size' | 'shape'> & {size?: QuestAvatarSize}

const styles = stylex.create({
  frame: {
    '--q-avatar-text': '18px', display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center',
    boxSizing: 'border-box', width: 48, height: 48, borderWidth: 3, borderStyle: 'solid', borderRadius: 0,
    borderColor: {default: 'var(--q-highlight)', '@media (forced-colors: active)': 'CanvasText'},
    backgroundColor: {default: 'var(--q-muted)', '@media (forced-colors: active)': 'Canvas'},
    color: {default: 'var(--q-foreground)', '@media (forced-colors: active)': 'CanvasText'},
    boxShadow: {default: '4px 4px 0 var(--q-shadow)', '@media (forced-colors: active)': 'none'},
    fontFamily: 'var(--q-font-display)', fontSize: 'var(--q-avatar-text)', fontWeight: 700, lineHeight: 1, verticalAlign: 'middle', imageRendering: 'pixelated',
  },
  sm: {'--q-avatar-text': '12px', width: 32, height: 32, fontSize: 'var(--q-avatar-text)'},
  lg: {'--q-avatar-text': '24px', width: 64, height: 64, fontSize: 'var(--q-avatar-text)'},
})

/** Astryx owns failed-image recovery, initials, accessible naming and interactive links. */
export function Avatar({size = 'md', xstyle, ...props}: QuestAvatarProps) {
  return <AstryxAvatar {...props} shape="square" size={size === 'sm' ? 32 : size === 'lg' ? 64 : 48}
    xstyle={[styles.frame, size !== 'md' && styles[size], xstyle]} data-quest-size={size} />
}

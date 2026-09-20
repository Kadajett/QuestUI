"use client"

import type {ComponentProps} from 'react'
import {Divider as AstryxDivider} from '@astryxdesign/core/Divider'
import * as stylex from '@stylexjs/stylex'

export type QuestSeparatorProps = Omit<ComponentProps<typeof AstryxDivider>, 'label' | 'variant' | 'isFullBleed'> & {decorative?: boolean}

const styles = stylex.create({
  base: {
    boxSizing: 'border-box', flexShrink: 0, borderWidth: 0, borderStyle: 'solid',
    borderColor: {default: 'var(--q-border)', '@media (forced-colors: active)': 'CanvasText'},
    overflow: 'hidden',
  },
  horizontal: {width: '100%', height: 2, borderTopWidth: 2},
  vertical: {alignSelf: 'stretch', width: 2, height: 'auto', minHeight: '1em', borderLeftWidth: 2},
})

export function Separator({orientation = 'horizontal', decorative = true, xstyle, ...props}: QuestSeparatorProps) {
  return <AstryxDivider {...props} orientation={orientation} aria-hidden={decorative || undefined}
    xstyle={[styles.base, styles[orientation], xstyle]} data-orientation={orientation} />
}

"use client"

import type {ComponentProps} from 'react'
import {EmptyState as AstryxEmptyState} from '@astryxdesign/core/EmptyState'
import * as stylex from '@stylexjs/stylex'

export type QuestEmptyProps = ComponentProps<typeof AstryxEmptyState>

const styles = stylex.create({
  frame: {
    borderWidth: 2, borderStyle: 'dashed',
    borderColor: {default: 'var(--q-border)', '@media (forced-colors: active)': 'CanvasText'},
    backgroundColor: 'var(--q-card)', color: 'var(--q-card-foreground)',
    fontFamily: 'var(--q-font-display)', boxShadow: '4px 4px 0 var(--q-shadow)',
  },
})

export function Empty({xstyle, ...props}: QuestEmptyProps) {
  return <AstryxEmptyState {...props} xstyle={[styles.frame, xstyle]} />
}
